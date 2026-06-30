"use client";

import { useCart } from "@/hooks/useCart";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CheckoutButton from "@/components/ui/CheckoutButton";
import { useWebMCPTool } from "@/hooks/useWebMCPTool";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, incrementQuantity, decrementQuantity } = useCart();
  const { user } = useUser();
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

  // ─────────────────────────────────────────────────────────────────────────
  // WebMCP tools — pour les agents IA
  // ─────────────────────────────────────────────────────────────────────────
  useWebMCPTool({
    name: "list_cart_items",
    description:
      "Liste tous les articles actuellement dans le panier avec leur identifiant, nom, prix unitaire, quantité et total. Renvoie aussi le total général.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () =>
      JSON.stringify({
        items: cart.map((it) => ({
          id: it.id,
          name: it.name,
          unit_price_eur: it.price,
          quantity: it.quantity,
          line_total_eur: it.price * it.quantity,
        })),
        total_eur: total,
        count: cart.length,
      }),
  });

  useWebMCPTool<{ item_id: string; quantity: number }>({
    name: "update_cart_item_quantity",
    description:
      "Met à jour la quantité d'un article du panier identifié par son id. La quantité doit être >= 1. Pour retirer un article, utiliser remove_cart_item.",
    inputSchema: {
      type: "object",
      properties: {
        item_id: { type: "string", description: "Identifiant de l'article" },
        quantity: { type: "integer", minimum: 1, maximum: 99 },
      },
      required: ["item_id", "quantity"],
    },
    execute: async ({ item_id, quantity }) => {
      const item = cart.find((it) => it.id === item_id);
      if (!item) return `Article "${item_id}" introuvable dans le panier.`;
      const target = Math.max(1, Math.min(99, Math.floor(quantity)));
      const delta = target - item.quantity;
      if (delta === 0) return `Quantité déjà à ${target}.`;
      if (delta > 0) {
        for (let i = 0; i < delta; i++) {
          await incrementQuantity(item_id);
        }
      } else {
        for (let i = 0; i < -delta; i++) {
          await decrementQuantity(item_id);
        }
      }
      return `Quantité de "${item.name}" mise à jour : ${target}.`;
    },
  });

  useWebMCPTool<{ item_id: string }>({
    name: "remove_cart_item",
    description: "Retire un article du panier identifié par son id.",
    inputSchema: {
      type: "object",
      properties: {
        item_id: { type: "string", description: "Identifiant de l'article" },
      },
      required: ["item_id"],
    },
    execute: async ({ item_id }) => {
      const item = cart.find((it) => it.id === item_id);
      if (!item) return `Article "${item_id}" introuvable dans le panier.`;
      await removeFromCart(item_id);
      return `"${item.name}" retiré du panier.`;
    },
  });

  useWebMCPTool({
    name: "clear_cart",
    description: "Vide complètement le panier.",
    inputSchema: { type: "object", properties: {} },
    execute: () => {
      clearCart();
      return "Panier vidé.";
    },
  });

  useWebMCPTool({
    name: "checkout",
    description:
      "Lance le checkout Stripe avec tous les articles du panier et redirige l'utilisateur vers la page de paiement.",
    inputSchema: { type: "object", properties: {} },
    execute: async () => {
      if (cart.length === 0) return "Le panier est vide, rien à payer.";
      if (!user) return "L'utilisateur doit être connecté pour payer.";
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: user.email,
            userId: user.id,
            items: cart.map((item) => ({
              name: item.name,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
            })),
          }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return "Redirection vers la page de paiement Stripe.";
        }
        return `Erreur Stripe : ${data.error || "URL manquante"}`;
      } catch (e) {
        return `Erreur lors du paiement : ${e instanceof Error ? e.message : String(e)}`;
      }
    },
  });

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
                    src={item.image}
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
              <CheckoutButton />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
