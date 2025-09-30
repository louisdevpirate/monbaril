"use client";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular" | "card";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export default function Skeleton({ 
  className = "", 
  variant = "rectangular",
  width,
  height,
  lines = 1
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200 rounded";
  
  const variantClasses = {
    text: "h-4",
    rectangular: "h-4",
    circular: "rounded-full",
    card: "h-48"
  };

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${
              index === lines - 1 ? "w-3/4" : "w-full"
            } ${index > 0 ? "mt-2" : ""}`}
            style={index === lines - 1 ? { ...style, width: "75%" } : style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Composant spécialisé pour les cartes produits
export function ProductCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden flex flex-col">
      {/* Image skeleton */}
      <div className="relative h-48 flex-shrink-0">
        <Skeleton variant="card" className="w-full h-full" />
        
        {/* Badge skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton width={60} height={24} className="rounded-full" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Title and heart */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <Skeleton width="80%" height={20} className="mb-1" />
            <Skeleton width="60%" height={16} />
          </div>
          <Skeleton width={32} height={32} className="rounded-full ml-2" />
        </div>
        
        {/* Rating skeleton */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} width={16} height={16} className="rounded-sm" />
            ))}
          </div>
          <Skeleton width={60} height={16} />
        </div>
        
        {/* Price and stock */}
        <div className="flex items-center justify-between">
          <Skeleton width={60} height={24} />
          <Skeleton width={80} height={16} />
        </div>
      </div>
    </div>
  );
}

// Composant skeleton pour la grille de produits
export function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Produit principal (2x1) */}
      <div className="col-span-2">
        <ProductCardSkeleton />
      </div>
      
      {/* Produits secondaires (1x1) */}
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="col-span-1">
          <ProductCardSkeleton />
        </div>
      ))}
      
      {/* Dernier produit (2x1) */}
      <div className="col-span-2">
        <ProductCardSkeleton />
      </div>
    </div>
  );
}
