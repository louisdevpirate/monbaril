"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import FavoriteButton from "@/components/ui/FavoriteButton";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { supabase } from "@/lib/supabase/supabaseClient";
import { StarIcon, HeartIcon, ShareIcon, ChatIcon } from "@/components/icons";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  original_price?: number;
  image: string;
  description: string;
  categoryid: string;
  is_featured?: boolean;
  is_on_sale?: boolean;
}

export default function ProductPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0];
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, title, slug, price, original_price, image, description, categoryid, is_featured, is_on_sale')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (error) {
          console.error('Erreur lors du chargement du produit:', error);
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (added) {
      toast.success("Ajouté au panier !");
      setAdded(false);
    }
  }, [added]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            </div>
            {/* Content skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
              <div className="h-12 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-12 bg-gray-200 animate-pulse rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Produit introuvable</h1>
          <p className="text-gray-600 mb-8">Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
          <a href="/collections" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
            Voir nos collections
          </a>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: product.title }
  ];

  // Simuler des images supplémentaires pour la galerie
  const productImages = [
    product.image,
    product.image, // En réalité, vous pourriez avoir plusieurs images
    product.image,
    product.image
  ];

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galerie d'images */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <Image
                src={productImages[selectedImage]}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Miniatures */}
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-orange-500 ring-2 ring-orange-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            {/* Titre et badges */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                {product.is_featured && (
                  <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">
                    Best-seller
                  </span>
                )}
                {product.is_on_sale && (
                  <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
              
              {/* Avis et ventes */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">4.9</span>
                  <span>(225 avis)</span>
                </div>
                <span>•</span>
                <span>5K+ vendus</span>
              </div>
            </div>

            {/* Prix */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  {(product.price / 100).toFixed(2)}€
                </span>
                {product.original_price && (
                  <span className="text-xl text-gray-500 line-through">
                    {(product.original_price / 100).toFixed(2)}€
                  </span>
                )}
              </div>
              {product.is_on_sale && (
                <p className="text-sm text-green-600 font-medium">
                  Économisez {((product.original_price! - product.price) / 100).toFixed(2)}€
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
              <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                Lire la suite
              </button>
            </div>

            {/* Sélecteur de quantité */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Quantité
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    addToCart({
                      id: product.slug,
                      name: product.title,
                      price: product.price / 100,
                      image: product.image,
                    });
                    setAdded(true);
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <span>Ajouter au panier</span>
                </button>
                
                <button className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-4 px-6 rounded-lg transition-colors">
                  Acheter maintenant
                </button>
              </div>

              {/* Actions secondaires */}
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <button className="flex items-center space-x-2 hover:text-gray-900 transition-colors">
                  <ChatIcon className="w-4 h-4" />
                  <span>Chat</span>
                </button>
                <div className="flex items-center space-x-2">
                  <FavoriteButton productId={product.id} size="small" variant="minimal" />
                  <span>Favoris</span>
                </div>
                <button className="flex items-center space-x-2 hover:text-gray-900 transition-colors">
                  <ShareIcon className="w-4 h-4" />
                  <span>Partager</span>
                </button>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="border-t pt-6 space-y-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Livraison gratuite dès 50€</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Retour gratuit sous 30 jours</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Garantie 2 ans</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
