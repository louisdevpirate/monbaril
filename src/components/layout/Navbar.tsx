"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase/supabaseClient";

export default function Navbar() {
  const { cart } = useCart();
  const { user, loading } = useUser();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <Link href="/">Accueil</Link>
      <Link href="/categories">Catégories</Link>
      <Link href="/about">À propos</Link>
      <Link href="/faq">FAQ</Link>
      <Link href="/contact">Contact</Link>

      <Link href="/favorites">Favoris</Link>
      <Link href="/cart" style={{ fontWeight: "bold" }}>
        Panier{totalItems > 0 && ` (${totalItems})`}
      </Link>

      {!loading && (
        user ? (
          <>
                             <span style={{ fontStyle: "italic", color: "#333" }}>Hello {user.email} 👋</span>
                 <Link href="/admin/profiles" style={{ color: "purple", textDecoration: "underline" }}>
                   Admin
                 </Link>
                 <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Se déconnecter
            </button>
          </>
        ) : (
          <>
            <Link href="/signup">S'inscrire</Link>
            <Link href="/login">Se connecter</Link>
          </>
        )
      )}
    </nav>
  );
}
