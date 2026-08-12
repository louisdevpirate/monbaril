"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

/**
 * Photo d'ambiance annotée, façon IKEA : des points posés sur le baril
 * ouvrent le détail au survol.
 *
 * Le survol n'existe pas au doigt, et l'essentiel du trafic est mobile :
 * les points restent donc cliquables, et surtout les quatre arguments sont
 * répétés en clair sous l'image. Rien d'essentiel n'est réservé à la souris —
 * ni pour le visiteur au doigt, ni pour l'indexation.
 */

// Les coordonnées des points sont calées sur CETTE image : changer la photo
// impose de les reprendre (ce sont des % de la largeur et de la hauteur).
const PHOTO = {
  src: "/images/products/baril-dots.jpg",
  alt: "Baril MonBaril thermolaqué noir dans un loft industriel",
  aspect: "aspect-video",
};

interface Hotspot {
  x: number; // % depuis la gauche
  y: number; // % depuis le haut
  title: string;
  text: string;
  /** Côté d'ouverture du libellé — choisi pour ne pas recouvrir le baril. */
  side: "left" | "right";
}

const HOTSPOTS: Hotspot[] = [
  {
    x: 55,
    y: 47.5,
    side: "right",
    title: "Plateau supérieur",
    text: "Surface plane et lisse : le baril se transforme en table d'appoint ou en bout de canapé.",
  },
  {
    x: 44,
    y: 60,
    side: "left",
    title: "Cerclage d'origine",
    text: "Les nervures structurelles du fût industriel, conservées telles quelles.",
  },
  {
    x: 44,
    y: 78,
    side: "left",
    title: "Thermolaquage au four",
    text: "Peinture poudre électrostatique cuite au four : 213 teintes RAL, en brillant, mat ou grainé.",
  },
  {
    x: 55,
    y: 90,
    side: "right",
    title: "Fût 200 L récupéré",
    text: "Acier industriel décapé et traité antirouille dans notre atelier en France.",
  },
];

export default function BarrelHotspots() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        <Reveal className="mb-12 max-w-2xl">
          <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk font-medium">
            +&nbsp;&nbsp;ANATOMIE
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.9]">
            Ce qu&apos;il y a derrière un baril
          </h2>
        </Reveal>

        <Reveal delay={100}>
          {/* Le clipping aux angles arrondis reste sur l'image seule : les
              points et leurs cartes vivent au-dessus, hors du overflow-hidden,
              sinon une carte basse se fait couper par le bord du cadre. */}
          <div className={`relative w-full ${PHOTO.aspect}`}>
            <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#f5f0ea]">
              <Image
                src={PHOTO.src}
                alt={PHOTO.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 90vw"
                className="object-cover"
                priority={false}
              />
            </div>

            {HOTSPOTS.map((h, i) => {
              const isActive = active === i;
              const opensRight = h.side === "right";
              // Un point bas ouvre sa carte vers le haut : vers le bas elle
              // déborderait sur la reprise en clair juste dessous.
              const opensUp = h.y > 55;
              return (
                <div
                  key={h.title}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                >
                  <div className="relative flex items-center">
                    <button
                      type="button"
                      aria-expanded={isActive}
                      aria-label={h.title}
                      onMouseEnter={() => setActive(i)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(i)}
                      onBlur={() => setActive(null)}
                      onClick={() => setActive(isActive ? null : i)}
                      className={`relative z-10 w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[11px] font-bold transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
                        isActive
                          ? "bg-orange-500 text-white scale-110"
                          : "bg-white/95 text-gray-800 hover:scale-110"
                      }`}
                    >
                      {i + 1}
                    </button>

                    {/* Titre toujours lisible — desktop, où la place le permet */}
                    <span
                      className={`hidden lg:block absolute whitespace-nowrap text-xs font-semibold font-space-grotesk px-2.5 py-1 rounded-full bg-white/95 text-gray-800 shadow-sm pointer-events-none ${
                        opensRight ? "left-9" : "right-9"
                      }`}
                    >
                      {h.title}
                    </span>

                    {/* Détail au survol — desktop */}
                    {isActive && (
                      <div
                        className={`hidden lg:block absolute z-30 w-64 rounded-xl bg-white shadow-xl border border-gray-100 p-4 pointer-events-none ${
                          opensRight ? "left-0" : "right-0"
                        } ${opensUp ? "bottom-8" : "top-8"}`}
                      >
                        <p className="text-sm font-bold text-gray-900 font-space-grotesk">
                          {h.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 leading-relaxed font-space-grotesk">
                          {h.text}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Reprise en clair : lisible au doigt, et indexable */}
        <Reveal delay={200}>
          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOTSPOTS.map((h, i) => (
              <li
                key={h.title}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={`border-t pt-4 transition-colors ${
                  active === i ? "border-orange-500" : "border-gray-200"
                }`}
              >
                <span className="text-xs font-bold text-orange-500 font-space-grotesk">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-base font-bold text-gray-900 font-space-grotesk">
                  {h.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed font-space-grotesk">
                  {h.text}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
