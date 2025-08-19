import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as any,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    // 👇 On récupère la session AVEC le customer étendu
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer"],
    });

    // 👇 Selon que customer est une string ou un objet, on adapte
    const customer = session.customer as Stripe.Customer;
    const email = customer.email || session.customer_email;

    console.log("✅ Email récupéré depuis Stripe :", email);

    return NextResponse.json({ customer_email: email });
  } catch (err) {
    console.error("❌ Erreur récupération session Stripe :", err);
    return NextResponse.json({ error: "Erreur récupération session" }, { status: 500 });
  }
}