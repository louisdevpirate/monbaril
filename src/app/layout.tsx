// import "../styles/globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import { CurrentYear } from "@/components/shared/CurrentYear"


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
          <nav style={{ display: "flex", gap: "1rem" }}>
            <Link href="/">Accueil</Link>
            <Link href="/about">À propos</Link>
            <Link href="/products">Produits</Link>
            <Link href="/checkout">Commander</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>

        <main>{children}</main>

        <footer style={{ padding: "2rem", textAlign: "center", marginTop: "3rem", borderTop: "1px solid #ccc" }}>
        © <CurrentYear /> MonBaril.
        Tous droits réservés.
        </footer>
      </body>
    </html>
  );
}