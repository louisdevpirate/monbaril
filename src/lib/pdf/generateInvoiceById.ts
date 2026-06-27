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
  const M = 20; // marge
  const dark = [30, 30, 30] as [number, number, number];
  const orange = [232, 93, 4] as [number, number, number];
  const gray = [100, 100, 100] as [number, number, number];

  const orderDate = new Date(invoice.order.created_at);
  const day = String(orderDate.getDate()).padStart(2, '0');
  const month = String(orderDate.getMonth() + 1).padStart(2, '0');
  const year = orderDate.getFullYear();
  const formattedDate = `${day} / ${month} / ${year}`;
  const invoiceNumber = invoice.order.order_number;

  // ── Logo MonBaril™ (haut gauche) ──────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...dark);
  doc.text('MonBaril', M, 25);
  doc.setFontSize(9);
  doc.setTextColor(...orange);
  doc.text('™', M + 42, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...gray);
  doc.text('F A I T E S   L E   P L E I N   D E   S T Y L E', M, 30);

  // ── FACTURE (haut droite) ─────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(48);
  doc.setTextColor(...dark);
  doc.text('FACTURE', W - M, 28, { align: 'right' });

  // ── Infos facture (droite) ────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...dark);
  doc.text(`N° : ${invoiceNumber}`, W - M, 40, { align: 'right' });
  doc.text(`DATE : ${formattedDate}`, W - M, 46, { align: 'right' });
  doc.text('ÉCHÉANCE : À RÉCEPTION', W - M, 52, { align: 'right' });

  // ── Trait séparateur ──────────────────────────────────────────
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(M, 62, W - M, 62);

  // ── Émetteur (gauche) ─────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...dark);
  doc.text('ÉMETTEUR :', M, 72);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text('MonBaril™', M, 79);
  doc.text('contact@monbaril.fr', M, 84);
  doc.text('www.monbaril.fr', M, 89);

  // ── Destinataire (droite) ─────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...dark);
  doc.text('DESTINATAIRE :', W - M, 72, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  doc.text(invoice.order.email, W - M, 79, { align: 'right' });

  // ── Tableau : en-tête ─────────────────────────────────────────
  const tableTop = 105;
  const col1 = M;
  const col2 = 100;
  const col3 = 140;
  const col4 = W - M;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...dark);
  doc.text('DESCRIPTION :', col1, tableTop);
  doc.text('QUANTITÉ :', col2, tableTop);
  doc.text('PRIX UNITAIRE HT :', col3, tableTop);
  doc.text('TOTAL HT :', col4, tableTop, { align: 'right' });

  doc.setDrawColor(...dark);
  doc.setLineWidth(0.5);
  doc.line(col1, tableTop + 2, col4, tableTop + 2);

  // ── Tableau : lignes ──────────────────────────────────────────
  let y = tableTop + 12;
  invoice.items.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...dark);
    doc.text(item.product_name, col1, y);
    doc.text(String(item.quantity), col2 + 10, y, { align: 'center' });
    doc.text(`${item.price.toFixed(2)}€`, col3 + 15, y, { align: 'center' });
    doc.text(`${(item.price * item.quantity).toFixed(2)}€`, col4, y, { align: 'right' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(col1, y + 4, col4, y + 4);

    y += 14;
  });

  // ── Totaux ────────────────────────────────────────────────────
  y += 4;
  const labelX = col3;
  const valX = col4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...dark);
  doc.text('TOTAL HT :', labelX, y, { align: 'right' });
  doc.text(`${invoice.total_price.toFixed(2)}€`, valX, y, { align: 'right' });

  y += 7;
  doc.text('TVA :', labelX, y, { align: 'right' });
  doc.text('00,00€', valX, y, { align: 'right' });

  y += 7;
  doc.text('REMISE :', labelX, y, { align: 'right' });
  doc.text('-', valX, y, { align: 'right' });

  y += 3;
  doc.setDrawColor(...dark);
  doc.setLineWidth(0.5);
  doc.line(labelX - 30, y, valX, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL TTC :', labelX, y, { align: 'right' });
  doc.text(`${invoice.total_price.toFixed(2)}€`, valX, y, { align: 'right' });

  // ── Pied de page : Règlement + Termes ─────────────────────────
  const footerY = 245;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(M, footerY, W - M, footerY);

  // Règlement (gauche)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...dark);
  doc.text('RÈGLEMENT :', M, footerY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.text('Paiement par carte bancaire via Stripe', M, footerY + 14);
  doc.text('Paiement effectué à la commande', M, footerY + 19);

  // Termes (droite)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...dark);
  doc.text('TERMES & CONDITIONS', W / 2 + 10, footerY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...gray);
  const termes = [
    'En cas de retard de paiement, et conformément au code',
    'de commerce, une indemnité calculée à trois fois le taux',
    "d'intérêt légal ainsi qu'un frais de recouvrement de 40",
    'euros sont exigibles.',
    'Conditions générales de vente consultables sur le site :',
    'www.monbaril.fr'
  ];
  termes.forEach((line, i) => {
    doc.text(line, W / 2 + 10, footerY + 14 + (i * 4));
  });

  // ── Barre orange bas de page ──────────────────────────────────
  doc.setFillColor(...orange);
  doc.rect(0, 290, W, 7, 'F');

  const pdfBytes = doc.output('arraybuffer');
  return Buffer.from(pdfBytes);
}
