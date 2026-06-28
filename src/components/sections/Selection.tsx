export default function Selection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        {/* Texte */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-tight max-w-3xl">
          Nous curons méticuleusement nos
          <span className="text-orange-500"> sélections </span>
          pour vous offrir le meilleur.
        </h2>

        {/* Bento Grid — mobile : 2 colonnes irrégulières ; desktop : 6 colonnes gradient */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
          {/* Mobile : grid mosaic */}
          <div className="overflow-hidden rounded-lg aspect-square md:h-48 md:aspect-auto">
            <img
              src="/images/products/japan.jpeg"
              alt="Baril MonBaril Racing Gulf"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-lg aspect-[3/4] row-span-2 md:row-span-1 md:h-64 md:aspect-auto">
            <img
              src="/images/products/scandinav.jpeg"
              alt="Baril MonBaril Vintage Oil"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-lg aspect-square md:h-80 md:aspect-auto">
            <img
              src="/images/products/pop.jpeg"
              alt="Baril MonBaril Military Cargo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-lg aspect-[3/4] row-span-2 md:row-span-1 md:h-80 md:aspect-auto">
            <img
              src="/images/products/loft.jpeg"
              alt="Baril MonBaril Cyberpunk"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-lg aspect-square md:h-64 md:aspect-auto">
            <img
              src="/images/products/newyork.jpeg"
              alt="Baril MonBaril Street Art"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-lg aspect-square md:h-48 md:aspect-auto">
            <img
              src="/images/products/matcha.jpeg"
              alt="Baril MonBaril Minimalist"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
