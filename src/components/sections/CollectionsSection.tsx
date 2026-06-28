"use client";

import Image from "next/image";
import Link from "next/link";

export default function CollectionsSection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.9]">
            Collections en vedette
          </h2>
          <p className="mt-3 text-gray-500 text-base font-space-grotesk">
            Quatre univers, quatre histoires.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] lg:grid-rows-2 gap-5 lg:h-[600px]">
          {/* Grande carte gauche — Racing Legends */}
          <Link
            href="/categories/barils-racing"
            className="group relative rounded-2xl overflow-hidden bg-gray-200 lg:row-span-2"
          >
            <Image
              src="/images/products/japan.png"
              alt="Racing Legends"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 z-10">
              <span className="text-orange-400 text-xs font-semibold tracking-wider uppercase font-space-grotesk">
                Featured
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-bebas-neue uppercase tracking-wide mt-1">
                Racing Legends
              </h3>
              <p className="text-white/80 text-sm font-space-grotesk mt-1">
                Inspirés des plus grandes courses automobiles.
              </p>
            </div>
          </Link>

          {/* Carte haut droite — Vintage Oil */}
          <Link
            href="/categories/barils-vintage"
            className="group relative rounded-2xl overflow-hidden bg-gray-200"
          >
            <Image
              src="/images/products/loft.jpeg"
              alt="Vintage Oil"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-5 left-5 z-10">
              <h3 className="text-xl font-bold text-white font-bebas-neue uppercase tracking-wide">
                Vintage Oil
              </h3>
            </div>
          </Link>

          {/* Carte bas droite — Sur Mesure */}
          <Link
            href="/categories/barils-custom"
            className="group relative rounded-2xl overflow-hidden bg-orange-500 flex flex-col justify-end p-6"
          >
            {/* Icône étoile 4 branches */}
            <Image
              src="/images/star.svg"
              alt=""
              width={65}
              height={65}
              className="absolute top-8 left-5"
            />

            <h3 className="text-4xl md:text-5xl font-bold text-white font-bebas-neue uppercase tracking-wide">
              Sur mesure
            </h3>
            <p className="text-white/80 text-sm font-space-grotesk mt-1 group-hover:text-white transition-colors">
              Votre baril, vos règles. →
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
