"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useStock } from "@/hooks/useStock";
import { useState, useEffect } from "react";

interface ProductProps {
  title: string;
  price: number;
  slug: string;
  image: string;
}

export default function ProductCard({ title, price, slug, image }: ProductProps) {
  const { addToCart, loading: cartLoading } = useCart();
  const { checkAvailability, loading: stockLoading } = useStock();
  const [stockInfo, setStockInfo] = useState<{
    available: number;
    lowStock: boolean;
  } | null>(null);

  // Vérifier le stock au chargement
  useEffect(() => {
    const checkStock = async () => {
      const info = await checkAvailability(slug, 1);
      if (info) {
        setStockInfo({
          available: info.available,
          lowStock: info.lowStock
        });
      }
    };
    checkStock();
  }, [slug, checkAvailability]);

  const handleAddToCart = async () => {
    const success = await addToCart({
      id: slug,
      name: title,
      price: price,
      image: image.replace("/barils/", ""),
    });

    if (success) {
      // Mettre à jour les infos de stock
      const newStockInfo = await checkAvailability(slug, 1);
      if (newStockInfo) {
        setStockInfo({
          available: newStockInfo.available,
          lowStock: newStockInfo.lowStock
        });
      }
    }
  };

  const isLoading = cartLoading || stockLoading;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        width: "300px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{ position: "relative", height: "200px", marginBottom: "1rem" }}
      >
        <Image src={image} alt={title} layout="fill" objectFit="cover" />
        
        {/* Indicateur de stock */}
        {stockInfo && (
          <div style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            padding: "0.25rem 0.5rem",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            color: "white",
            background: stockInfo.lowStock 
              ? stockInfo.available === 0 ? "#ef4444" : "#f59e0b"
              : "#10b981"
          }}>
            {stockInfo.available === 0 ? "Rupture" : 
             stockInfo.lowStock ? `${stockInfo.available} restant(s)` : 
             "En stock"}
          </div>
        )}
      </div>

      <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{title}</h2>
      <p style={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
        {price} €
      </p>

      <FavoriteButton productId={slug} size="medium" variant="default" />

      <Link
        href={`/products/${slug}`}
        style={{
          textAlign: "center",
          padding: "0.5rem",
          border: "1px solid black",
          borderRadius: "6px",
          marginBottom: "0.5rem",
          fontWeight: "bold",
          textDecoration: "none",
          color: "black",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "black";
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "black";
        }}
      >
        Afficher le produit
      </Link>

      <button
        onClick={handleAddToCart}
        disabled={isLoading || (stockInfo?.available === 0)}
        style={{
          backgroundColor: stockInfo?.available === 0 ? "#9ca3af" : "black",
          color: "white",
          padding: "0.75rem",
          border: "none",
          borderRadius: "6px",
          cursor: stockInfo?.available === 0 ? "not-allowed" : "pointer",
          fontWeight: "bold",
          transition: "background-color 0.2s",
          opacity: isLoading ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (stockInfo?.available !== 0) {
            e.currentTarget.style.backgroundColor = "#333";
          }
        }}
        onMouseLeave={(e) => {
          if (stockInfo?.available !== 0) {
            e.currentTarget.style.backgroundColor = "black";
          }
        }}
      >
        {isLoading ? "⏳..." : 
         stockInfo?.available === 0 ? "Rupture de stock" : 
         "Ajouter au panier"}
      </button>
    </div>
  );
}
