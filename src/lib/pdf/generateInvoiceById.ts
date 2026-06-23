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

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderId)
    .single();

  if (orderError || !order) {
    throw new Error(`Commande non trouvée: ${orderId}`);
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  if (itemsError || !items) {
    throw new Error(`Articles non trouvés pour la commande: ${orderId}`);
  }

  const total_price = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return generateInvoiceBuffer({ order, items, total_price });
}

async function generateInvoiceBuffer(invoice: InvoiceData): Promise<Buffer> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;
  const orange = [232, 93, 4] as [number, number, number];
  const dark = [20, 20, 20] as [number, number, number];
  const gray = [120, 120, 120] as [number, number, number];
  const lightGray = [245, 245, 245] as [number, number, number];

  // ── Header band ──────────────────────────────────────────────
  doc.setFillColor(...dark);
  doc.rect(0, 0, W, 40, 'F');

  // Brand name (simulated Bebas Neue with bold helvetica)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text('MONBARIL', 14, 26);

  // TM in orange — tight to the brand name
  doc.setFontSize(8);
  doc.setTextColor(...orange);
  doc.text('TM', 67, 19);

  // "FACTURE" label on the right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...orange);
  doc.text('FACTURE', W - 14, 26, { align: 'right' });

  // ── Invoice meta block ────────────────────────────────────────
  const orderDate = new Date(invoice.order.created_at);
  const formattedDate = orderDate.toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const invoiceNumber = invoice.order.order_number;

  // Left: company info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text('MonBaril™', 14, 52);
  doc.text('contact@monbaril.fr', 14, 57);
  doc.text('monbaril.fr', 14, 62);

  // Right: invoice info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...dark);
  doc.text('Numéro de facture :', W - 70, 52);
  doc.text('Date :', W - 70, 58);
  doc.text('Statut :', W - 70, 64);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  doc.text(invoiceNumber, W - 14, 52, { align: 'right' });
  doc.text(formattedDate, W - 14, 58, { align: 'right' });
  doc.text('Payé', W - 14, 64, { align: 'right' });

  // ── Divider ───────────────────────────────────────────────────
  doc.setDrawColor(...orange);
  doc.setLineWidth(0.5);
  doc.line(14, 72, W - 14, 72);

  // ── Bill to ───────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text('FACTURÉ À', 14, 82);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...dark);
  doc.text(invoice.order.email, 14, 89);

  // ── Table header ──────────────────────────────────────────────
  const tableTop = 100;
  doc.setFillColor(...dark);
  doc.rect(14, tableTop, W - 28, 9, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('PRODUIT', 18, tableTop + 6);
  doc.text('QTÉ', 130, tableTop + 6, { align: 'center' });
  doc.text('PRIX UNIT.', 160, tableTop + 6, { align: 'center' });
  doc.text('TOTAL', W - 18, tableTop + 6, { align: 'right' });

  // ── Table rows ────────────────────────────────────────────────
  let y = tableTop + 9;
  invoice.items.forEach((item, i) => {
    const rowH = 12;
    if (i % 2 === 0) {
      doc.setFillColor(...lightGray);
      doc.rect(14, y, W - 28, rowH, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...dark);
    doc.text(item.product_name, 18, y + 7.5);
    doc.text(String(item.quantity), 130, y + 7.5, { align: 'center' });
    doc.text(`${item.price.toFixed(2)} €`, 160, y + 7.5, { align: 'center' });
    doc.text(`${(item.price * item.quantity).toFixed(2)} €`, W - 18, y + 7.5, { align: 'right' });

    y += rowH;
  });

  // ── Totals block ──────────────────────────────────────────────
  y += 6;
  const totalX = W - 14;
  const labelX = W - 70;

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(labelX - 4, y, totalX, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text('Sous-total HT', labelX, y);
  doc.text(`${invoice.total_price.toFixed(2)} €`, totalX, y, { align: 'right' });

  y += 6;
  doc.text('TVA (0%)', labelX, y);
  doc.text('0.00 €', totalX, y, { align: 'right' });

  y += 6;
  doc.setDrawColor(...orange);
  doc.setLineWidth(0.5);
  doc.line(labelX - 4, y, totalX, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...dark);
  doc.text('TOTAL TTC', labelX, y);
  doc.setTextColor(...orange);
  doc.text(`${invoice.total_price.toFixed(2)} €`, totalX, y, { align: 'right' });

  // ── Payment badge ─────────────────────────────────────────────
  y += 10;
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(labelX - 4, y - 5, totalX - labelX + 4, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52);
  doc.text('PAIEMENT RECU', (labelX - 4 + totalX) / 2, y + 1.5, { align: 'center' });

  // ── Footer ────────────────────────────────────────────────────
  const footerY = 272;
  doc.setFillColor(...dark);
  doc.rect(0, footerY, W, 25, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.text('Merci pour votre confiance et votre achat.', W / 2, footerY + 8, { align: 'center' });
  doc.text('Pour toute question : contact@monbaril.fr  •  monbaril.fr', W / 2, footerY + 14, { align: 'center' });

  doc.setTextColor(...orange);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('MonBaril™ — Brut. Rare. Intemporel.', W / 2, footerY + 20, { align: 'center' });

  const pdfBytes = doc.output('arraybuffer');
  return Buffer.from(pdfBytes);
}
