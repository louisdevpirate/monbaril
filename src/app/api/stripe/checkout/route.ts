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
  // ⚠️ Montant en CENTIMES — à caler sur le tarif transporteur réel.
  amountCents: 4900,
  label: "Livraison à domicile",
  countries: ["FR", "MC"] as const,
  minBusinessDays: 5,
  maxBusinessDays: 10,
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
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: SHIPPING.amountCents, currency: "eur" },
            display_name: SHIPPING.label,
            delivery_estimate: {
              minimum: { unit: "business_day", value: SHIPPING.minBusinessDays },
              maximum: { unit: "business_day", value: SHIPPING.maxBusinessDays },
            },
          },
        },
      ],
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
      return createOrder(supabase, fallbackNumber, validatedBody, session, userId, user);
    }

    return createOrder(supabase, seqData, validatedBody, session, userId, user);

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
  userId: string,
  user: { id: string } | null
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

  // Mise à jour stats profil (non-bloquant)
  if (user?.id) {
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("total_orders, total_spent")
      .eq("id", user.id)
      .single();

    if (currentProfile) {
      await supabase
        .from("profiles")
        .update({
          total_orders: (currentProfile.total_orders || 0) + 1,
          total_spent: (parseFloat(currentProfile.total_spent || "0") + validatedBody.total_price).toFixed(2),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }
  }

  return NextResponse.json({
    url: session.url,
    orderNumber: order.order_number,
  });
}
