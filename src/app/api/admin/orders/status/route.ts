import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUserFromServer } from '@/lib/auth/server-auth';
import { sendOrderStatusUpdateEmail } from '@/lib/email/transactional-emails';
import { validateData } from '@/lib/validation/validate';

const orderStatusUpdateSchema = z.object({
  orderId: z.string().min(1),
  newStatus: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  trackingNumber: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification admin
    const user = await getCurrentUserFromServer();
    if (!user || !['admin', 'moderator'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Valider les données
    const validation = validateData(orderStatusUpdateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.errors },
        { status: 400 }
      );
    }

    const { orderId, newStatus, trackingNumber } = validation.data!;
    const supabase = await createSupabaseServerClient();

    // Récupérer la commande avec les items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_slug,
          quantity,
          price,
          product_name,
          product_image
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Erreur récupération commande:', orderError);
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut de la commande
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...(trackingNumber && { tracking_number: trackingNumber })
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Erreur mise à jour statut:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du statut' },
        { status: 500 }
      );
    }

    // Envoyer l'email de notification
    try {
      const orderEmailData = {
        orderNumber: order.order_number,
        customerEmail: order.email,
        items: order.order_items?.map((item: any) => ({
          name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          image: item.product_image
        })) || [],
        totalPrice: order.total_price || 0,
        status: newStatus,
        orderDate: order.created_at,
        trackingNumber: trackingNumber
      };

      const emailSent = await sendOrderStatusUpdateEmail(orderEmailData);
      
      if (!emailSent) {
        console.warn('Email de notification non envoyé pour la commande:', order.order_number);
      }
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      // On continue même si l'email échoue
    }

    console.log(`✅ Statut commande ${order.order_number} mis à jour: ${newStatus}`);

    return NextResponse.json({
      success: true,
      message: 'Statut mis à jour avec succès',
      order: {
        id: order.id,
        order_number: order.order_number,
        status: newStatus,
        updated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erreur API mise à jour statut:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
