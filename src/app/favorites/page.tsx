"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { products } from "@/lib/data/products";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import Image from "next/image";

export default function FavoritesPage() {
  const { user } = useUser();
  const { favorites, loading } = useFavorites();

  if (!user) {
    return <p style={{ padding: "2rem" }}>Tu dois être connecté pour voir tes favoris.</p>;
  }

  if (loading) {
    return <p style={{ padding: "2rem" }}>Chargement de tes favoris...</p>;
  }

  const favoriteProducts = products.filter((product) =>
    favorites.some((fav) => fav.product_id === product.slug)
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Mes favoris</h1>

      {favoriteProducts.length === 0 ? (
        <p>Tu n’as encore rien ajouté en favori 🤍</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          {favoriteProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              style={{
                display: "block",
                border: "1px solid #ddd",
                borderRadius: "8px",
                width: "250px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Image
                src={product.image}
                alt={product.title}
                width={250}
                height={250}
                style={{ objectFit: "cover", borderRadius: "8px 8px 0 0" }}
              />
              <div style={{ padding: "1rem" }}>
                <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>{product.title}</h2>
                <p style={{ fontWeight: "bold", color: "#333" }}>{product.price} €</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
