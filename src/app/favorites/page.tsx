"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  description: string;
}

export default function FavoritesPage() {
  const { user } = useUser();
  const { favorites, loading } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, title, slug, price, image, description')
          .eq('is_active', true);

        if (error) {
          console.error('Erreur lors du chargement des produits:', error);
          return;
        }

        setProducts(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (!user) {
    return <p style={{ padding: "2rem" }}>Tu dois être connecté pour voir tes favoris.</p>;
  }

  if (loading || productsLoading) {
    return <p style={{ padding: "2rem" }}>Chargement de tes favoris...</p>;
  }

  const favoriteProducts = products.filter((product) =>
    favorites.some((fav) => fav.product_id === product.id)
  );

  return (
    <section className="pt-16 max-w-[95%] mx-auto px-6 lg:px-10">
      <h1 className="text-2xl font-bold mb-4">Mes favoris</h1>

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
                className="object-cover rounded-lg"
                style={{ borderRadius: "8px 8px 0 0" }}
              />
              <div style={{ padding: "1rem" }}>
                <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>{product.title}</h2>
                <p style={{ fontWeight: "bold", color: "#333" }}>{(product.price / 100).toFixed(2)} €</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
