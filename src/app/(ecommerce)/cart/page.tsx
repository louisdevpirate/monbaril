"use client";

import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, incrementQuantity, decrementQuantity } = useCart();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const btnStyle = {
    padding: "0.25rem 0.75rem",
    border: "1px solid #ccc",
    backgroundColor: "#f7f7f7",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold" as const,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Votre panier</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={`/barils/${item.image}`}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <button onClick={() => decrementQuantity(item.id)} style={btnStyle}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => incrementQuantity(item.id)} style={btnStyle}>+</button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.price.toFixed(2)} € / unité
                    </p>
                  </div>
                </div>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => removeFromCart(item.id)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-right">
            <p className="text-xl font-bold">Total : {total.toFixed(2)} €</p>
            <div className="mt-4 flex gap-4 justify-end">
              <button
                className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
                onClick={clearCart}
              >
                Vider le panier
              </button>
              <button
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                onClick={() => {
                  clearCart();
                  toast.success("Commande confirmée !");
                  router.push("/success"); // ✅ redirection
                }}
              >
                Commander
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
