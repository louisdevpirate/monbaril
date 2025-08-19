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

      <div>
        <Link href="/products">Retour à la boutique</Link>
        <button onClick={() => alert("Fonction de téléchargement à venir")}>
          Télécharger la facture
        </button>
      </div>
    </div>
  );
}