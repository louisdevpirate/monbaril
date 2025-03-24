"use client";

import { useParams } from "next/navigation";
import { products } from "@/lib/data/products";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";

export default function ProductPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0];
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.slug === slug);

  const { isFavorite, toggleFavorite } = useFavorites();

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

      <button
  onClick={() => toggleFavorite(product.slug)}
  style={{
    marginBottom: "1rem",
    padding: "0.5rem 1rem",
    background: "none",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  {isFavorite(product.slug) ? "❤️ Retirer des favoris" : "🤍 Ajouter aux favoris"}
</button>


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
