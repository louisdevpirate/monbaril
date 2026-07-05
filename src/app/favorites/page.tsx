"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { toast } from "sonner";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/ui/Reveal";
import { useWebMCPTool } from "@/hooks/useWebMCPTool";

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
  const { favorites, loading, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
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

  const favoriteProducts = products.filter((product) =>
    favorites.some((fav) => fav.product_id === product.id)
  );

  useWebMCPTool({
    name: "list_favorites",
    description:
      "Liste les produits que l'utilisateur connecté a mis en favoris, avec slug, titre et prix.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    enabled: !!user && !loading && !productsLoading,
    execute: () =>
      JSON.stringify(
        favoriteProducts.map((p) => ({
          title: p.title,
          slug: p.slug,
          url: `/products/${p.slug}`,
          price_eur: p.price / 100,
        }))
      ),
  });

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price / 100,
      image: product.image,
    });
    toast.success("Ajouté au panier !");
  };

  // ── Non connecté ──────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
          <Image src="/images/star-orange.svg" alt="" width={40} height={40} className="mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900">
            Vos favoris vous attendent
          </h1>
          <p className="mt-4 text-gray-500 font-space-grotesk max-w-sm">
            Connectez-vous pour retrouver les barils que vous avez mis de côté.
          </p>
          <Link
            href="/login?redirect=%2Ffavorites"
            className="mt-8 bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-sm font-space-grotesk hover:bg-orange-600 transition-colors"
          >
            Se connecter
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Chargement ────────────────────────────────────────────────────────
  if (loading || productsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10 py-16">
          <div className="h-12 w-64 bg-gray-100 rounded anim-shimmer mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4] anim-shimmer" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 max-w-[95%] w-full mx-auto px-6 lg:px-10 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.9]">
              Mes favoris
            </h1>
            <p className="mt-3 text-gray-500 font-space-grotesk">
              {favoriteProducts.length === 0
                ? "Rien de mis de côté pour l'instant."
                : `${favoriteProducts.length} baril${favoriteProducts.length > 1 ? "s" : ""} mis de côté.`}
            </p>
          </div>
          <Link
            href="/categories"
            className="text-sm text-orange-500 font-space-grotesk hover:underline shrink-0"
          >
            Explorer les collections →
          </Link>
        </div>

        {/* Empty state */}
        {favoriteProducts.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-2xl py-24 flex flex-col items-center text-center px-6">
            <span className="text-5xl mb-4">🤍</span>
            <p className="text-gray-900 font-semibold font-space-grotesk">
              Aucun favori pour le moment
            </p>
            <p className="mt-2 text-gray-500 text-sm font-space-grotesk max-w-xs">
              Cliquez sur le cœur d&apos;un produit pour le retrouver ici.
            </p>
            <Link
              href="/categories"
              className="mt-8 bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-sm font-space-grotesk hover:bg-orange-600 transition-colors"
            >
              Découvrir les barils
            </Link>
          </div>
        ) : (
          /* Grille */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteProducts.map((product, i) => (
              <Reveal key={product.id} delay={i * 60}>
                <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                  {/* Retirer des favoris */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    aria-label="Retirer des favoris"
                    title="Retirer des favoris"
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#f97316" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>

                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="aspect-square bg-[#f5f0ea] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold text-gray-900 font-space-grotesk hover:text-orange-500 transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      <span className="font-bold text-gray-900 font-bebas-neue text-lg tracking-wide shrink-0">
                        {(product.price / 100).toFixed(2)} €
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="mt-auto w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold text-sm font-space-grotesk hover:bg-orange-600 transition-colors"
                    >
                      + Ajouter au panier
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
