"use client";

import { useParams } from "next/navigation";
import { products } from "@/lib/data/products";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0];
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.slug === slug);

  useEffect(() => {
    if (added) {
      toast.success("Ajouté au panier !");
      setAdded(false);
    }
  }, [added]);

  if (!product) return <p>Produit introuvable</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{product.title}</h1>

      <Image
        src={product.image}
        alt={product.title}
        width={600}
        height={600}
        style={{ objectFit: "cover", margin: "2rem 0" }}
      />

      <p style={{ marginBottom: "1rem" }}>{product.description}</p>
      <p style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
        {product.price} €
      </p>

      <button
        onClick={() => {
          addToCart({
            id: product.slug,
            name: product.title,
            price: product.price,
            image: product.image.replace("/barils/", ""),
          });
          setAdded(true);
        }}
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "0.75rem 1.5rem",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "1.5rem",
          fontWeight: "bold",
        }}
      >
        Ajouter au panier
      </button>
    </div>
  );
}
