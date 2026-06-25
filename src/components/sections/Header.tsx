import Link from 'next/link';
import Image from 'next/image';
import CTAButton from '@/components/ui/CTAButton';

export default function HeaderBis() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto px-6 lg:px-10 pt-16 pb-2 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-[95%]">
        {/* Bloc gauche */}
        <div className="flex flex-col justify-space-around lg:col-span-1">
          <h1 className="font-bold text-black leading-[0.9] tracking-tight font-bebas-neue pb-4 w-full" style={{ fontSize: 'clamp(2.5rem, 8vw, 9rem)' }}>
            Faites le plein de <span className="text-orange-500">style.</span>
          </h1>
          <p className="text-md text-gray-600 max-w-[80%] font-space-grotesk pb-8">
            Barils industriels transformés en objets d'art décoratifs uniques.
          </p>
          <CTAButton 
            href="/categories"
            note="Paiement 100% sécurisé – Livraison rapide"
          >
            Voir les catégories
          </CTAButton>
        </div>

        {/* Bloc droit */}
        <div className="lg:col-span-2">
          {/* Carte produit */}
          <div className="relative bg-gray-50 overflow-hidden">
            <Image 
              src="/images/header-desktop.png"
              alt="Baril MonBaril Racing Gulf - Design unique et moderne"
              width={1000}
              height={1000}
              className="object-cover w-full h-auto rounded-lg"
            />
            <div className="absolute top-2 left-2 bg-white text-sm font-medium px-3 py-1 rounded-md shadow">
              450.00€
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}