"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";

interface ProductProps {
  title: string;
  price: number;
  slug: string;
  image: string;
}

export function ProductCard({ title, price, slug, image }: ProductProps) {
  const { addToCart } = useCart();

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        width: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <Link
        href={`/products/${slug}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div style={{ width: "100%", height: "200px", position: "relative" }}>
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div style={{ padding: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{title}</h2>
          <p style={{ fontWeight: "bold", color: "#333" }}>{price} €</p>
        </div>
      </Link>

      <button
        onClick={() =>
          addToCart({
            id: slug,
            name: title,
            price,
            image: image.replace("/barils/", ""), // ajustement si besoin
          })
        }
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "0.75rem",
          border: "none",
          cursor: "pointer",
          width: "100%",
          fontWeight: "bold",
        }}
      >
        Ajouter au panier
      </button>
    </div>
  );
}
