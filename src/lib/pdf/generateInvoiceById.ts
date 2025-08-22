// ✅ generateInvoiceById.ts - Génération de factures à partir d'un vrai ID de commande
import jsPDF from "jspdf";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Order, OrderItem } from "@/types/supabase";

interface InvoiceData {
  order: Order;
  items: OrderItem[];
  total_price: number;
}

export async function generateInvoiceById(orderId: string): Promise<Buffer> {
  const supabase = await createSupabaseServerClient();
  
  // Récupérer la commande par order_number
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderId)
    .single();

  if (orderError || !order) {
    throw new Error(`Commande non trouvée: ${orderId}`);
  }

  // Récupérer les articles de la commande par l'id numérique de la commande
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  if (itemsError || !items) {
    throw new Error(`Articles non trouvés pour la commande: ${orderId}`);
  }

  // Calculer le total
  const total_price = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return generateInvoiceBuffer({
    order,
    items,
    total_price
  });
}

async function generateInvoiceBuffer(invoice: InvoiceData): Promise<Buffer> {
  const doc = new jsPDF();

  // Titre
  doc.setFontSize(20);
  doc.text("MonBaril - Facture", 105, 20, { align: "center" });

  // Informations de commande
  doc.setFontSize(12);
  doc.text(`Commande : ${invoice.order.order_number}`, 20, 40);
  doc.text(`Email client : ${invoice.order.email}`, 20, 50);
  doc.text(`Date : ${new Date(invoice.order.created_at).toLocaleDateString("fr-FR")}`, 20, 60);
  doc.text(`Statut : ${invoice.order.status}`, 20, 70);

  // Détail de la commande
  doc.text("Détail de la commande :", 20, 90);
  
  let yPosition = 100;
  invoice.items.forEach((item) => {
    doc.text(`- ${item.product_name} x${item.quantity} - ${item.price.toFixed(2)} €`, 20, yPosition);
    yPosition += 10;
  });

  // Total
  doc.setFontSize(14);
  doc.text(`Total : ${invoice.total_price.toFixed(2)} €`, 150, yPosition + 10, { align: "right" });

  // Pied de page
  doc.setFontSize(10);
  doc.text("Merci pour votre confiance !", 105, yPosition + 30, { align: "center" });

  // Retourner le PDF comme Buffer
  const pdfBytes = doc.output('arraybuffer');
  return Buffer.from(pdfBytes);
}