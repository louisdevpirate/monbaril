// src/app/api/invoice/real-test/route.ts
import { NextResponse } from "next/server";
import { generateInvoiceById } from "@/lib/pdf/generateInvoiceById";

export async function GET() {
  try {
    // Simuler une vraie commande avec tes vrais produits
    const mockOrderId = "CMD-REAL-001";
    
    // Créer une commande de test dans Supabase (si elle n'existe pas)
    // Pour l'instant, on va utiliser la fonction existante avec des données réalistes
    
    // Test avec une commande qui ressemble à tes vraies données
    const buffer = await generateInvoiceById(mockOrderId);
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="facture-${mockOrderId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération de la facture:", error);
    
    // Si la commande n'existe pas, on peut créer une facture de test
    // ou retourner une erreur plus informative
    return NextResponse.json(
      { 
        error: "Commande non trouvée", 
        message: "Cette route nécessite une vraie commande dans Supabase" 
      },
      { status: 404 }
    );
  }
} 