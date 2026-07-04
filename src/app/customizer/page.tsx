"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useEffect, useState } from "react";
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
import { useWebMCPTool } from "@/hooks/useWebMCPTool";

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

// Couleurs RAL disponibles
const RAL_COLORS = [
  { "code": "RAL 2004", "name": "Orange pur", "hex": "#F44611" },
  { "code": "RAL 7016", "name": "Gris anthracite", "hex": "#383E42" },
  { "code": "RAL 9010", "name": "Blanc pur", "hex": "#F6F6F6" },
  { "code": "RAL 6005", "name": "Vert mousse", "hex": "#084A27" },
  { "code": "RAL 5010", "name": "Bleu gentiane", "hex": "#0E518D" }
];

export default function CustomizerPage() {
  // Pour la démo, on utilise un produit fixe
  const slug = "baril-racing"; // Slug d'un produit existant
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [isSharing, setIsSharing] = useState(false);
  
  // États pour la personnalisation
  const [selectedColor, setSelectedColor] = useState(RAL_COLORS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useUser();

  // Fonction pour acheter maintenant (même logique que CheckoutButton)
  const handleCheckout = async () => {
    if (!product || isCheckingOut) return;

    // Vérifier si l'utilisateur est connecté
    if (!user) {
      toast.error("Vous devez être connecté pour passer commande");
      return;
    }

    setIsCheckingOut(true);

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
        setIsCheckingOut(false);
      }
    } catch (e) {
      console.error("❌ Erreur lors du paiement:", e);
      toast.error("Erreur lors du paiement : " + e);
      setIsCheckingOut(false);
    }
  };

  // Images du produit (pour l'instant une seule, mais on peut en ajouter plus)
  const productImages = product
    ? [product.image, product.image, product.image]
    : [];

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

  useEffect(() => {
    if (added) {
      toast.success("Ajouté au panier !");
      setAdded(false);
    }
  }, [added]);

  // ─────────────────────────────────────────────────────────────────────────
  // WebMCP tools
  // ─────────────────────────────────────────────────────────────────────────
  useWebMCPTool({
    name: "get_customizer_state",
    description:
      "Renvoie le produit personnalisable courant, la couleur RAL sélectionnée et la quantité.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    enabled: !!product,
    execute: () =>
      JSON.stringify({
        title: product?.title,
        price_eur: product ? product.price / 100 : null,
        selected_color: selectedColor,
        available_colors: RAL_COLORS,
        quantity,
      }),
  });

  useWebMCPTool<{ ral_code: string }>({
    name: "select_ral_color",
    description: `Sélectionne une couleur RAL pour le baril personnalisé. Codes disponibles : ${RAL_COLORS.map((c) => c.code).join(", ")}.`,
    inputSchema: {
      type: "object",
      properties: {
        ral_code: {
          type: "string",
          enum: RAL_COLORS.map((c) => c.code),
        },
      },
      required: ["ral_code"],
    },
    enabled: !!product,
    execute: ({ ral_code }) => {
      const color = RAL_COLORS.find((c) => c.code === ral_code);
      if (!color) return `Couleur RAL "${ral_code}" indisponible.`;
      setSelectedColor(color);
      return `Couleur sélectionnée : ${color.name} (${color.code}).`;
    },
  });

  useWebMCPTool<{ quantity: number }>({
    name: "set_customizer_quantity",
    description: "Définit la quantité à acheter (entier >= 1).",
    inputSchema: {
      type: "object",
      properties: { quantity: { type: "integer", minimum: 1, maximum: 99 } },
      required: ["quantity"],
    },
    enabled: !!product,
    execute: ({ quantity: qty }) => {
      const n = Math.max(1, Math.min(99, Math.floor(qty)));
      setQuantity(n);
      return `Quantité définie sur ${n}.`;
    },
  });

  useWebMCPTool({
    name: "add_customized_to_cart",
    description:
      "Ajoute le baril personnalisé (couleur et quantité sélectionnées) au panier.",
    inputSchema: { type: "object", properties: {} },
    enabled: !!product,
    execute: () => {
      if (!product) return "Aucun produit à ajouter.";
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: `${product.title} — ${selectedColor.name}`,
          price: product.price / 100,
          image: product.image,
        });
      }
      setAdded(true);
      return `Ajouté ${quantity} × ${product.title} (${selectedColor.name}) au panier.`;
    },
  });

  useWebMCPTool({
    name: "buy_customized_now",
    description:
      "Lance le checkout Stripe pour le baril personnalisé courant et redirige vers le paiement.",
    inputSchema: { type: "object", properties: {} },
    enabled: !!product,
    execute: async () => {
      if (!product) return "Aucun produit à acheter.";
      if (!user) return "L'utilisateur doit être connecté pour payer.";
      await handleCheckout();
      return "Redirection vers la page de paiement Stripe.";
    },
  });

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image avec personnalisation */}
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm relative">
              {/* Mockup du baril avec couleur appliquée */}
              <Image
                src="/images/metal_barrel_mockup/barrel_base.png"
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-contain"
                style={{
                  filter: `hue-rotate(${getHueRotation(selectedColor.hex)}) saturate(${getSaturation(selectedColor.hex)}) brightness(${getBrightness(selectedColor.hex)})`,
                }}
              />
              
              {/* Couche de couleur avec mix-blend-mode */}
              <div 
                className="absolute inset-0 mix-blend-multiply"
                style={{ 
                  backgroundColor: selectedColor.hex,
                  opacity: 0.3
                }}
              />
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

            {/* Couleur - NOUVEAU */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Couleur
              </label>
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span className="font-medium">{selectedColor.name}</span>
                  <span className="text-sm text-gray-500">({selectedColor.code})</span>
                </div>
                <span className="text-gray-400">▼</span>
              </button>
              
              {/* Sélecteur de couleurs */}
              {showColorPicker && (
                <div className="border border-gray-200 rounded-lg p-4 bg-white anim-enter">
                  <div className="grid grid-cols-1 gap-2">
                    {RAL_COLORS.map((color) => (
                      <button
                        key={color.code}
                        onClick={() => {
                          setSelectedColor(color);
                          setShowColorPicker(false);
                        }}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedColor.code === color.code
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="text-left">
                            <div className="font-medium">{color.name}</div>
                            <div className="text-sm text-gray-500">{color.code}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
                disabled={isCheckingOut}
                className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-90 disabled:cursor-wait active:scale-[0.99] inline-flex items-center justify-center min-h-[56px]"
              >
                {isCheckingOut ? (
                  <svg className="animate-spin h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                  </svg>
                ) : (
                  "Acheter maintenant"
                )}
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

// Fonctions utilitaires pour la conversion de couleur
function getHueRotation(hexColor: string): number {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 0;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return hsl.h;
}

function getSaturation(hexColor: string): number {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 1;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return hsl.s;
}

function getBrightness(hexColor: string): number {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 1;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return hsl.l;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return { h: h * 360, s, l };
}