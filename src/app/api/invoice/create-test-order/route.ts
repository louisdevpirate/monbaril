// src/app/api/invoice/create-test-order/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateInvoiceById } from "@/lib/pdf/generateInvoiceById";

export async function POST() {
  try {
    const supabase = createClient();
    
    // Créer une commande de test
    const testOrder = {
      order_id: `CMD-TEST-${Date.now()}`,
      email: "test@monbaril.com",
      status: "confirmed",
      user_id: "test-user-123"
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select()
      .single();

    if (orderError) {
      throw new Error(`Erreur création commande: ${orderError.message}`);
    }

    // Créer des articles de test avec tes vrais produits
    const testItems = [
      {
        order_id: order.order_id,
        product_name: "Baril Racing Gulf",
        quantity: 2,
        price: 149,
        image: "/barils/baril1.png",
        user_id: "test-user-123"
      },
      {
        order_id: order.order_id,
        product_name: "Baril Militaire Cargo",
        quantity: 1,
        price: 129,
        image: "/barils/baril2.png",
        user_id: "test-user-123"
      }
    ];

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .insert(testItems)
      .select();

    if (itemsError) {
      throw new Error(`Erreur création articles: ${itemsError.message}`);
    }

    // Générer la facture
    const buffer = await generateInvoiceById(order.order_id);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="facture-${order.order_id}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Erreur lors de la création de la commande de test:", error);
    return NextResponse.json(
      { 
        error: "Erreur lors de la création", 
        message: error instanceof Error ? error.message : "Erreur inconnue" 
      },
      { status: 500 }
    );
  }
} 