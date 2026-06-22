import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendOrderConfirmationEmail } from "@/lib/email/transactional-emails";

export async function POST(req: Request) {
  try {
    const { orderNumber } = await req.json();

    if (!orderNumber) {
      return NextResponse.json({ error: "Numéro de commande requis" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // Vérifier que l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Récupérer les détails de la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          price,
          product_name,
          image
        )
      `)
      .eq('order_number', orderNumber)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    // Vérifier que la commande appartient à l'utilisateur connecté
    if (order.user_id !== user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Préparer les données pour l'email
    const orderEmailData = {
      orderNumber: order.order_number,
      customerEmail: order.email,
      items: order.order_items?.map((item: any) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })) || [],
      totalPrice: order.total_price || 0,
      status: order.status || 'processing',
      orderDate: order.created_at
    };

    // Envoyer l'email
    await sendOrderConfirmationEmail(orderEmailData);
    console.log('✅ Email de confirmation envoyé avec succès');

    return NextResponse.json({ success: true, message: "Email envoyé" });

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
