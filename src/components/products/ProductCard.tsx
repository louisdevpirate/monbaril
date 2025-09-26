"use client";

import Link from "next/link";
import Image from "next/image";

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
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/collections/${product.slug}`}>
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
            <span className="text-xl font-bold text-gray-900">{product.price}€</span>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
              Voir
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}