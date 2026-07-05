"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Image parallax : le conteneur défile normalement, l'image à l'intérieur
 * remonte légèrement plus vite que le scroll. L'image est agrandie juste
 * assez (scale calculé selon la hauteur du conteneur) pour que le décalage
 * ne découvre jamais de vide.
 *
 * `strength` = amplitude max du décalage en px.
 * Désactivé si prefers-reduced-motion.
 */
export default function ParallaxImage({
  src,
  alt,
  sizes,
  strength = 40,
  className = "",
}: {
  src: string;
  alt: string;
  sizes?: string;
  strength?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;

    const update = () => {
      const container = containerRef.current;
      const layer = layerRef.current;
      if (!container || !layer) return;

      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;

      // Position du centre de l'élément par rapport au centre du viewport,
      // normalisée : +1 quand il entre par le bas, -1 quand il sort par le haut.
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));

      // Scale calculé pour que l'overscan couvre toujours l'amplitude du
      // décalage, quelle que soit la hauteur du conteneur.
      const scale = 1 + (2 * strength) / rect.height + 0.02;

      // L'image remonte quand on scrolle vers le bas — elle "devance" le scroll.
      layer.style.transform = `translateY(${clamped * strength}px) scale(${scale})`;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      <div ref={layerRef} className="absolute inset-0 will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    </div>
  );
}
