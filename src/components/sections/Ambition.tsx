import Image from "next/image";
import CTAButton from '@/components/ui/CTAButton';
import ParallaxImage from '@/components/ui/ParallaxImage';

export default function Ambition() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        {/* Les deux moitiés vivent dans un même bloc arrondi : la section
            partait auparavant d'un bord à l'autre, à angles vifs, alors que
            tout le reste de la page est contenu et arrondi. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden">
          {/* Bloc gauche — Texte sur fond crème */}
          <div className="bg-[#f5f0ea] px-8 md:px-14 lg:px-16 py-16 lg:py-20 flex flex-col justify-center">
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
              Chaque fût que nous récupérons a déjà servi. Plutôt que de partir
              à la casse, il est décapé, traité contre la rouille et remis en
              état dans notre atelier. Ce qui était un contenant industriel
              devient une pièce de mobilier — sans rien renier de ce qu&apos;il
              était.
            </p>

            <div className="mt-8">
              <CTAButton href="/about">
                Découvrir notre histoire
              </CTAButton>
            </div>
          </div>

          {/* Bloc droit — Image avec parallax */}
          <div className="relative bg-gray-200 min-h-[340px] lg:min-h-0">
            {/* Étoile décorative — posée sur le conteneur, ne bouge pas */}
            <Image
              src="/images/star-orange.svg"
              alt=""
              width={50}
              height={50}
              className="absolute top-6 left-6 z-10"
            />

            <ParallaxImage
              src="/images/bio.jpg"
              alt="Baril MonBaril thermolaqué vert en extérieur"
              sizes="(max-width: 1024px) 100vw, 50vw"
              strength={55}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
