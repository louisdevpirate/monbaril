import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { sendOrderConfirmationEmail } from '@/lib/email/transactional-emails';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('❌ Erreur signature webhook:', err);
      return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
    }

    console.log('🔔 Webhook reçu:', event.type);

    // Gérer l'événement de paiement réussi
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('✅ Paiement confirmé pour la session:', session.id);

      // Récupérer la commande depuis Supabase
      const supabase = createSupabaseAdminClient();
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
        .eq('stripe_session_id', session.id)
        .single();

      if (orderError || !order) {
        console.error('❌ Commande non trouvée pour la session:', session.id);
        return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
      }

      // Adresses collectées par Stripe Checkout
      // (shipping_details selon la version d'API, sinon customer_details)
      const shippingDetails =
        (session as Stripe.Checkout.Session & {
          shipping_details?: { name?: string | null; address?: Stripe.Address | null };
        }).shipping_details ?? null;

      const shippingName =
        shippingDetails?.name ?? session.customer_details?.name ?? null;
      const shippingAddress =
        shippingDetails?.address ?? session.customer_details?.address ?? null;
      const billingAddress = session.customer_details?.address ?? null;
      const customerPhone = session.customer_details?.phone ?? null;

      // Mettre à jour le statut de la commande + adresses
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'processing',
          shipping_name: shippingName,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          customer_phone: customerPhone,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('❌ Erreur mise à jour commande:', updateError);
        return NextResponse.json({ error: 'Erreur mise à jour commande' }, { status: 500 });
      }

      // Confirmer le stock (convertir réservation en vente réelle)
      try {
        for (const item of order.order_items || []) {
          const { error: stockError } = await supabase.rpc('confirm_order_stock', {
            p_product_id: item.product_id,
            p_user_id: order.user_id,
            p_quantity: item.quantity
          });

          if (stockError) {
            console.error('❌ Erreur confirmation stock:', stockError);
          }
        }
      } catch (stockError) {
        console.error('❌ Erreur confirmation stock:', stockError);
      }

      // ENVOYER L'EMAIL DE CONFIRMATION MAINTENANT QUE LE PAIEMENT EST CONFIRMÉ
      try {
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
          status: 'processing',
          orderDate: order.created_at
        };

        await sendOrderConfirmationEmail(orderEmailData);
        console.log('✅ Email de confirmation envoyé après paiement confirmé');
      } catch (emailError) {
        console.error('❌ Erreur envoi email:', emailError);
        // On continue même si l'email échoue
      }

      console.log('✅ Commande traitée avec succès:', order.order_number);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ Erreur webhook:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
