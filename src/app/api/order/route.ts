import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session_id = body.session_id;

    if (!session_id || typeof session_id !== 'string' || session_id.length > 200) {
      return NextResponse.json({ error: "session_id invalide" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // Vérifier si l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser();

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        order_number,
        email,
        user_id,
        total_price,
        status,
        created_at,
        order_items (
          id,
          product_id,
          quantity,
          price,
          product_name,
          image
        )
      `)
      .eq("stripe_session_id", session_id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    // Si l'utilisateur est connecté, vérifier qu'il est bien le propriétaire
    if (user && order.user_id && order.user_id !== user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Ne pas exposer user_id dans la réponse
    const { user_id: _, ...safeOrder } = order;
    return NextResponse.json(safeOrder);

  } catch (err) {
    console.error("Erreur API order:", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}