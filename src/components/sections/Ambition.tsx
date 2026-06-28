import Image from "next/image";
import CTAButton from '@/components/ui/CTAButton';

export default function Ambition() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Bloc gauche — Texte sur fond crème */}
        <div className="bg-[#f5f0ea] px-8 md:px-16 lg:px-20 py-20 flex flex-col justify-center">
          <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk font-medium mb-6">
            +&nbsp;&nbsp;NOTRE VISION
          </p>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.92]">
            Une seconde vie
            <br />
            pour la matière
            <br />
            brute
          </h2>

          <p className="mt-6 text-gray-500 text-base leading-relaxed max-w-md font-space-grotesk">
            Chez MonBaril, nous transformons l&apos;héritage industriel en
            objets d&apos;art contemporains. Chaque baril devient une pièce
            unique, alliant authenticité du vintage et modernité du design.
          </p>

          <div className="mt-8">
            <CTAButton href="/about">
              Découvrir notre histoire
            </CTAButton>
          </div>
        </div>

        {/* Bloc droit — Image */}
        <div className="relative bg-gray-200 min-h-[400px] lg:min-h-0">
          {/* Étoile décorative */}
          <Image
            src="/images/star-orange.svg"
            alt=""
            width={50}
            height={50}
            className="absolute top-6 left-6 z-10"
          />

          <Image
            src="/images/products/japan.jpeg"
            alt="Intérieur avec baril MonBaril"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
