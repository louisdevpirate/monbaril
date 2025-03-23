"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <Link href="/">Accueil</Link>
      <Link href="/categories">Catégories</Link>
      <Link href="/about">À propos</Link>
      <Link href="/faq">FAQ</Link>
      <Link href="/contact">Contact</Link>

      <Link href="/cart" style={{ fontWeight: "bold" }}>
        Panier{totalItems > 0 && ` (${totalItems})`}
      </Link>
    </nav>
  );
}
