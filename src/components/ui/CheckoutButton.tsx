"use client";

import { useState } from "react";
import { useCartContext } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";

export default function CheckoutButton() {
  const { cart } = useCartContext();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({
          email: user?.email,
          userId: user?.id,
          items: cart.map((item) => ({
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur Stripe : " + (data.error || "URL manquante"));
        setIsLoading(false);
      }
    } catch (e) {
      alert("Erreur lors du paiement : " + e);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-90 disabled:cursor-wait inline-flex items-center justify-center min-w-[160px] transition-transform active:scale-[0.98]"
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
        </svg>
      ) : (
        "Payer maintenant"
      )}
    </button>
  );
}
