import Image from "next/image";
import CTAButton from '@/components/ui/CTAButton';

export default function Ambition() {
  return (
<section className="w-full bg-white py-20">
  <div className="max-w-[95%] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    
    {/* <!-- Image --> */}
    <div className="w-full">
      <Image src="/images/products/japan.jpeg" 
           alt="Baril MonBaril transformé en objet décoratif unique - Design industriel moderne"
           className="object-cover w-full h-full"
           width={1000}
           height={1000}
           />
    </div>

    {/* <!-- Texte --> */}
    <div className="flex flex-col justify-center">
      <p className="text-sm uppercase tracking-wider text-gray-500">Notre Vision</p>
      <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-gray-900 leading-snug">
        Révolutionner l'art décoratif avec l'upcycling industriel
      </h2>
      <p className="mt-4 text-gray-600 text-base leading-relaxed max-w-md">
        Chez MonBaril™, nous transformons l'héritage industriel en objets d'art contemporains. 
        Chaque baril devient une pièce unique, alliant authenticité vintage et design moderne. 
        Notre mission : démocratiser l'art décoratif en donnant une seconde vie aux matériaux industriels, 
        créant des pièces exclusives qui racontent une histoire et embellissent votre intérieur.
      </p>
      <div className="mt-6">
        <CTAButton href="/about" variant="secondary">
          Découvrir notre histoire
        </CTAButton>
      </div>
    </div>
  </div>
</section>
  );
}