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
        // Utilisation du client Supabase importé
        
        // Récupérer les produits marqués comme featured ou les 3 premiers produits actifs
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
          <div className="text-center mb-12">
            <h2 className="mt-2 text-2xl md:text-3xl lg:text-6xl font-semibold text-gray-900">
              Nos best-sellers !
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-full aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="mt-4 h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                <div className="mt-2 h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (bestsellers.length === 0) {
    return (
      <section className="w-full bg-white py-20">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <div className="text-center">
            <h2 className="mt-2 text-2xl md:text-3xl lg:text-6xl font-semibold text-gray-900">
              Nos best-sellers !
            </h2>
            <p className="mt-4 text-gray-500">Aucun produit disponible pour le moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        {/* Titre */}
        <div className="text-center mb-12">
          <h2 className="mt-2 text-2xl md:text-3xl lg:text-6xl font-semibold text-gray-900">
            Nos best-sellers !
          </h2>
          <Image
            src="/images/price.png"
            alt="Best-sellers"
            width={20}
            height={20}
            className="w-auto h-auto object-cover mx-auto"
          />
        </div>

        {/* Grille produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestsellers.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={`${product.title} - ${product.description}`}
                  width={1000}
                  height={200}
                  className="object-contain rounded-lg"
                />
              </div>
              <p className="mt-4 text-base font-medium text-gray-900">
                {product.title}
              </p>
              <p className="text-sm text-gray-500">{(product.price / 100).toFixed(2)}€</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
