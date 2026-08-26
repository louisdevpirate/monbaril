import Image from "next/image";

const statsData = [
  { value: "200 L", label: "Fût métallique d'origine" },
  { value: "213", label: "Teintes RAL au choix" },
  { value: "7-10 j", label: "Fabrication à la commande" },
];

export default function ReviewsSection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        {/* Avis en vedette */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Image
            src="/images/star-orange.svg"
            alt=""
            width={30}
            height={30}
            className="mx-auto mb-6"
          />
          <blockquote className="text-xl md:text-2xl text-gray-900 font-space-grotesk leading-relaxed">
            Chaque baril est fabriqué à la commande, dans notre atelier
            en France — décapé, traité et thermolaqué à la main.
          </blockquote>
        </div>

        {/* Stats — 3 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-gray-200">
          {statsData.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center py-10 md:py-8 px-4 ${
                i > 0 ? "border-t border-gray-200 md:border-t-0 md:border-l" : ""
              }`}
            >
              <p className="text-3xl md:text-4xl font-bold text-orange-500 font-bebas-neue tracking-wide">
                {stat.value}
              </p>
              <p className="mt-2 text-[10px] md:text-xs text-gray-400 tracking-wider uppercase font-space-grotesk leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
