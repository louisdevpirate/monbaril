"use client";

import { useEffect, useState } from "react";
import { useCartContext } from "@/context/CartContext";
import { supabase } from "@/lib/supabase/supabaseClient";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function SuccessPage() {
  const { cart, clearCart } = useCartContext();
  const [cartCleared, setCartCleared] = useState(false);
  const [stockDeducted, setStockDeducted] = useState(false);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (sessionId) {
      fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.order_number) {
            setOrderId(data.order_number);
          }
        });
    }
  }, [sessionId]);

  // Déduire le stock réel après confirmation de commande
  useEffect(() => {
    if (!stockDeducted && cart.length > 0 && orderId) {
      const deductStock = async () => {
        try {
          console.log("🔄 Déduction du stock pour la commande:", orderId);
          console.log("📦 Produits dans le panier:", cart.length);
          console.log("📋 Détail du panier:", cart);
          
          let successCount = 0;
          let errorCount = 0;
          
          // Déduire le stock pour chaque produit de la commande
          for (const item of cart) {
            console.log(`\n📦 Traitement de ${item.name} (${item.quantity} unités) - ID: ${item.id}`);
            
            try {
              // 1. Récupérer le stock actuel
              const { data: productData, error: fetchError } = await supabase
                .from('products')
                .select('stock_quantity, stock_reserved')
                .eq('slug', item.id)
                .single();
              
              if (fetchError) {
                console.error(`❌ Erreur récupération stock pour ${item.name}:`, fetchError);
                errorCount++;
                continue;
              }
              
              const currentStock = productData.stock_quantity || 0;
              const currentReserved = productData.stock_reserved || 0;
              const newStock = Math.max(0, currentStock - item.quantity);
              const newReserved = Math.max(0, currentReserved - item.quantity);
              
              console.log(`📊 Stock ${item.name}: ${currentStock} → ${newStock} (réservé: ${currentReserved} → ${newReserved})`);
              
              // 2. Mettre à jour le stock
              const { error: updateError } = await supabase
                .from('products')
                .update({
                  stock_quantity: newStock,
                  stock_reserved: newReserved,
                  stock_updated_at: new Date().toISOString()
                })
                .eq('slug', item.id);
              
              if (updateError) {
                console.error(`❌ Erreur mise à jour stock pour ${item.name}:`, updateError);
                errorCount++;
              } else {
                console.log(`✅ Stock mis à jour pour ${item.name}`);
                successCount++;
              }
              
              // 3. Supprimer les réservations de type 'cart' pour ce produit
              const { error: deleteError } = await supabase
                .from('stock_reservations')
                .delete()
                .eq('product_id', item.id)
                .eq('reservation_type', 'cart');
              
              if (deleteError) {
                console.error(`❌ Erreur suppression réservations pour ${item.name}:`, deleteError);
              } else {
                console.log(`✅ Réservations supprimées pour ${item.name}`);
              }
              
            } catch (itemError) {
              console.error(`❌ Erreur inattendue pour ${item.name}:`, itemError);
              errorCount++;
            }
          }
          
          console.log(`\n📊 RÉSUMÉ: ${successCount} succès, ${errorCount} erreurs sur ${cart.length} produits`);
          
          setStockDeducted(true);
          
          if (successCount > 0) {
            toast.success(`✅ Stock mis à jour pour ${successCount} produit(s)`);
          }
          if (errorCount > 0) {
            toast.error(`❌ Erreurs sur ${errorCount} produit(s)`);
          }
          
          console.log("✅ Déduction du stock terminée");
        } catch (error) {
          console.error("❌ Erreur lors de la déduction du stock:", error);
          toast.error("❌ Erreur lors de la mise à jour du stock");
        }
      };

      deductStock();
    }
  }, [cart, orderId, stockDeducted]);

  // Vider le panier APRÈS avoir déduit le stock
  useEffect(() => {
    if (stockDeducted && !cartCleared && cart.length > 0) {
      clearCart();
      setCartCleared(true);
      console.log("✅ Panier vidé après déduction du stock.");
    }
  }, [stockDeducted, cart, clearCart, cartCleared]);

  return (
    <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        🎉 Merci pour votre commande !
      </h1>
      <p style={{ color: "#555", maxWidth: "600px", margin: "0 auto" }}>
        Votre baril personnalisable est en route vers votre espace.
      </p>
      <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
        Numéro de commande : <span style={{ color: "#000" }}>{orderId}</span>
      </p>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Link 
          href="/categories"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#f3f4f6",
            color: "#374151",
            textDecoration: "none",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db"
          }}
        >
          Retour à la boutique
        </Link>
        
        {orderId && (
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = `/api/invoice/download/${orderId}`;
              link.download = `facture-${orderId}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            📄 Télécharger la facture
          </button>
        )}
      </div>
    </div>
  );
}