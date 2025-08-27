"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import FavoriteButton from "@/components/ui/FavoriteButton";

interface ProductProps {
  title: string;
  price: number;
  slug: string;
  image: string;
}

export default function ProductCard({ title, price, slug, image }: ProductProps) {
  const { addToCart } = useCart();

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
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
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

      <FavoriteButton productId={slug} size="medium" variant="default" />

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
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "black";
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "black";
        }}
      >
        Afficher le produit
      </Link>

      <button
        onClick={() =>
          addToCart({
            id: slug,
            name: title,
            price: price,
            image: image.replace("/barils/", ""),
          })
        }
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "0.75rem",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#333";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "black";
        }}
      >
        Ajouter au panier
      </button>
    </div>
  );
}
