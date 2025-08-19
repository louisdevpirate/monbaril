import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendOrderConfirmation } from "@/lib/email/send-order-confirmation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📦 Stripe items reçus :", body.items);

    const line_items = body.items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      customer_email: body.email,
      customer_creation: "always",
    });

    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1️⃣ Créer la commande (id auto-généré)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          email: body.email,
          status: "pending",
          user_id: user?.id ?? null,
          total_price: body.total_price ?? null,
          stripe_session_id: session.id,
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      console.error("❌ Erreur création commande :", orderError);
      return NextResponse.json(
        { error: "Erreur création commande" },
        { status: 500 }
      );
    }

    // 2️⃣ Numéro de commande formaté (CMD-00001)
    const orderNumber = order.order_number;

    // 3️⃣ Insertion des items
    for (const item of body.items) {
      const { error: itemError } = await supabase.from("order_items").insert([
        {
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        },
      ]);

      if (itemError) {
        console.error("❌ Erreur insertion item :", itemError);
        return NextResponse.json(
          { error: "Erreur ajout item", details: itemError.message },
          { status: 500 }
        );
      }
    }

    // 4️⃣ Email confirmation avec numéro propre
    if (body.email && orderNumber) {
      await sendOrderConfirmation({
        to: body.email,
        orderNumber,
      });
    }

    console.log("✅ Commande enregistrée avec succès !");
    return NextResponse.json({
      url: session.url,
      orderNumber, // <-- Optionnel si tu veux l'afficher dans le front aussi
    });
  } catch (err) {
    console.error("❌ Erreur Stripe Checkout :", err);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session Stripe" },
      { status: 500 }
    );
  }
}
