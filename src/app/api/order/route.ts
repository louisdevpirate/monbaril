// app/api/order/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session_id = body.session_id;

    if (!session_id) {
      return NextResponse.json({ error: "session_id manquant" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select("order_number")
      .eq("stripe_session_id", session_id)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order_number: order.order_number });
  } catch (err) {
    console.error("❌ Erreur API order :", err);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 }
    );
  }
}