"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDownIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon } from "@/components/icons/icons";
import ProductCard from "@/components/products/ProductCard";
import { ProductsGridSkeleton } from "@/components/ui/Skeleton";
import Footer from "@/components/sections/Footer";

// Mock data pour les produits
const mockProducts = [
  {
    id: "1",
    title: "Baril Racing Gulf",
    slug: "baril-racing-gulf",
    price: 89,
    image: "/barils/baril1.png",
    categoryId: "racing",
    description: "Un baril au look inspiré des légendes de la course auto."
  },
  {
    id: "2",
    title: "Baril Vintage Rouge",
    slug: "baril-vintage-rouge",
    price: 75,
    image: "/barils/baril2.png",
    categoryId: "vintage",
    description: "Style vintage avec une touche rouge distinctive."
  },
  {
    id: "3",
    title: "Baril Minimaliste Noir",
    slug: "baril-minimaliste-noir",
    price: 95,
    image: "/barils/baril3.png",
    categoryId: "minimaliste",
    description: "Design épuré et moderne en noir profond."
  },
  {
    id: "4",
    title: "Baril Art Déco",
    slug: "baril-art-deco",
    price: 110,
    image: "/barils/baril1.png",
    categoryId: "art-deco",
    description: "Élégance Art Déco avec finitions dorées."
  },
  {
    id: "5",
    title: "Baril Industriel",
    slug: "baril-industriel",
    price: 65,
    image: "/barils/baril2.png",
    categoryId: "industriel",
    description: "Esthétique industrielle brute et authentique."
  },
  {
    id: "6",
    title: "Baril Luxe Blanc",
    slug: "baril-luxe-blanc",
    price: 125,
    image: "/barils/baril3.png",
    categoryId: "luxe",
    description: "Édition luxe avec finitions blanches élégantes."
  }
];

const categories = ["Tous", "Racing", "Vintage", "Minimaliste", "Art Déco", "Industriel", "Luxe"];
const colors = ["Tous", "Bleu", "Rouge", "Noir", "Or", "Gris", "Blanc"];
const sortOptions = [
  { value: "popularity", label: "Popularité" },
  { value: "price-low", label: "Prix croissant" },
  { value: "price-high", label: "Prix décroissant" },
  { value: "newest", label: "Plus récents" },
  { value: "rating", label: "Mieux notés" }
];

export default function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedColor, setSelectedColor] = useState("Tous");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [isLoading, setIsLoading] = useState(true);

  // Simuler un chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filtrage des produits
  const filteredProducts = mockProducts.filter(product => {
    const categoryMatch = selectedCategory === "Tous" || product.categoryId === selectedCategory.toLowerCase();
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  // Tri des produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return 0; // Pas de tri par nouveauté pour l'instant
      case "rating":
        return 0; // Pas de tri par note pour l'instant
      default:
        return 0; // Pas de tri par popularité pour l'instant
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.h1 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-6xl font-bold text-black mb-6 font-bebas-neue tracking-tight"
            >
              Nos <span className="text-orange-500">Collections</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="text-xl text-gray-600 max-w-2xl mx-auto font-space-grotesk"
            >
              Découvrez notre sélection exclusive de barils transformés en objets d'art
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {[
              { label: "Produits", value: "24+" },
              { label: "Collections", value: "6" },
              { label: "Clients", value: "500+" },
              { label: "Note", value: "4.8★" }
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.25 + index * 0.05, ease: "easeOut" }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-orange-500 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-space-grotesk">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filters & Controls */}
      <section className="px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm p-6"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <FunnelIcon className="w-4 h-4" />
                Filtres
              </button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-6">
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Color Filter */}
                <div className="relative">
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Price Range */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">Prix:</span>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-24"
                  />
                  <span className="text-gray-600 text-sm">{priceRange[1]}€</span>
                </div>
              </div>

              {/* Sort & View */}
              <div className="flex items-center gap-4">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <Squares2X2Icon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <ListBulletIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-700"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-700"
                    >
                      {colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Products Grid - Bento Design */}
      <section className="px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <ProductsGridSkeleton />
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className={`max-w-7xl mx-auto ${
                viewMode === "grid" 
                  ? "grid grid-cols-4 gap-4" 
                  : "grid grid-cols-1"
              }`}
            >
              {viewMode === "grid" ? (
                /* Layout Bento alterné avec 6 produits */
                sortedProducts.slice(0, 6).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.45 + index * 0.05, ease: "easeOut" }}
                    className={`${
                      index === 0 ? "col-span-2" : // Row 1: 2x1 (produit 1)
                      index === 1 ? "col-span-1" : // Row 1: 1x1 (produit 2)
                      index === 2 ? "col-span-1" : // Row 1: 1x1 (produit 3)
                      index === 3 ? "col-span-1" : // Row 2: 1x1 (produit 4)
                      index === 4 ? "col-span-1" : // Row 2: 1x1 (produit 5)
                      "col-span-2" // Row 2: 2x1 (produit 6)
                    }`}
                  >
                    <ProductCard
                      product={product}
                    />
                  </motion.div>
                ))
              ) : (
                /* Mode liste - tous les produits en colonne */
                sortedProducts.slice(0, 6).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.45 + index * 0.05, ease: "easeOut" }}
                  >
                    <ProductCard
                      product={product}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* No Results */}
          {sortedProducts.length === 0 && (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center py-16"
            >
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500 mb-6">Essayez de modifier vos filtres</p>
              <button
                onClick={() => {
                  setSelectedCategory("Tous");
                  setSelectedColor("Tous");
                  setPriceRange([0, 200]);
                }}
                className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Pagination */}
      <section className="px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm p-2">
              <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">
                Précédent
              </button>
              {[1, 2, 3, 4, 5].map(page => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    page === 1 
                      ? "bg-orange-500 text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">
                Suivant
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Besoin d'aide pour choisir ?</h2>
            <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
              Notre équipe d'experts est là pour vous accompagner dans votre choix
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Nous contacter
              </Link>
              <Link
                href="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-orange-500 transition-colors"
              >
                En savoir plus
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
