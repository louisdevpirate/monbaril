"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDownIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon } from "@/components/icons/icons";
import ProductCard from "@/components/products/ProductCard";
import { ProductsGridSkeleton } from "@/components/ui/Skeleton";
import Footer from "@/components/sections/Footer";
import { supabase } from "@/lib/supabase/supabaseClient";
import { toast } from "sonner";
import { useWebMCPTool } from "@/hooks/useWebMCPTool";

// Interface pour les produits
interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  categoryid: string;
  categoryId: string;
  description: string;
}

const categories = ["Tous", "Racing", "Vintage", "Custom", "Limited Edition"];
const colors = ["Tous", "Bleu", "Rouge", "Noir", "Or", "Gris", "Blanc"];
const sortOptions = [
  { value: "popularity", label: "Popularité" },
  { value: "price-low", label: "Prix croissant" },
  { value: "price-high", label: "Prix décroissant" },
  { value: "newest", label: "Plus récents" },
  { value: "rating", label: "Mieux notés" }
];

// Interface pour les catégories
interface Category {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("");
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedColor, setSelectedColor] = useState("Tous");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // Initialiser le slug
  useEffect(() => {
    params.then(({ slug }) => setSlug(slug));
  }, [params]);

  // Charger la catégorie et les produits
  useEffect(() => {
    if (!slug) return;

    const fetchCategoryAndProducts = async () => {
      try {
        setIsLoading(true);

  // Récupérer la catégorie
        const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
          .select('id, title, slug, description, image')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

        if (categoryError || !categoryData) {
          console.error('Erreur lors du chargement de la catégorie:', categoryError);
          return;
  }

        setCategory(categoryData);

  // Récupérer les produits de cette catégorie
        const { data: productsData, error: productsError } = await supabase
    .from('products')
          .select('id, title, slug, price, image, categoryid, description')
          .eq('categoryid', categoryData.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (productsError) {
    console.error('Erreur lors du chargement des produits:', productsError);
          toast.error('Erreur lors du chargement des produits');
          return;
        }

        // Ajouter categoryId pour compatibilité
        const productsWithCategoryId = (productsData || []).map(product => ({
          ...product,
          categoryId: product.categoryid
        }));

        setProducts(productsWithCategoryId);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  // Filtrage des produits
  const filteredProducts = products.filter(product => {
    const priceMatch = (product.price / 100) >= priceRange[0] && (product.price / 100) <= priceRange[1];
    return priceMatch;
  });

  // Tri des produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return 0; // Déjà trié par created_at dans la requête
      case "rating":
        return 0; // Pas de tri par note pour l'instant
      default:
        return 0; // Pas de tri par popularité pour l'instant
    }
  });


  // ─────────────────────────────────────────────────────────────────────────
  // WebMCP tools
  // ─────────────────────────────────────────────────────────────────────────
  useWebMCPTool({
    name: "get_collection_info",
    description:
      "Renvoie les informations de la collection actuellement affichée (titre, description) et la liste de ses produits.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    enabled: !!category,
    execute: () =>
      JSON.stringify({
        title: category?.title,
        description: category?.description,
        products: sortedProducts.map((p) => ({
          title: p.title,
          slug: p.slug,
          url: `/products/${p.slug}`,
          price_eur: p.price / 100,
        })),
      }),
  });

  useWebMCPTool<{ sort: string }>({
    name: "sort_collection_products",
    description: `Trie les produits de cette collection. Valeurs possibles : ${sortOptions.map((o) => o.value).join(", ")}.`,
    inputSchema: {
      type: "object",
      properties: {
        sort: { type: "string", enum: sortOptions.map((o) => o.value) },
      },
      required: ["sort"],
    },
    enabled: !!category,
    execute: ({ sort }) => {
      const opt = sortOptions.find((o) => o.value === sort);
      if (!opt) return `Tri "${sort}" invalide.`;
      setSortBy(sort);
      return `Produits triés par "${opt.label}".`;
    },
  });

  if (!category) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Hero Section avec image d'en-tête */}
      <section className="relative pt-32 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Image d'en-tête */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative h-96 mb-12 rounded-3xl overflow-hidden"
          >
            <Image
              src={category.image || "/images/products/japan.png"}
              alt={category.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <motion.h1 
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  className="text-5xl md:text-6xl font-bold mb-6 font-bebas-neue tracking-tight"
                >
                  {category.title}
                </motion.h1>
                <motion.p 
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                  className="text-xl max-w-2xl mx-auto font-space-grotesk"
                >
                  {category.description}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-2 gap-8 mb-16"
          >
            {[
              { label: "Produits", value: `${products.length}+` },
              { label: "Collections", value: "1" },
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

      {/* Products Grid */}
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
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "grid grid-cols-1"
              }`}
            >
              {viewMode === "grid" ? (
                /* Layout uniforme - toutes les cartes de même taille */
                sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.45 + index * 0.05, ease: "easeOut" }}
                    className="w-full"
                  >
            <ProductCard
                      product={product}
                    />
                  </motion.div>
                ))
              ) : (
                /* Mode liste - tous les produits en colonne */
                sortedProducts.map((product, index) => (
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
          {sortedProducts.length === 0 && !isLoading && (
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
              <a
                href="/contact"
                className="bg-white text-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Nous contacter
              </a>
              <a
                href="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-orange-500 transition-colors"
              >
                En savoir plus
              </a>
            </div>
          </motion.div>
      </div>
      </section>
      <Footer />
    </div>
  );
}
