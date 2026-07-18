import Image from "next/image";

// Trois étapes de fabrication mises en avant — mêmes formulations que la
// fiche produit (section Caractéristiques), pour ne rien affirmer de neuf.
const commitments = [
  {
    title: "Origine industrielle",
    text: "Fût métallique 200 L d'origine industrielle, décapé et traité antirouille.",
  },
  {
    title: "Thermolaquage",
    text: "Peinture poudre électrostatique cuite au four — finition mat, brillant ou grainé.",
  },
  {
    title: "Pièce unique",
    text: "Fabriqué à la commande dans notre atelier en France. Aucun baril ne ressemble exactement à un autre.",
  },
];

const statsData = [
  { value: "200 L", label: "Fût métallique d'origine" },
  { value: "100%", label: "Pièces uniques" },
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
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-gray-200 mb-16">
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

        {/* Cartes d'exigence — mêmes faits que la fiche produit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {commitments.map((item, i) => (
            <div
              key={item.title}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#1e1e1e]"
            >
              <span
                aria-hidden
                className="absolute -top-8 -right-4 text-[10rem] leading-none font-bebas-neue text-white/[0.06] select-none"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider font-space-grotesk">
                  {item.title}
                </p>
                <p className="mt-3 text-white/90 text-sm leading-relaxed font-space-grotesk">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
