"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  description: string;
  is_featured?: boolean;
}

export default function BestsellersBis() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const { data: products, error } = await supabase
          .from('products')
          .select('id, title, slug, price, image, description, is_featured')
          .eq('is_active', true)
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Erreur lors du chargement des best-sellers:', error);
          return;
        }

        setBestsellers(products || []);
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
              <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4] animate-pulse" />
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
        <div className="flex items-end justify-between mb-10">
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
        </div>

        {/* Grille produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestsellers.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group relative bg-[#f5f0ea] rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Numéro */}
              <span className="absolute top-5 left-6 text-orange-500/40 text-2xl font-space-grotesk font-medium z-10">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Image */}
              <div className="flex-1 flex items-center justify-center px-8 pt-14 pb-4">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={400}
                  height={400}
                  className="object-contain w-full h-auto max-h-[280px] group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Nom + Prix */}
              <div className="flex items-center justify-between px-6 pb-5">
                <p className="text-base font-semibold text-gray-900 font-space-grotesk">
                  {product.title}
                </p>
                <span className="text-sm font-medium text-gray-900 bg-white px-4 py-1.5 rounded-full shadow-sm font-space-grotesk">
                  {Math.round(product.price / 100)} €
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
