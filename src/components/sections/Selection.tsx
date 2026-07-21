import Image from "next/image";

export default function Selection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        {/* Texte */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-tight max-w-3xl">
          Chaque baril est sélectionné, décapé et
          <span className="text-orange-500"> thermolaqué </span>
          dans notre atelier.
        </h2>

        {/* Mobile : masonry CSS columns (vraies hauteurs naturelles) */}
        <div className="mt-10 md:hidden columns-2 gap-3">
          {[
            { src: "/images/thermolaquage/black-loft.png", alt: "Baril MonBaril Black Loft" },
            { src: "/images/thermolaquage/blue-swedish.png", alt: "Baril MonBaril Blue Swedish" },
            { src: "/images/thermolaquage/chocolate-chic.png", alt: "Baril MonBaril Chocolate Chic" },
            { src: "/images/thermolaquage/japandi.png", alt: "Baril MonBaril Japandi" },
            { src: "/images/thermolaquage/rouge-design.png", alt: "Baril MonBaril Rouge Design" },
            { src: "/images/thermolaquage/street-yellow.png", alt: "Baril MonBaril Street Yellow" },
          ].map(({ src, alt }) => (
            <div key={src} className="relative w-full mb-3 break-inside-avoid rounded-lg overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <Image src={src} alt={alt} fill className="object-cover" sizes="47vw" />
            </div>
          ))}
        </div>

        {/* Desktop : gradient horizontal */}
        <div className="mt-10 hidden md:grid md:grid-cols-6 gap-4">
          {[
            { src: "/images/thermolaquage/black-loft.png", alt: "Baril MonBaril Black Loft", h: "h-48" },
            { src: "/images/thermolaquage/blue-swedish.png", alt: "Baril MonBaril Blue Swedish", h: "h-64" },
            { src: "/images/thermolaquage/chocolate-chic.png", alt: "Baril MonBaril Chocolate Chic", h: "h-80" },
            { src: "/images/thermolaquage/japandi.png", alt: "Baril MonBaril Japandi", h: "h-80" },
            { src: "/images/thermolaquage/rouge-design.png", alt: "Baril MonBaril Rouge Design", h: "h-64" },
            { src: "/images/thermolaquage/street-yellow.png", alt: "Baril MonBaril Street Yellow", h: "h-48" },
          ].map(({ src, alt, h }) => (
            <div key={src} className={`relative overflow-hidden rounded-lg ${h}`}>
              <Image src={src} alt={alt} fill className="object-cover" sizes="16vw" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
