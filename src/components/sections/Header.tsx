import Image from 'next/image';
import CTAButton from '@/components/ui/CTAButton';

export default function HeaderBis() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto px-6 lg:px-10 pt-12 pb-8 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 max-w-[95%] items-start">
        {/* Bloc gauche */}
        <div className="flex flex-col gap-6">
          {/* Sous-titre */}
          <p className="text-orange-500 text-[10px] lg:text-xs tracking-[0.25em] lg:tracking-[0.3em] font-space-grotesk font-medium">
            +&nbsp;&nbsp;L&apos;ATELIER DE L&apos;UPCYCLING
          </p>

          {/* Titre principal */}
          <h1
            className="font-bold text-black leading-[0.92] tracking-tight font-bebas-neue uppercase"
            style={{ fontSize: 'clamp(5rem, 14vw, 9rem)' }}
          >
            Faites le
            <br />
            plein de
            <br />
            <span className="text-orange-500">style.</span>
          </h1>

          {/* Description */}
          <p className="text-gray-500 text-base max-w-sm font-space-grotesk leading-relaxed">
            Des barils industriels métamorphosés en pièces de caractère. Bruts, vivants, uniques.
          </p>

          {/* CTA */}
          <CTAButton href="/categories">
            Voir les catégories
          </CTAButton>

          {/* Stats avec séparateur vertical */}
          <div className="grid grid-cols-2 divide-x divide-gray-200 border-t border-gray-200 pt-4 mt-2">
            <div className="pr-4">
              <p className="text-2xl font-bold text-gray-900 font-bebas-neue tracking-wide">2 098</p>
              <p className="text-[10px] text-gray-400 tracking-[0.15em] uppercase font-space-grotesk">Barils livrés</p>
            </div>
            <div className="pl-4">
              <p className="text-2xl font-bold text-gray-900 font-bebas-neue tracking-wide">100%</p>
              <p className="text-[10px] text-gray-400 tracking-[0.15em] uppercase font-space-grotesk">Fait main</p>
            </div>
          </div>
        </div>

        {/* Bloc droit — Image */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
          <Image
            src="/images/header-desk.png"
            alt="Baril MonBaril — Design unique et moderne"
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
