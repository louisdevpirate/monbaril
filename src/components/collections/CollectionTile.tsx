"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export type TileEffect = "racing" | "vintage" | "custom" | "default";

/**
 * Tuile de collection avec animation thématique au survol, façon Disney+.
 * - Si `videoSrc` est fourni : la vidéo (muette, en boucle) fond en entrée
 *   au survol et se réinitialise au départ — l'effet Disney+ authentique.
 * - Sinon : un effet CSS thématique selon la collection (vitesse lumière
 *   pour racing, pellicule pour vintage, balayage RAL pour le sur mesure).
 * L'animation est montée uniquement pendant le survol : elle repart de zéro
 * à chaque entrée et la tuile revient à son état initial au départ.
 */
export default function CollectionTile({
  href,
  title,
  badge,
  description,
  image,
  videoSrc,
  effect = "default",
  orange = false,
  starIcon = false,
}: {
  href: string;
  title: string;
  badge?: string;
  description?: string;
  image?: string | null;
  videoSrc?: string;
  effect?: TileEffect;
  orange?: boolean;
  starIcon?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onEnter = () => {
    setHovered(true);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  const onLeave = () => {
    setHovered(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  const grainSvg =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='0.55'/></svg>\")";

  return (
    <Link
      href={href}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`group relative block aspect-[16/10] rounded-2xl overflow-hidden ${
        orange ? "bg-orange-500" : "bg-gray-200"
      }`}
    >
      {/* Image de fond */}
      {image && (
        <Image
          src={image}
          alt={`Collection ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            hovered && effect === "vintage" ? "sepia-[0.45] contrast-105" : ""
          }`}
        />
      )}

      {/* Vidéo de survol (fondu façon Disney+) */}
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Effets thématiques CSS — montés uniquement pendant le survol */}
      {hovered && !videoSrc && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          {effect === "racing" && (
            <>
              {/* Deux couches de lignes de vitesse, vitesses différentes */}
              <div
                className="absolute inset-y-0 left-0 w-[200%]"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, transparent 0px, transparent 70px, rgba(255,255,255,0.22) 70px, transparent 74px, transparent 140px)",
                  animation: "fx-speed 0.45s linear infinite",
                }}
              />
              <div
                className="absolute inset-y-0 left-0 w-[200%]"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, transparent 0px, transparent 45px, rgba(255,255,255,0.10) 45px, transparent 47px, transparent 90px)",
                  animation: "fx-speed 0.25s linear infinite",
                }}
              />
            </>
          )}

          {effect === "vintage" && (
            <>
              {/* Grain de pellicule */}
              <div
                className="absolute -inset-[25%] opacity-15"
                style={{
                  backgroundImage: grainSvg,
                  animation: "fx-grain 0.4s steps(4) infinite",
                }}
              />
              {/* Scintillement de projecteur */}
              <div
                className="absolute inset-0 bg-black"
                style={{ animation: "fx-flicker 1.8s linear infinite" }}
              />
              {/* Vignettage */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)",
                }}
              />
            </>
          )}

          {effect === "custom" && (
            /* Balayage des teintes RAL du configurateur */
            <div
              className="absolute inset-0 mix-blend-soft-light opacity-80"
              style={{
                background:
                  "linear-gradient(90deg, #F44611, #383E42, #F6F6F6, #084A27, #0E518D, #F44611)",
                backgroundSize: "200% 100%",
                animation: "fx-ral 2.2s linear infinite",
              }}
            />
          )}

          {effect === "default" && (
            /* Reflet diagonal qui traverse la tuile */
            <div
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ animation: "fx-sweep 1.4s ease-in-out infinite" }}
            />
          )}
        </div>
      )}

      {/* Dégradé de lisibilité */}
      {!orange && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      )}

      {/* Étoile (tuile sur mesure) */}
      {starIcon && (
        <Image
          src="/images/star.svg"
          alt=""
          width={65}
          height={65}
          className={`absolute top-6 left-6 transition-transform duration-500 ${
            hovered ? "rotate-90" : ""
          }`}
        />
      )}

      {/* Flèche au survol */}
      {!orange && (
        <span className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      )}

      {/* Contenu */}
      <div className="absolute bottom-0 inset-x-0 p-6">
        {badge && (
          <span
            className={`text-xs font-semibold tracking-wider uppercase font-space-grotesk ${
              orange ? "text-white/70" : "text-orange-400"
            }`}
          >
            {badge}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-bold text-white font-bebas-neue uppercase tracking-wide mt-1">
          {title}
        </h2>
        {description && (
          <p
            className={`text-white/80 text-sm font-space-grotesk mt-1 line-clamp-2 max-w-md ${
              orange ? "group-hover:text-white transition-colors" : ""
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
