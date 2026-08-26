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
        <Image
          src="/images/star-orange.svg"
          alt=""
          width={30}
          height={30}
          className="mx-auto mb-12"
        />

        {/* Les trois chiffres portent le bloc seuls : plus de filets qui les
            enferment, seulement des séparateurs verticaux et de l'air. */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-gray-200">
          {statsData.map((stat) => (
            <div key={stat.label} className="text-center py-8 px-4">
              <p className="text-5xl md:text-6xl font-bold text-orange-500 font-bebas-neue tracking-wide leading-none">
                {stat.value}
              </p>
              <p className="mt-3 text-[10px] md:text-xs text-gray-400 tracking-[0.15em] uppercase font-space-grotesk leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
