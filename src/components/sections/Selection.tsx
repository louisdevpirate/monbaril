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
          <img src="/images/thermolaquage/black-loft.png" alt="Baril MonBaril Black Loft" className="w-full rounded-lg mb-3 break-inside-avoid" />
          <img src="/images/thermolaquage/blue-swedish.png" alt="Baril MonBaril Blue Swedish" className="w-full rounded-lg mb-3 break-inside-avoid" />
          <img src="/images/thermolaquage/chocolate-chic.png" alt="Baril MonBaril Chocolate Chic" className="w-full rounded-lg mb-3 break-inside-avoid" />
          <img src="/images/thermolaquage/japandi.png" alt="Baril MonBaril Japandi" className="w-full rounded-lg mb-3 break-inside-avoid" />
          <img src="/images/thermolaquage/rouge-design.png" alt="Baril MonBaril Rouge Design" className="w-full rounded-lg mb-3 break-inside-avoid" />
          <img src="/images/thermolaquage/street-yellow.png" alt="Baril MonBaril Street Yellow" className="w-full rounded-lg mb-3 break-inside-avoid" />
        </div>

        {/* Desktop : gradient horizontal */}
        <div className="mt-10 hidden md:grid md:grid-cols-6 gap-4">
          <div className="overflow-hidden rounded-lg h-48">
            <img src="/images/thermolaquage/black-loft.png" alt="Baril MonBaril Black Loft" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-lg h-64">
            <img src="/images/thermolaquage/blue-swedish.png" alt="Baril MonBaril Blue Swedish" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-lg h-80">
            <img src="/images/thermolaquage/chocolate-chic.png" alt="Baril MonBaril Chocolate Chic" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-lg h-80">
            <img src="/images/thermolaquage/japandi.png" alt="Baril MonBaril Japandi" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-lg h-64">
            <img src="/images/thermolaquage/rouge-design.png" alt="Baril MonBaril Rouge Design" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-lg h-48">
            <img src="/images/thermolaquage/street-yellow.png" alt="Baril MonBaril Street Yellow" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
