"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useStock } from "@/hooks/useStock";
import { toast } from "sonner";
import {
  AnalyticsItem,
  trackAddToCart,
  trackRemoveFromCart,
} from "@/lib/analytics/gtag";

type CartItem = {
  /** Clé de ligne : produit seul, ou produit + configuration (baril monochrome). */
  id: string;
  /** Produit en base, pour le stock et la commande. Défaut : `id`. */
  productId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  /** Configuration choisie, affichée au panier (ex. « RAL 3020 · Brillant »). */
  options?: string;
};

/** Deux configurations d'un même baril sont deux lignes, un seul produit stock. */
const stockIdOf = (item: Pick<CartItem, "id" | "productId">) =>
  item.productId ?? item.id;

/**
 * Ligne de panier → item GA4. On rapporte le produit en base (`productId`), pas
 * la clé de ligne composite : sans ça, chaque coloris deviendrait un produit
 * distinct dans les rapports. La configuration part dans `item_variant`.
 */
const toAnalyticsItem = (
  item: Pick<CartItem, "id" | "productId" | "name" | "price" | "options">,
  quantity: number
): AnalyticsItem => ({
  item_id: stockIdOf(item),
  item_name: item.name,
  price: item.price,
  quantity,
  ...(item.options ? { item_variant: item.options } : {}),
});

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => Promise<boolean>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  incrementQuantity: (id: string) => Promise<boolean>;
  decrementQuantity: (id: string) => Promise<boolean>;
  loading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { reserveStock, releaseStock, loading: stockLoading } = useStock();

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (item: Omit<CartItem, "quantity"> & { quantity?: number }): Promise<boolean> => {
    try {
      const quantityToAdd = item.quantity || 1;

      // Vérifier et réserver le stock
      const stockReserved = await reserveStock(stockIdOf(item), quantityToAdd);
      if (!stockReserved) {
        return false; // Le stock n'a pas pu être réservé
      }

      // Ajouter au panier local
      setCart((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantityToAdd } : i
          );
        } else {
          return [...prev, { ...item, quantity: quantityToAdd }];
        }
      });

      trackAddToCart(toAnalyticsItem(item, quantityToAdd));

      toast.success("Produit ajouté au panier");
      return true;
    } catch (error) {
      console.error("❌ Erreur ajout au panier:", error);
      toast.error("❌ Erreur lors de l'ajout au panier");
      return false;
    }
  };

  const removeFromCart = async (id: string): Promise<void> => {
    try {
      const item = cart.find((i) => i.id === id);
      if (item) {
        // Libérer le stock réservé
        await releaseStock(stockIdOf(item), item.quantity);
      }

      setCart((prev) => prev.filter((item) => item.id !== id));
      if (item) trackRemoveFromCart(toAnalyticsItem(item, item.quantity));
      toast.success("Produit retiré du panier");
    } catch (error) {
      console.error("❌ Erreur retrait du panier:", error);
      toast.error("❌ Erreur lors du retrait du panier");
    }
  };

  const clearCart = async (): Promise<void> => {
    try {
      // Libérer tous les stocks réservés
      for (const item of cart) {
        await releaseStock(stockIdOf(item), item.quantity);
      }

      setCart([]);
      toast.success("Panier vidé");
    } catch (error) {
      console.error("❌ Erreur vidage panier:", error);
      toast.error("❌ Erreur lors du vidage du panier");
    }
  };

  const incrementQuantity = async (id: string): Promise<boolean> => {
    try {
      const item = cart.find((i) => i.id === id);
      if (!item) return false;

      // Vérifier et réserver le stock supplémentaire
      const stockReserved = await reserveStock(stockIdOf(item), 1);
      if (!stockReserved) {
        return false;
      }

      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );

      trackAddToCart(toAnalyticsItem(item, 1));
      return true;
    } catch (error) {
      console.error("❌ Erreur incrémentation quantité:", error);
      return false;
    }
  };

  const decrementQuantity = async (id: string): Promise<boolean> => {
    try {
      const item = cart.find((i) => i.id === id);
      if (!item || item.quantity <= 1) return false;

      // Libérer le stock réservé
      await releaseStock(stockIdOf(item), 1);

      setCart((prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0)
      );

      trackRemoveFromCart(toAnalyticsItem(item, 1));
      return true;
    } catch (error) {
      console.error("❌ Erreur décrémentation quantité:", error);
      return false;
    }
  };
  
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        incrementQuantity,
        decrementQuantity,
        loading: stockLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
