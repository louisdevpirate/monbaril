import Image from "next/image";
import CTAButton from '@/components/ui/CTAButton';
import ParallaxImage from '@/components/ui/ParallaxImage';

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
            Chaque fût que nous récupérons a déjà vécu. Nous le décapons,
            puis le thermolaquons — une peinture poudre appliquée par procédé
            électrostatique et cuite au four. Une finition durable, résistante
            aux chocs et aux UV, qui donne à la matière brute une seconde vie
            de plusieurs décennies.
          </p>

          <div className="mt-8">
            <CTAButton href="/about">
              Découvrir notre histoire
            </CTAButton>
          </div>
        </div>

        {/* Bloc droit — Image avec parallax */}
        <div className="relative bg-gray-200 min-h-[400px] lg:min-h-0">
          {/* Étoile décorative — posée sur le conteneur, ne bouge pas */}
          <Image
            src="/images/star-orange.svg"
            alt=""
            width={50}
            height={50}
            className="absolute top-6 left-6 z-10"
          />

          <ParallaxImage
            src="/images/products/japan.jpeg"
            alt="Intérieur avec baril MonBaril"
            sizes="(max-width: 768px) 100vw, 50vw"
            strength={55}
          />
        </div>
      </div>
    </section>
  );
}
