"use client";

import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  productId: string;
  size?: "small" | "medium" | "large";
  variant?: "default" | "minimal";
}

export default function FavoriteButton({ 
  productId, 
  size = "medium", 
  variant = "default" 
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(productId);

  const sizeStyles = {
    small: { padding: "0.25rem 0.5rem", fontSize: "0.8rem" },
    medium: { padding: "0.5rem 1rem", fontSize: "0.9rem" },
    large: { padding: "0.75rem 1.5rem", fontSize: "1rem" }
  };

  const baseStyles = {
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold" as const,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    ...sizeStyles[size]
  };

  const variantStyles = {
    default: {
      background: isFav ? "#ff6b6b" : "#f8f9fa",
      color: isFav ? "white" : "#333",
      border: isFav ? "none" : "1px solid #ccc",
      "&:hover": {
        background: isFav ? "#ff5252" : "#e9ecef",
        transform: "scale(1.05)"
      }
    },
    minimal: {
      background: "transparent",
      color: isFav ? "#ff6b6b" : "#666",
      border: "none",
      "&:hover": {
        color: isFav ? "#ff5252" : "#333",
        transform: "scale(1.1)"
      }
    }
  };

  const currentVariant = variantStyles[variant];
  const currentStyles = { ...baseStyles, ...currentVariant };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      style={currentStyles}
      onMouseEnter={(e) => {
        if (variant === "default") {
          e.currentTarget.style.background = isFav ? "#ff5252" : "#e9ecef";
        } else {
          e.currentTarget.style.color = isFav ? "#ff5252" : "#333";
        }
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        if (variant === "default") {
          e.currentTarget.style.background = isFav ? "#ff6b6b" : "#f8f9fa";
        } else {
          e.currentTarget.style.color = isFav ? "#ff6b6b" : "#666";
        }
        e.currentTarget.style.transform = "scale(1)";
      }}
      title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      {isFav ? "❤️" : "🤍"}
      {variant === "default" && (
        <span>{isFav ? "Retirer" : "Ajouter"}</span>
      )}
    </button>
  );
}
