export default function Selection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        {/* Texte */}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-snug max-w-2xl">
          We meticulously curate our
          <span className="text-orange-500"> product selections </span>
          to ensure you receive only the best.
        </h2>

        {/* Galerie */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div className="overflow-hidden rounded-lg h-48">
            <img
              src="/images/products/japan.jpeg"
              alt="Baril MonBaril Racing Gulf - Design automobile unique"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-lg h-64">
            <img
              src="/images/products/scandinav.jpeg"
              alt="Baril MonBaril Vintage Oil - Style industriel authentique"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-lg h-80">
            <img
              src="/images/products/pop.jpeg"
              alt="Baril MonBaril Military Cargo - Esthétique commando"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-lg h-80">
            <img
              src="/images/products/loft.jpeg"
              alt="Baril MonBaril Cyberpunk - Design futuriste urbain"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-lg h-64">
            <img
              src="/images/products/newyork.jpeg"
              alt="Baril MonBaril Street Art - Inspiration urbaine"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-lg h-48">
            <img
              src="/images/products/matcha.jpeg"
              alt="Baril MonBaril Minimalist - Design épuré moderne"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
