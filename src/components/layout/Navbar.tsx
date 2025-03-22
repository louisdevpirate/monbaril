import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <Link href="/">Accueil</Link>
      <Link href="/categories">Catégories</Link>
      <Link href="/(pages)/about">À propos</Link>
      <Link href="/(pages)/faq">FAQ</Link>
      <Link href="/(pages)/contact">Contact</Link>
    </nav>
  );
}
