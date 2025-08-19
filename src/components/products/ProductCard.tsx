"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";

interface ProductProps {
  title: string;
  price: number;
  slug: string;
  image: string;
}

export function ProductCard({ title, price, slug, image }: ProductProps) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        width: "300px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{ position: "relative", height: "200px", marginBottom: "1rem" }}
      >
        <Image src={image} alt={title} layout="fill" objectFit="cover" />
      </div>

      <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{title}</h2>
      <p style={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
        {price} €
      </p>

      <button
        onClick={(e) => {
          e.preventDefault(); // ← évite le redirect via <Link>
          toggleFavorite(slug);
        }}
        style={{
          marginTop: "0.5rem",
          padding: "0.25rem 0.75rem",
          fontSize: "0.9rem",
          background: "none",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {isFavorite(slug) ? "❤️ Favori" : "🤍 Ajouter"}
      </button>

      <Link
        href={`/products/${slug}`}
        style={{
          textAlign: "center",
          padding: "0.5rem",
          border: "1px solid black",
          borderRadius: "6px",
          marginBottom: "0.5rem",
          fontWeight: "bold",
          textDecoration: "none",
          color: "black",
        }}
      >
        Afficher le produit
      </Link>

      <button
        onClick={() =>
          addToCart({
            id: slug,
            name: title,
            price,
            image: image.replace("/barils/", ""),
          })
        }
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "0.5rem",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Ajouter au panier
      </button>
    </div>
  );
}
