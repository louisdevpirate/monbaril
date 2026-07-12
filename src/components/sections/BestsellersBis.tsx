"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import Reveal from "@/components/ui/Reveal";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  description: string;
  categoryid?: string;
  categoryTitle?: string;
  is_featured?: boolean;
}

export default function BestsellersBis() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useUser();

  const handleFav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    // addToCart gère l'auth et affiche sa propre erreur si non connecté ;
    // on n'annonce le succès que s'il a réellement ajouté l'article
    const ok = await addToCart({
      id: product.id,
      name: product.title,
      price: product.price / 100,
      image: product.image,
    });
    if (ok) toast.success("Ajouté au panier !");
  };

  const handleBuyNow = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Vous devez être connecté pour passer commande");
      return;
    }
    if (buyingId) return;
    setBuyingId(product.id);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: user.email,
          userId: user.id,
          items: [
            {
              id: product.id,
              name: product.title,
              image: product.image,
              price: product.price / 100,
              quantity: 1,
            },
          ],
          total_price: product.price / 100,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Erreur Stripe : " + (data.error || "URL manquante"));
        setBuyingId(null);
      }
    } catch {
      toast.error("Erreur lors du paiement");
      setBuyingId(null);
    }
  };

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const [{ data: products, error }, { data: categories }] = await Promise.all([
          supabase
            .from('products')
            .select('id, title, slug, price, image, description, categoryid, is_featured')
            .eq('is_active', true)
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(3),
          supabase.from('categories').select('id, title'),
        ]);

        if (error) {
          console.error('Erreur lors du chargement des best-sellers:', error);
          return;
        }

        const categoryMap = new Map((categories || []).map((c) => [c.id, c.title]));
        const enriched = (products || []).map((p) => ({
          ...p,
          categoryTitle: categoryMap.get(p.categoryid) ?? 'Collection MonBaril',
        }));

        setBestsellers(enriched);
      } catch (error) {
        console.error('Erreur lors du chargement des best-sellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white py-20">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4] anim-shimmer" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (bestsellers.length === 0) return null;

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        {/* Header */}
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.9]">
            Nos
            <br />
            best-sellers
          </h2>

          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-orange-500 text-sm">★</span>
              ))}
            </div>
            <span className="text-sm text-orange-500 font-space-grotesk tracking-wide">
              4.9 — 500+ avis
            </span>
          </div>
        </Reveal>

        {/* Grille produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestsellers.map((product, index) => (
            <Reveal key={product.id} delay={index * 80} className="flex">
            <Link
              href={`/products/${product.slug}`}
              className="group relative bg-[#f5f0ea] rounded-2xl overflow-hidden flex w-full aspect-[3/4]"
            >
              {/* Image plein cadre */}
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-md"
              />

              {/* Voile au survol : lisibilité du texte orange sur l'image floutée */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Bouton Like — toujours visible, en haut à droite */}
              <button
                onClick={(e) => handleFav(e, product.id)}
                aria-label={isFavorite(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all hover:scale-110 hover:bg-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={isFavorite(product.id) ? "#f97316" : "none"}
                  stroke={isFavorite(product.id) ? "#f97316" : "#6b7280"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>

              {/* Numéro */}
              <span className="absolute top-5 left-6 text-orange-500/60 text-2xl font-space-grotesk font-medium z-20">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Prix */}
              <span className="absolute bottom-5 right-5 z-20 text-sm font-medium text-gray-900 bg-white px-4 py-1.5 rounded-full shadow-sm font-space-grotesk">
                {Math.round(product.price / 100)} €
              </span>

              {/* Nom + collection + actions, révélés au survol */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                <h3 className="font-bebas-neue uppercase text-orange-500 text-4xl lg:text-5xl leading-none tracking-wide">
                  {product.title}
                </h3>
                <p className="mt-2 text-white/85 text-xs font-space-grotesk uppercase tracking-[0.2em]">
                  {product.categoryTitle}
                </p>
                <div className="mt-6 flex flex-col gap-2.5 w-full max-w-[220px]">
                  <button
                    onClick={(e) => handleBuyNow(e, product)}
                    disabled={buyingId === product.id}
                    className="w-full py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium font-space-grotesk transition-colors disabled:opacity-60"
                  >
                    {buyingId === product.id ? "Redirection…" : "Acheter maintenant"}
                  </button>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full py-2.5 rounded-full bg-white/95 hover:bg-white text-gray-900 text-sm font-medium font-space-grotesk transition-colors"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
