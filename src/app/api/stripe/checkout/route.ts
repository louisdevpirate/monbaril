import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { stripeCheckoutSchema } from "@/lib/validation/schemas";
import { validateData } from "@/lib/validation/validate";
import { getCurrentUserFromServer } from "@/lib/auth/server-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as Stripe.LatestApiVersion,
});

/**
 * Frais de port.
 *
 * Attention avant d'ajouter des zones : Stripe Checkout n'associe pas une
 * option d'expédition à un pays. Tout ce que contient `shipping_options` est
 * proposé à tout le monde, quelle que soit l'adresse saisie. Deux tarifs
 * « France » et « reste de l'UE » côte à côte laisseraient donc un acheteur
 * belge choisir le tarif France — sur un fût de 200 L, la différence est
 * perdue à chaque envoi.
 *
 * Tant qu'un seul tarif est facturé, la seule protection est de limiter les
 * pays livrables à la zone que ce tarif couvre. Pour ouvrir l'UE il faudra
 * demander le pays sur le site AVANT de créer la session, et n'y mettre que
 * l'option correspondante.
 */
const SHIPPING = {
  countries: ["FR", "MC"] as const,
  options: [
    {
      // ⚠️ Montant en CENTIMES — à caler sur le tarif transporteur réel.
      // Un fût part en messagerie palette : le port pèse une part importante
      // de la marge, ce tarif ne doit pas être posé au hasard.
      amountCents: 4900,
      label: "Livraison à domicile",
      // Fabrication (7-10 j selon les CGV) + acheminement palette.
      minBusinessDays: 9,
      maxBusinessDays: 14,
    },
    {
      // Le retrait échappe au problème des zones : contrairement à deux
      // tarifs géographiques, personne ne peut en tirer profit sans venir
      // réellement chercher son baril. La ville est dans le libellé pour que
      // l'option ne soit pas prise pour une livraison offerte — et c'est bien
      // la commune de l'atelier, pas le siège social ni la métropole voisine.
      amountCents: 0,
      label: "Retrait à l'atelier — Longvic (21)",
      // Délai de fabrication seul. Ces bornes reprennent le « 7 à 10 jours
      // ouvrés avant expédition » des CGV et de la FAQ : le tunnel de paiement
      // ne doit pas promettre plus court que le document qui engage.
      minBusinessDays: 7,
      maxBusinessDays: 10,
    },
  ],
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const correctedBody = {
      ...body,
      items: body.items.map((item: { id?: string }, index: number) => ({
        ...item,
        id: item.id || `item-${index}`,
      })),
      total_price: body.total_price ?? body.items.reduce(
        (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
        0
      ),
    };

    const validation = validateData(stripeCheckoutSchema, correctedBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.errors },
        { status: 400 }
      );
    }

    const validatedBody = validation.data!;

    const line_items = validatedBody.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      customer_email: validatedBody.email,
      customer_creation: "always",
      // Adresse obligatoire, restreinte à la zone couverte par le tarif
      shipping_address_collection: {
        allowed_countries: [
          ...SHIPPING.countries,
        ] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: SHIPPING.options.map((option) => ({
        shipping_rate_data: {
          type: "fixed_amount" as const,
          fixed_amount: { amount: option.amountCents, currency: "eur" },
          display_name: option.label,
          delivery_estimate: {
            minimum: { unit: "business_day" as const, value: option.minBusinessDays },
            maximum: { unit: "business_day" as const, value: option.maxBusinessDays },
          },
        },
      })),
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      payment_intent_data: {
        statement_descriptor: "MONBARIL",
      },
    });

    const supabase = await createSupabaseServerClient();

    const user = await getCurrentUserFromServer();
    const userId = user?.id || validatedBody.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour passer commande" },
        { status: 401 }
      );
    }

    // Numéro de commande via séquence atomique côté DB (évite les doublons)
    const { data: seqData, error: seqError } = await supabase
      .rpc('get_next_order_number');

    if (seqError || !seqData) {
      // Fallback: timestamp-based unique number
      const fallbackNumber = `CMD-${Date.now()}`;
      console.error('Erreur séquence order_number, fallback utilisé:', seqError);
      return createOrder(supabase, fallbackNumber, validatedBody, session, userId);
    }

    return createOrder(supabase, seqData, validatedBody, session, userId);

  } catch (err) {
    console.error("Erreur Stripe Checkout:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session Stripe" },
      { status: 500 }
    );
  }
}

async function createOrder(
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createSupabaseServerClient>>,
  orderNumber: string,
  validatedBody: { email: string; items: Array<{ id: string; name: string; price: number; quantity: number; image: string }>; total_price: number; userId?: string },
  session: Stripe.Checkout.Session,
  userId: string
) {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{
      order_number: orderNumber,
      email: validatedBody.email,
      status: "pending",
      user_id: userId,
      total_price: validatedBody.total_price ?? null,
      stripe_session_id: session.id,
    }])
    .select()
    .single();

  if (orderError || !order) {
    console.error("Erreur création commande:", orderError);
    return NextResponse.json({ error: "Erreur création commande" }, { status: 500 });
  }

  for (const item of validatedBody.items) {
    // L'id est la source de vérité : le nom affiché peut porter la
    // configuration choisie (« … — RAL 3020 Rouge · Brillant ») et ne
    // correspond alors plus au titre du produit en base.
    const { data: byId } = await supabase
      .from("products")
      .select("id")
      .eq("id", item.id)
      .maybeSingle();

    let product = byId;
    if (!product) {
      const { data: byTitle } = await supabase
        .from("products")
        .select("id")
        .eq("title", item.name)
        .maybeSingle();
      product = byTitle;
    }

    if (!product) {
      console.error("Produit non trouvé:", item.id, item.name);
      return NextResponse.json(
        { error: `Produit non trouvé: ${item.name}` },
        { status: 400 }
      );
    }

    const { error: itemError } = await supabase.from("order_items").insert([{
      order_id: order.id,
      product_id: product.id,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      user_id: userId,
    }]);

    if (itemError) {
      console.error("Erreur insertion item:", itemError);
      return NextResponse.json(
        { error: "Erreur ajout item", details: itemError.message },
        { status: 500 }
      );
    }
  }

  // Les stats du profil (total_orders / total_spent) ne sont PAS mises à jour
  // ici : à ce stade rien n'est payé, et un visiteur qui abandonne sur Stripe
  // gonflerait ses compteurs. Elles le sont dans le webhook, sur
  // `checkout.session.completed`, à partir du montant réellement encaissé
  // (frais de port compris, ce que `total_price` ne couvre pas).

  return NextResponse.json({
    url: session.url,
    orderNumber: order.order_number,
  });
}
