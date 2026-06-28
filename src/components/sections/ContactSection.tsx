import Image from "next/image";
import Link from "next/link";

export default function ContactSection() {
  return (
    <section className="px-6 lg:px-8 mb-16">
      <div className="max-w-[95%] mx-auto">
        <div className="relative bg-orange-500 px-8 md:px-16 py-16 md:py-20 overflow-hidden" style={{ borderRadius: '60px 60px 60px 10px' }}>
          {/* Étoile décorative */}
          <Image
            src="/images/star.svg"
            alt=""
            width={60}
            height={60}
            className="absolute top-8 left-8 opacity-50"
          />

          {/* Rond décoratif */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full hidden md:block" style={{ backgroundColor: 'rgba(255, 161, 122, 0.5)' }} />

          {/* Contenu */}
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-bebas-neue uppercase tracking-wide text-white leading-[0.95]">
              Besoin d&apos;aide
              <br />
              pour choisir ?
            </h2>
            <p className="mt-4 text-white/80 text-base font-space-grotesk max-w-md">
              Notre équipe d&apos;experts vous accompagne dans le choix de votre baril.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href="/contact"
                className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-sm font-space-grotesk hover:bg-black transition-colors text-center"
              >
                Nous contacter
              </Link>
              <Link
                href="/about"
                className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-sm font-space-grotesk hover:bg-gray-100 transition-colors text-center"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
