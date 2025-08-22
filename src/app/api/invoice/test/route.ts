// src/app/api/invoice/test/route.ts
import { NextResponse } from "next/server";
import { generateInvoiceBuffer } from "@/lib/pdf/generateInvoiceBuffer";

export async function GET() {
  const buffer = await generateInvoiceBuffer({
    order_number: "CMD-99999",
    email: "client@test.com",
    created_at: new Date().toISOString(),
    total_price: 199.99,
    items: [
      {
        id: 123,
        product_name: "Baril Racing Gulf",
        price: 149,
        quantity: 1,
        image: "baril1.jpg",
        order_id: "fake",
        created_at: new Date().toISOString(),
        user_id: "test-user",
      },
      {
        id: 456,
        product_name: "Baril Military",
        price: 50.99,
        quantity: 1,
        image: "baril2.jpg",
        order_id: "fake",
        created_at: new Date().toISOString(),
        user_id: "test-user",
      },
    ],
  });

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="facture.pdf"',
    },
  });
}