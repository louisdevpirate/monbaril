"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HeartIcon, StarIcon } from "@/components/icons/icons";
import SmartImage from "@/components/ui/SmartImage";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  category: string;
  color: string;
  rating: number;
  reviews: number;
  isNew: boolean;
  isBestSeller: boolean;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
  isLarge?: boolean;
}

export default function ProductCard({ product, viewMode, isLarge = false }: ProductCardProps) {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        <div className="flex">
          <div className="w-40 h-40 relative">
            <SmartImage
              src={product.image}
              alt={product.name}
              width={300}
              height={240}
              className="w-full h-full object-cover"
              priority={false}
              quality={85}
            />
            {product.isNew && (
              <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                Nouveau
              </div>
            )}
            {!product.isNew && product.isBestSeller && (
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                Best-seller
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.category} • {product.color}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews} avis)
                  </span>
                </div>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                <HeartIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">{product.price}€</span>
              </div>
              
              <Link
                href={`/products/${product.id}`}
                className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                Voir le produit
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Section Image - Hauteur flexible */}
      <div className="relative h-48 flex-shrink-0 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badges - Un seul badge par produit */}
        <div className="absolute top-3 left-3">
          {product.isNew && (
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Nouveau
            </div>
          )}
          {!product.isNew && product.isBestSeller && (
            <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Best-seller
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex gap-3">
            <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors cursor-pointer">
              <HeartIcon className="w-5 h-5 text-gray-700" />
            </button>
            <Link
              href={`/products/${product.id}`}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              Voir
            </Link>
          </div>
        </div>
      </div>
      
      {/* Section Contenu - Flex-grow pour prendre l'espace restant */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className={`font-semibold text-gray-900 mb-2 ${isLarge ? "text-xl" : "text-lg"}`}>
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3">{product.category} • {product.color}</p>
          </div>
          
          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-2 cursor-pointer">
            <HeartIcon className="w-5 h-5" />
      </button>
    </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`font-bold text-gray-900 ${isLarge ? "text-2xl" : "text-xl"}`}>
              {product.price}€
            </span>
          </div>
          
          {/* Stock Indicator */}
          <div className="text-xs text-gray-500">
            {product.stock > 10 ? (
              <span className="text-green-600">En stock</span>
            ) : product.stock > 0 ? (
              <span className="text-orange-600">Plus que {product.stock}</span>
            ) : (
              <span className="text-red-600">Rupture</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}