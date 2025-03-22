import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link href="/">Accueil</Link>
        <Link href="/about">À propos</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/contact">Contact</Link>
    </nav>
  );
}
