"use client";

import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/hooks/useFavorites";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  categoryId: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(product.id);

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Bouton favori */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(product.id);
        }}
        aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={liked ? "#f97316" : "none"}
          stroke={liked ? "#f97316" : "#6b7280"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            width={300}
            height={300}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">{(product.price / 100).toFixed(2)}€</span>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
              Voir
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
