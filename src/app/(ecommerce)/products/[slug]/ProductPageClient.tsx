"use client";

import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useEffect, useState, useRef, useCallback } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/lib/supabase/supabaseClient";
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
import AnimatedPrice from "@/components/ui/AnimatedPrice";
import Reveal from "@/components/ui/Reveal";

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

export default function ProductPageClient({
  initialProduct,
}: {
  initialProduct: Product;
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [product] = useState<Product>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSharing, setIsSharing] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

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

  const productImages = [variantImage || product.image];

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

  // Charger les produits similaires
  useEffect(() => {
    const fetchRelatedProducts = async () => {
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

        if (data && data.length > 0) {
          setRelatedProducts(data);
          return;
        }

        // Fallback : pas de produit dans la même catégorie,
        // on affiche d'autres produits actifs pour ne pas laisser la section vide.
        const { data: fallback } = await supabase
          .from("products")
          .select("*")
          .neq("id", product.id)
          .eq("is_active", true)
          .limit(4);

        setRelatedProducts(fallback || []);
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
          img.src = v.image_url;
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

  // ─────────────────────────────────────────────────────────────────────────
  // WebMCP tools — laissent les agents IA (Gemini in Chrome, etc.) naviguer
  // et acheter sans passer par le rendu visuel de la page.
  // ─────────────────────────────────────────────────────────────────────────
  const colorSlugs = availableColors.map((c) => c.slug);
  const textureSlugs = availableTextures.map((t) => t.slug);

  useWebMCPTool({
    name: "get_product_info",
    description:
      "Renvoie les informations du produit actuellement affiché : titre, description, prix en euros, couleurs et textures disponibles, sélection courante et quantité.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () => {
      const currentColor = availableColors.find((c) => c.id === selectedColor);
      const currentTexture = availableTextures.find(
        (t) => t.id === selectedTexture
      );
      return JSON.stringify({
        title: product.title,
        slug: product.slug,
        description: product.description,
        price_eur: product.price / 100,
        available_colors: availableColors.map((c) => ({
          slug: c.slug,
          name: c.name,
          hex: c.hex_code,
        })),
        available_textures: availableTextures.map((t) => ({
          slug: t.slug,
          name: t.name,
        })),
        selected_color: currentColor?.slug ?? null,
        selected_texture: currentTexture?.slug ?? null,
        quantity,
      });
    },
  });

  useWebMCPTool<{ color_slug: string }>({
    name: "select_color",
    description:
      "Sélectionne la couleur du baril par son slug (ex: forest, noir, beige, chocolat).",
    inputSchema: {
      type: "object",
      properties: {
        color_slug: {
          type: "string",
          enum: colorSlugs,
          description: "Slug de la couleur à sélectionner",
        },
      },
      required: ["color_slug"],
    },
    enabled: availableColors.length > 0,
    execute: ({ color_slug }) => {
      const color = availableColors.find((c) => c.slug === color_slug);
      if (!color) return `Couleur "${color_slug}" indisponible.`;
      setSelectedColor(color.id);
      return `Couleur sélectionnée : ${color.name}.`;
    },
  });

  useWebMCPTool<{ texture_slug: string }>({
    name: "select_texture",
    description:
      "Sélectionne la texture du baril par son slug (ex: mat, brillant, grainy).",
    inputSchema: {
      type: "object",
      properties: {
        texture_slug: {
          type: "string",
          enum: textureSlugs,
          description: "Slug de la texture à sélectionner",
        },
      },
      required: ["texture_slug"],
    },
    enabled: availableTextures.length > 0,
    execute: ({ texture_slug }) => {
      const texture = availableTextures.find((t) => t.slug === texture_slug);
      if (!texture) return `Texture "${texture_slug}" indisponible.`;
      setSelectedTexture(texture.id);
      return `Texture sélectionnée : ${texture.name}.`;
    },
  });

  useWebMCPTool<{ quantity: number }>({
    name: "set_quantity",
    description: "Définit la quantité à acheter (entier supérieur ou égal à 1).",
    inputSchema: {
      type: "object",
      properties: {
        quantity: { type: "integer", minimum: 1, maximum: 99 },
      },
      required: ["quantity"],
    },
    execute: ({ quantity: qty }) => {
      const n = Math.max(1, Math.min(99, Math.floor(qty)));
      setQuantity(n);
      return `Quantité définie sur ${n}.`;
    },
  });

  useWebMCPTool({
    name: "add_to_cart",
    description:
      "Ajoute le produit avec la couleur, la texture et la quantité actuellement sélectionnées au panier.",
    inputSchema: { type: "object", properties: {} },
    execute: () => {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.title,
          price: product.price / 100,
          image: product.image,
        });
      }
      setAdded(true);
      return `Ajouté ${quantity} × ${product.title} au panier.`;
    },
  });

  useWebMCPTool({
    name: "buy_now",
    description:
      "Lance le checkout Stripe pour le produit courant avec la quantité actuelle. Redirige l'utilisateur vers la page de paiement.",
    inputSchema: { type: "object", properties: {} },
    execute: async () => {
      if (!user) return "L'utilisateur doit être connecté pour payer.";
      await handleCheckout();
      return "Redirection vers la page de paiement Stripe.";
    },
  });

  const reviewBreakdown = [
    { stars: 5, count: 184 },
    { stars: 4, count: 26 },
    { stars: 3, count: 10 },
    { stars: 2, count: 3 },
    { stars: 1, count: 2 },
  ];
  const totalReviews = reviewBreakdown.reduce((s, r) => s + r.count, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-10 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm font-space-grotesk">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Catégories
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li className="text-gray-900 font-medium">{product.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-10 py-10 anim-enter">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              ref={imageContainerRef}
              className="relative aspect-square bg-[#f5f0ea] rounded-2xl overflow-hidden cursor-crosshair"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                key={productImages[selectedImage]}
                src={productImages[selectedImage]}
                alt={product.title}
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 720px"
                className="object-cover anim-swap"
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
            <div className="flex space-x-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-[#f5f0ea] ${
                    selectedImage === index
                      ? "border-orange-500"
                      : "border-transparent"
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
              <h1 className="text-4xl md:text-5xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.95]">
                {product.title}
              </h1>
              <p className="mt-3 text-gray-500 text-base leading-relaxed font-space-grotesk max-w-md">
                {product.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 font-space-grotesk">
              <span className="text-sm text-gray-400">Fabriqué en France</span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-orange-500 text-sm">★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">4.9 (225 avis)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <AnimatedPrice
                value={(product.price / 100) * quantity}
                className="text-3xl font-bold text-gray-900 font-bebas-neue tracking-wide"
              />
              {quantity > 1 && (
                <span className="text-sm text-gray-400 font-space-grotesk">
                  {(product.price / 100).toFixed(2).replace(".", ",")} € / unité
                </span>
              )}
            </div>

            {/* Sélecteur couleurs */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 font-space-grotesk">
                  Couleur — <span className="text-orange-500">{availableColors.find(c => c.id === selectedColor)?.name}</span>
                </label>
                <div className="flex gap-3">
                  {availableColors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      title={color.name}
                      className={`w-10 h-10 rounded-lg border-2 hover:-translate-y-0.5 ${
                        selectedColor === color.id
                          ? 'border-orange-500 ring-2 ring-orange-500/25 ring-offset-2'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hex_code }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sélecteur textures */}
            {availableTextures.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 font-space-grotesk">
                  Texture — <span className="text-orange-500">{availableTextures.find(t => t.id === selectedTexture)?.name}</span>
                </label>
                <div className="flex gap-2">
                  {availableTextures.map(texture => (
                    <button
                      key={texture.id}
                      onClick={() => setSelectedTexture(texture.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all font-space-grotesk ${
                        selectedTexture === texture.id
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
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
              <label className="block text-sm font-medium text-gray-700 font-space-grotesk">
                Quantité
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium font-space-grotesk">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  if (justAdded) return;
                  for (let i = 0; i < quantity; i++) {
                    addToCart({
                      id: product.id,
                      name: product.title,
                      price: product.price / 100,
                      image: product.image,
                    });
                  }
                  setAdded(true);
                  setJustAdded(true);
                  setTimeout(() => setJustAdded(false), 1400);
                }}
                className={`w-full py-4 px-6 rounded-xl font-semibold font-space-grotesk text-white ${
                  justAdded
                    ? 'bg-gray-900 anim-confirm'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {justAdded ? '✓ Ajouté au panier' : '+ Ajouter au panier'}
              </button>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full border-2 border-gray-200 text-gray-900 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-90 disabled:cursor-wait active:scale-[0.99] inline-flex items-center justify-center min-h-[56px] font-space-grotesk"
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
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 font-space-grotesk">
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                  isFavorite(product.id)
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <HeartIcon className="w-4 h-4" />
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                  isSharing
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ShareIcon className="w-4 h-4" />
                <span>{isSharing ? "Partage..." : "Partager"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Détails du produit */}
        <Reveal className="mt-16 max-w-none font-space-grotesk">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Description du produit
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <h3 className="text-lg font-semibold mb-4 mt-8 text-gray-900">
            Caractéristiques
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Fût métallique 200&nbsp;L d&apos;origine industrielle, décapé et traité antirouille</li>
            <li>Thermolaquage&nbsp;: peinture poudre électrostatique cuite au four — finition mat, brillant ou grainy</li>
            <li>Pièce unique&nbsp;: aucun baril ne ressemble exactement à un autre</li>
            <li>Fabriqué à la commande dans notre atelier en France</li>
          </ul>
        </Reveal>

        {/* Avis clients */}
        <Reveal className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 mb-8">
            Avis clients
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 font-space-grotesk">
            {/* Liste des avis */}
            <div className="space-y-6">
              {[
                { name: "Jean Dupont", initial: "J", text: "Excellent produit ! La qualité est au rendez-vous et le design est vraiment unique. Je recommande vivement." },
                { name: "Marie Martin", initial: "M", text: "Très satisfaite de mon achat. Le produit correspond parfaitement à la description et la livraison a été rapide." },
              ].map((review) => (
                <div key={review.name} className="border border-gray-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-bold">{review.initial}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-orange-500 text-xs">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>

            {/* Répartition des notes */}
            <div className="bg-[#f5f0ea] rounded-2xl p-6 h-fit">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-orange-500 text-lg">★</span>
                  ))}
                </div>
                <span className="text-2xl font-bold text-gray-900 font-bebas-neue tracking-wide">4.9</span>
              </div>
              <div className="space-y-2">
                {reviewBreakdown.map((row) => (
                  <div key={row.stars} className="flex items-center gap-3 text-xs">
                    <span className="w-3 text-gray-500">{row.stars}</span>
                    <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${(row.count / totalReviews) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-gray-400">{row.count}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-400">Basé sur {totalReviews} avis</p>
            </div>
          </div>
        </Reveal>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 mb-8">
                Produits similaires
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, i) => (
                <Reveal key={relatedProduct.id} delay={i * 80}>
                  <ProductCard product={relatedProduct} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
