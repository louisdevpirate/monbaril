"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import Reveal from "@/components/ui/Reveal";

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
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Numéro */}
              <span className="absolute top-5 left-6 text-orange-500/60 text-2xl font-space-grotesk font-medium z-20">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Prix */}
              <span className="absolute bottom-5 right-5 z-20 text-sm font-medium text-gray-900 bg-white px-4 py-1.5 rounded-full shadow-sm font-space-grotesk">
                {Math.round(product.price / 100)} €
              </span>

              {/* Nom + collection, révélés au survol */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-bebas-neue uppercase text-orange-500 text-4xl lg:text-5xl leading-none tracking-wide">
                  {product.title}
                </h3>
                <p className="mt-2 text-white/85 text-xs font-space-grotesk uppercase tracking-[0.2em]">
                  {product.categoryTitle}
                </p>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
