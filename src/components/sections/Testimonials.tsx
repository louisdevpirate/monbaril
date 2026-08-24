"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { StarIcon } from "@/components/icons/icons";

/**
 * ⚠️ CONTENU DE PLACEHOLDER — À NE PAS LAISSER EN PRODUCTION.
 *
 * Ces avis sont inventés. Publier de faux avis de consommateurs est une
 * pratique commerciale trompeuse (art. L.121-4 du Code de la consommation,
 * depuis la directive Omnibus). Ils sont ici pour juger la mise en page,
 * rien d'autre.
 *
 * Vider le tableau suffit à retirer la section : elle ne rend rien quand il
 * est vide, aucune modification de la page d'accueil n'est nécessaire.
 */
interface Review {
  quote: string;
  author: string;
  city: string;
  rating: number;
}

const REVIEWS: Review[] = [
  {
    quote:
      "Je cherchais une pièce forte pour l'angle du salon, sans tomber dans le meuble industriel déjà vu. La finition est irréprochable — on dirait une pièce de galerie, pas un fût recyclé.",
    author: "Prénom N.",
    city: "Paris 11e",
    rating: 5,
  },
  {
    quote:
      "La teinte correspond exactement au RAL choisi. Le rendu mat est superbe en lumière naturelle.",
    author: "Prénom N.",
    city: "Lyon",
    rating: 5,
  },
  {
    quote:
      "Livré sans une rayure. Il sert de bout de canapé et tout le monde demande d'où il vient.",
    author: "Prénom N.",
    city: "Bordeaux",
    rating: 5,
  },
];

// 30 s de lecture laisseraient la barre quasi immobile : le visiteur la prend
// pour un élément figé et ne comprend pas qu'il y a rotation. À 8 s le
// mouvement se perçoit sans presser la lecture.
const ROTATION_MS = 8000;

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span
      className={`inline-flex gap-0.5 ${className}`}
      aria-label={`${rating} sur 5`}
    >
      {Array.from({ length: rating }).map((_, i) => (
        <StarIcon key={i} className="w-3.5 h-3.5" />
      ))}
    </span>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (REVIEWS.length < 2 || paused) return;
    // Respecte prefers-reduced-motion : sans rotation automatique, les avis
    // restent atteignables par les vignettes de droite.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setTimeout(
      () => setActive((i) => (i + 1) % REVIEWS.length),
      ROTATION_MS
    );
    return () => clearTimeout(id);
  }, [active, paused]);

  if (REVIEWS.length === 0) return null;

  const featured = REVIEWS[active];
  const others = REVIEWS.map((r, i) => ({ ...r, index: i })).filter(
    (r) => r.index !== active
  );

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        <Reveal className="mb-12 max-w-2xl">
          <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk font-medium">
            +&nbsp;&nbsp;ILS ONT SAUTÉ LE PAS
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.9]">
            Ce qu&apos;ils en disent
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div
            className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Avis mis en avant */}
            <div className="relative rounded-2xl bg-[#1e1e1e] p-8 md:p-10 flex flex-col justify-between overflow-hidden min-h-[320px]">
              <span
                aria-hidden
                className="absolute -top-10 right-4 text-[12rem] leading-none font-bebas-neue text-white/[0.06] select-none"
              >
                “
              </span>

              <div className="relative z-10">
                <Stars rating={featured.rating} className="text-orange-400" />
                <blockquote
                  key={active}
                  className="mt-6 text-xl md:text-2xl text-white leading-relaxed font-space-grotesk anim-enter"
                >
                  {featured.quote}
                </blockquote>
              </div>

              <div className="relative z-10 mt-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold font-space-grotesk shrink-0">
                  {featured.author.charAt(0)}
                </span>
                <span className="font-space-grotesk">
                  <span className="block text-sm font-semibold text-white">
                    {featured.author}
                  </span>
                  <span className="block text-xs text-white/50">
                    {featured.city}
                  </span>
                </span>
              </div>

              {/* Barre de progression — repart de zéro à chaque avis grâce à
                  la clé, qui force le remontage de l'élément animé. */}
              {REVIEWS.length > 1 && (
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-1 w-full bg-white/10"
                >
                  <span
                    key={`${active}-${paused}`}
                    className="block h-full bg-orange-500 origin-left"
                    style={{
                      animation: `review-progress ${ROTATION_MS}ms linear forwards`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                </span>
              )}
            </div>

            {/* Les autres avis — cliquables pour passer en avant */}
            <div className="grid grid-rows-2 gap-6">
              {others.map((review) => (
                <button
                  key={review.index}
                  type="button"
                  onClick={() => setActive(review.index)}
                  className="text-left rounded-2xl border border-gray-200 p-6 hover:border-gray-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <Stars rating={review.rating} className="text-orange-500" />
                  <p className="mt-4 text-sm text-gray-600 leading-relaxed font-space-grotesk line-clamp-4">
                    {review.quote}
                  </p>
                  <span className="mt-4 flex items-center gap-2 font-space-grotesk">
                    <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {review.author.charAt(0)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {review.author} · {review.city}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
