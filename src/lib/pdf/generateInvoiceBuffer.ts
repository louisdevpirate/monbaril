// ✅ generateInvoiceBuffer.ts - Version jsPDF
import jsPDF from "jspdf";
import { OrderItem } from "@/types/supabase";

interface InvoiceInput {
  order_number: string;
  email: string;
  created_at: string;
  total_price: number;
  items: OrderItem[];
}

export async function generateInvoiceBuffer(invoice: InvoiceInput): Promise<Buffer> {
  const doc = new jsPDF();

  // Titre
  doc.setFontSize(20);
  doc.text("Facture", 105, 20, { align: "center" });

  // Informations de commande
  doc.setFontSize(12);
  doc.text(`Commande : ${invoice.order_number}`, 20, 40);
  doc.text(`Email client : ${invoice.email}`, 20, 50);
  doc.text(`Date : ${new Date(invoice.created_at).toLocaleDateString("fr-FR")}`, 20, 60);

  // Détail de la commande
  doc.text("Détail de la commande :", 20, 80);
  
  let yPosition = 90;
  invoice.items.forEach((item) => {
    doc.text(`- ${item.product_name} x${item.quantity} - ${item.price.toFixed(2)} €`, 20, yPosition);
    yPosition += 10;
  });

  // Total
  doc.setFontSize(14);
  doc.text(`Total : ${invoice.total_price.toFixed(2)} €`, 150, yPosition + 10, { align: "right" });

  // Retourner le PDF comme Buffer
  const pdfBytes = doc.output('arraybuffer');
  return Buffer.from(pdfBytes);
}