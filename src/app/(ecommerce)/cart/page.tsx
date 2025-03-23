"use client";

import { useCart } from "@/hooks/useCart";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.price.toFixed(2)} €
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
                onClick={() => alert("Paiement à venir…")}
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
