import Image from 'next/image';
import CTAButton from '@/components/ui/CTAButton';

export default function HeaderBis() {
  return (
    <section className="w-full bg-white">
      {/* Une seule grille pour les trois blocs : sur mobile ils s'empilent dans
          l'ordre du DOM (accroche → image → argument + CTA), sur grand écran
          l'image est replacée en colonne de droite sur les deux rangées. */}
      <div className="mx-auto px-6 lg:px-10 pt-12 pb-8 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 lg:gap-x-12 lg:gap-y-6 max-w-[95%] items-start">
        {/* Accroche — cascade d'entrée : chaque élément se pose à 90ms d'écart */}
        <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-1">
          <p className="text-orange-500 text-[10px] lg:text-xs tracking-[0.25em] lg:tracking-[0.3em] font-space-grotesk font-medium anim-enter">
            +&nbsp;&nbsp;L&apos;ATELIER FRANÇAIS DE L&apos;UPCYCLING
          </p>

          {/* Le plancher du clamp valait 5rem : sur un écran de 375px le titre
              gardait 80px par ligne et repoussait le CTA sous la ligne de
              flottaison. Au-dessus de ~640px de large c'est 14vw qui pilote,
              le rendu desktop est donc inchangé. */}
          <h1
            className="font-bold text-black leading-[0.92] tracking-tight font-bebas-neue uppercase anim-enter"
            style={{ fontSize: 'clamp(3.5rem, 14vw, 9rem)', animationDelay: '90ms' }}
          >
            Faites le
            <br />
            plein de
            <br />
            <span className="text-orange-500">style.</span>
          </h1>
        </div>

        {/* Image — après le titre sur mobile : placée avant, elle repousse le
            CTA sous la ligne de flottaison sur les petits écrans. Le ratio 4/3
            ne change jamais, ce qui garde l'étiquette de prix sur le baril. */}
        <div className="relative w-full aspect-[4/3] lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <div className="absolute inset-0 rounded-xl overflow-hidden bg-gray-100">
            {/* Élément LCP de la page : laissé à l'optimiseur Next (WebP + taille
                adaptée à l'écran), le fichier source pesant 4,4 Mo. */}
            <Image
              src="/images/hero-salon.png"
              alt="Baril MonBaril thermolaqué orange dans un salon vintage"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 66vw"
              className="object-cover"
            />
          </div>

          {/* Étiquette de prix — en texte, pas incrustée dans la photo : elle
              reste modifiable, lue par Google, et suit le recadrage. */}
          <div
            className="absolute anim-enter"
            style={{ left: '24%', top: '58%', animationDelay: '450ms' }}
          >
            <span className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md ring-2 ring-black/5" />
            <span className="absolute bottom-4 left-8 whitespace-nowrap rounded-xl bg-white px-4 py-2 shadow-xl text-sm md:text-base font-semibold text-gray-900 font-space-grotesk">
              400&nbsp;€
            </span>
          </div>
        </div>

        {/* Argument, CTA et chiffres */}
        <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-2">
          <p
            className="text-gray-500 text-base max-w-sm font-space-grotesk leading-relaxed anim-enter"
            style={{ animationDelay: '180ms' }}
          >
            Fûts métalliques 200&nbsp;L upcyclés et thermolaqués en France. Des pièces de caractère — brutes, vivantes, uniques.
          </p>

          <div className="anim-enter" style={{ animationDelay: '270ms' }}>
            <CTAButton href="/products/baril-monochrome">
              Composer mon baril
            </CTAButton>
          </div>

          {/* Stats avec séparateur vertical */}
          <div
            className="grid grid-cols-2 divide-x divide-gray-200 border-t border-gray-200 pt-4 mt-2 anim-enter"
            style={{ animationDelay: '360ms' }}
          >
            <div className="pr-4">
              <p className="text-2xl font-bold text-gray-900 font-bebas-neue tracking-wide">200&nbsp;L</p>
              <p className="text-[10px] text-gray-400 tracking-[0.15em] uppercase font-space-grotesk">D&apos;acier upcyclé</p>
            </div>
            <div className="pl-4">
              <p className="text-2xl font-bold text-gray-900 font-bebas-neue tracking-wide">100%</p>
              <p className="text-[10px] text-gray-400 tracking-[0.15em] uppercase font-space-grotesk">Fabriqué en France</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
