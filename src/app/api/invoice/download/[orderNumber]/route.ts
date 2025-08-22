// src/app/api/invoice/download/[orderNumber]/route.ts
import { NextResponse } from "next/server";
import { generateInvoiceById } from "@/lib/pdf/generateInvoiceById";

export async function GET(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;
    
    if (!orderNumber) {
      return NextResponse.json(
        { error: "Numéro de commande requis" },
        { status: 400 }
      );
    }

    // Générer la facture PDF
    const buffer = await generateInvoiceById(orderNumber);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="facture-${orderNumber}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Erreur lors de la génération de la facture:", error);
    
    return NextResponse.json(
      { 
        error: "Erreur lors de la génération de la facture",
        message: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
} 