export default function Selection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        {/* Texte */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-tight max-w-3xl">
          Chaque baril est sélectionné, préparé et
          <span className="text-orange-500"> fini à la main </span>
          dans notre atelier.
        </h2>

        {/* Mobile : masonry CSS columns (vraies hauteurs naturelles) */}
        <div className="mt-10 md:hidden columns-2 gap-3">
          <img src="/images/products/japan.jpeg" alt="Baril MonBaril Racing Gulf" className="w-full rounded-lg mb-3 break-inside-avoid" />
          <img src="/images/products/scandinav.jpeg" alt="Baril MonBaril Vintage Oil" className="w-full rounded-lg mb-3 break-inside-avoid" />
          <img src="/images/products/pop.jpeg" alt="Baril MonBaril Military Cargo" className="w-full rounded-lg mb-3 break-inside-avoid" />
          <img src="/images/products/loft.jpeg" alt="Baril MonBaril Cyberpunk" className="w-full rounded-lg mb-3 break-inside-avoid" />
          <img src="/images/products/newyork.jpeg" alt="Baril MonBaril Street Art" className="w-full rounded-lg mb-3 break-inside-avoid" />
          <img src="/images/products/matcha.jpeg" alt="Baril MonBaril Minimalist" className="w-full rounded-lg mb-3 break-inside-avoid" />
        </div>

        {/* Desktop : gradient horizontal */}
        <div className="mt-10 hidden md:grid md:grid-cols-6 gap-4">
          <div className="overflow-hidden rounded-lg h-48">
            <img src="/images/products/japan.jpeg" alt="Baril MonBaril Racing Gulf" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-lg h-64">
            <img src="/images/products/scandinav.jpeg" alt="Baril MonBaril Vintage Oil" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-lg h-80">
            <img src="/images/products/pop.jpeg" alt="Baril MonBaril Military Cargo" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-lg h-80">
            <img src="/images/products/loft.jpeg" alt="Baril MonBaril Cyberpunk" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-lg h-64">
            <img src="/images/products/newyork.jpeg" alt="Baril MonBaril Street Art" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-lg h-48">
            <img src="/images/products/matcha.jpeg" alt="Baril MonBaril Minimalist" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
