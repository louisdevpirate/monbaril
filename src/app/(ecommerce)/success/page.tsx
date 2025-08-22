"use client";

import { useEffect, useState } from "react";
import { useCartContext } from "@/context/CartContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const { cart, clearCart } = useCartContext();
  const [cartCleared, setCartCleared] = useState(false);
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

  useEffect(() => {
    if (!cartCleared && cart.length > 0) {
      clearCart();
      setCartCleared(true);
      console.log("✅ Panier vidé après commande.");
    }
  }, [cart, clearCart, cartCleared]);

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
          href="/products"
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