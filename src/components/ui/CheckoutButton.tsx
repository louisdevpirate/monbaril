"use client";

import { useRouter } from "next/navigation";
import { useCartContext } from "@/context/CartContext";

export default function CheckoutButton() {
  const router = useRouter();
  const { cart } = useCartContext();

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({
          items: cart.map((item) => ({
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur Stripe : " + (data.error || "URL manquante"));
      }
    } catch (e) {
      alert("Erreur lors du paiement : " + e);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
    >
      Payer maintenant
    </button>
  );
}
