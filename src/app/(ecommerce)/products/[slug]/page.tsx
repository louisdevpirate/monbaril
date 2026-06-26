"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useEffect, useState, useRef, useCallback } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/lib/supabase/supabaseClient";
import { motion } from "framer-motion";
import { useCartContext } from "@/context/CartContext"; 
import { useUser } from "@/context/UserContext";
import {
  StarIcon,
  HeartIcon,
  ShareIcon,
} from "@/components/icons/icons";
import Footer from "@/components/sections/Footer";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  description: string;
  categoryid: string;
  categoryId: string;
}

interface ProductColor {
  id: string;
  name: string;
  hex_code: string;
  slug: string;
}

interface ProductTexture {
  id: string;
  name: string;
  slug: string;
}

interface ProductVariant {
  id: string;
  color_id: string;
  texture_id: string;
  image_url: string;
  is_default: boolean;
  product_colors: ProductColor;
  product_textures: ProductTexture;
}

export default function ProductPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0];
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [isSharing, setIsSharing] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useUser();

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedTexture, setSelectedTexture] = useState<string | null>(null);
  const [variantImage, setVariantImage] = useState<string | null>(null);

  // Loupe
  const [isZooming, setIsZooming] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const LENS_SIZE = 250;
  const ZOOM_LEVEL = 2.5;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = imageContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setContainerSize({ w: rect.width, h: rect.height });
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lensX = x - LENS_SIZE / 2;
    const lensY = y - LENS_SIZE / 2;
    const bgX = -(x * ZOOM_LEVEL - LENS_SIZE / 2);
    const bgY = -(y * ZOOM_LEVEL - LENS_SIZE / 2);
    setLensPos({ x: lensX, y: lensY });
    setBgPos({ x: bgX, y: bgY });
  }, []);

  // Fonction pour acheter maintenant (même logique que CheckoutButton)
  const handleCheckout = async () => {
    if (!product) return;
    
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      toast.error("Vous devez être connecté pour passer commande");
      return;
    }
    
    const checkoutData = {
      email: user?.email,
      userId: user?.id,
      items: [{
        id: product.id, // Ajouter l'ID du produit
        name: product.title,
        image: product.image,
        price: product.price / 100,
        quantity: quantity,
      }],
      total_price: (product.price / 100) * quantity, // Calculer le total
    };
    
    console.log("🛒 Données envoyées à Stripe:", checkoutData);
    console.log("👤 Utilisateur connecté:", user);
    
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify(checkoutData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Inclure les cookies de session
      });

      const data = await res.json();
      console.log("📥 Réponse de l'API Stripe:", data);
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Erreur Stripe : " + (data.error || "URL manquante"));
        console.error("❌ Erreur détaillée:", data);
      }
    } catch (e) {
      console.error("❌ Erreur lors du paiement:", e);
      toast.error("Erreur lors du paiement : " + e);
    }
  };

  const productImages = product
    ? [variantImage || product.image]
    : [];

  // Couleurs et textures uniques depuis les variantes
  const availableColors = variants.reduce<ProductColor[]>((acc, v) => {
    if (!acc.find(c => c.id === v.color_id)) acc.push(v.product_colors);
    return acc;
  }, []);

  const availableTextures = variants.reduce<ProductTexture[]>((acc, v) => {
    if (!acc.find(t => t.id === v.texture_id)) acc.push(v.product_textures);
    return acc;
  }, []);

  // Scroll vers le haut de la page quand le composant se monte
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Charger le produit depuis Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .eq("is_active", true)
          .single();

        if (error) {
          console.error("Erreur lors du chargement du produit:", error);
          toast.error("Erreur lors du chargement du produit");
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error("Erreur lors du chargement du produit:", error);
        toast.error("Erreur lors du chargement du produit");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Charger les produits similaires
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("categoryid", product.categoryid)
          .neq("id", product.id)
          .eq("is_active", true)
          .limit(4);

        if (error) {
          console.error(
            "Erreur lors du chargement des produits similaires:",
            error
          );
          return;
        }

        setRelatedProducts(data || []);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des produits similaires:",
          error
        );
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // Charger les variantes du produit
  useEffect(() => {
    const fetchVariants = async () => {
      if (!product) return;
      const { data } = await supabase
        .from('product_variants')
        .select('*, product_colors(*), product_textures(*)')
        .eq('product_id', product.id);

      if (data && data.length > 0) {
        setVariants(data);
        const defaultVariant = data.find(v => v.is_default) || data[0];
        setSelectedColor(defaultVariant.color_id);
        setSelectedTexture(defaultVariant.texture_id);
        setVariantImage(defaultVariant.image_url);

        // Précharger les images via le pipeline Next.js (compressées automatiquement)
        data.forEach(v => {
          const img = new window.Image();
          img.src = `/_next/image?url=${encodeURIComponent(v.image_url)}&w=1080&q=75`;
        });
      }
    };
    fetchVariants();
  }, [product]);

  // Mettre à jour l'image quand couleur ou texture change
  useEffect(() => {
    if (!selectedColor || !selectedTexture) return;
    const match = variants.find(v => v.color_id === selectedColor && v.texture_id === selectedTexture);
    if (match) setVariantImage(match.image_url);
  }, [selectedColor, selectedTexture, variants]);

  useEffect(() => {
    if (added) {
      toast.success("Ajouté au panier !");
      setAdded(false);
    }
  }, [added]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Produit introuvable
          </h1>
          <p className="text-gray-600 mb-6">
            Ce produit n'existe pas ou n'est plus disponible.
          </p>
          <Link
            href="/categories"
            className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Voir nos produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                >
                  Catégories
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">{product.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-95/100 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              ref={imageContainerRef}
              className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm cursor-crosshair"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={productImages[selectedImage]}
                alt={product.title}
                width={1080}
                height={1080}
                quality={75}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover"
              />
              {isZooming && (
                <div
                  className="absolute pointer-events-none rounded-full border-2 border-white shadow-xl overflow-hidden"
                  style={{
                    width: LENS_SIZE,
                    height: LENS_SIZE,
                    left: lensPos.x,
                    top: lensPos.y,
                    backgroundImage: `url(${productImages[selectedImage]})`,
                    backgroundSize: `${containerSize.w * ZOOM_LEVEL}px ${containerSize.h * ZOOM_LEVEL}px`,
                    backgroundPosition: `${bgPos.x}px ${bgPos.y}px`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-orange-500"
                      : "border-gray-200"
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

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-500">5K+ Vendu</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  4.9 (225 avis)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                {(product.price / 100).toFixed(2)} €
              </span>
            </div>

            {/* Sélecteur couleurs */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Couleur — <span className="text-orange-500">{availableColors.find(c => c.id === selectedColor)?.name}</span>
                </label>
                <div className="flex space-x-3">
                  {availableColors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      title={color.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColor === color.id ? 'border-orange-500 scale-110' : 'border-gray-300'}`}
                      style={{ backgroundColor: color.hex_code }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sélecteur textures */}
            {availableTextures.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Texture — <span className="text-orange-500">{availableTextures.find(t => t.id === selectedTexture)?.name}</span>
                </label>
                <div className="flex space-x-2">
                  {availableTextures.map(texture => (
                    <button
                      key={texture.id}
                      onClick={() => setSelectedTexture(texture.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        selectedTexture === texture.id
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {texture.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Quantité
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (!product) return;
                  
                  for (let i = 0; i < quantity; i++) {
                    addToCart({
                      id: product.id,
                      name: product.title,
                      price: product.price / 100,
                      image: product.image,
                    });
                  }
                  setAdded(true);
                }}
                className="w-full bg-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                + Ajouter au panier
              </button>

              <button
                onClick={handleCheckout}
                className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Acheter maintenant
              </button>
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center space-x-4 pt-4 border-t">
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isFavorite(product.id)
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <HeartIcon className="w-5 h-5" />
                <span>Favoris</span>
              </button>

              <button
                onClick={async () => {
                  if (isSharing) return; // Éviter les clics multiples
                  
                  setIsSharing(true);
                  
                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: product.title,
                        text: product.description,
                        url: window.location.href,
                      });
                    } else {
                      await navigator.clipboard.writeText(window.location.href);
                      toast.success("Lien copié dans le presse-papiers !");
                    }
                  } catch (error) {
                    // Ne pas traiter l'annulation du partage comme une erreur
                    if (error instanceof Error && error.name === 'AbortError') {
                      // L'utilisateur a annulé le partage, c'est normal
                      return;
                    }
                    
                    console.error("Erreur lors du partage:", error);
                    // Fallback vers la copie dans le presse-papiers
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      toast.success("Lien copié dans le presse-papiers !");
                    } catch (clipboardError) {
                      toast.error("Impossible de partager ou copier le lien");
                    }
                  } finally {
                    setIsSharing(false);
                  }
                }}
                disabled={isSharing}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isSharing 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ShareIcon className="w-5 h-5" />
                <span>{isSharing ? "Partage..." : "Partager"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: "details", label: "Détails" },
                { id: "reviews", label: "Avis" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === "details" && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">
                  Description du produit
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>

                <h3 className="text-lg font-semibold mb-4 mt-8">
                  Caractéristiques
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Matériau de haute qualité</li>
                  <li>Design unique et moderne</li>
                  <li>Facile à entretenir</li>
                  <li>Garantie de satisfaction</li>
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold">4.9</div>
                  <div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">Basé sur 225 avis</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <p className="font-medium">Jean Dupont</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      Excellent produit ! La qualité est au rendez-vous et le
                      design est vraiment unique. Je recommande vivement.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <p className="font-medium">Marie Martin</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      Très satisfaite de mon achat. Le produit correspond
                      parfaitement à la description et la livraison a été
                      rapide.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Produits similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
