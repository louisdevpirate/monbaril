import Image from "next/image";

interface Review {
  name: string;
  initial: string;
  rating: number;
  text: string;
  location: string;
  /** Photo du client avec son baril (chemin public). Optionnel :
      sans photo, la card affiche un monogramme sur fond sombre. */
  image?: string;
}

const reviewsData: Review[] = [
  {
    name: "Marie L.",
    initial: "M",
    rating: 5,
    text: "Mon baril Racing Gulf est absolument magnifique. La qualité est exceptionnelle et il fait sensation dans mon salon.",
    location: "Paris",
  },
  {
    name: "Thomas M.",
    initial: "T",
    rating: 5,
    text: "J'ai commandé le Militaire Cargo pour mon bureau. L'attention aux détails est incroyable. Un vrai objet d'art.",
    location: "Lyon",
  },
  {
    name: "Sophie D.",
    initial: "S",
    rating: 5,
    text: "Service client au top. Le baril Vintage Oil dépasse mes attentes. Je recommande vivement !",
    location: "Marseille",
  },
];

const statsData = [
  { value: "100%", label: "Pièces uniques" },
  { value: "4.9/5", label: "Note moyenne" },
  { value: "98%", label: "Clients satisfaits" },
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
            « Mon baril Racing Gulf est absolument magnifique. Un vrai
            objet d&apos;art qui fait sensation dans mon salon. »
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-orange-500 text-sm">★</span>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-400 tracking-wider font-space-grotesk">
            Marie L. — Paris
          </p>
        </div>

        {/* Stats — 2 colonnes mobile, 4 desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-gray-200 mb-16">
          {statsData.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center py-10 md:py-8 px-4 ${
                i % 2 === 1 ? "border-l border-gray-200" : ""
              } ${i >= 2 ? "border-t border-gray-200 md:border-t-0" : ""} ${
                i >= 2 ? "md:border-l md:border-gray-200" : ""
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

        {/* Cartes d'avis — visuel plein cadre, avis en overlay */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviewsData.map((review) => (
            <div
              key={review.name}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#1e1e1e]"
            >
              {/* Visuel : photo si disponible, sinon monogramme sombre */}
              {review.image ? (
                <Image
                  src={review.image}
                  alt={`${review.name} — cliente MonBaril`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <span
                  aria-hidden
                  className="absolute -top-8 -right-4 text-[14rem] leading-none font-bebas-neue text-white/[0.06] select-none"
                >
                  {review.initial}
                </span>
              )}

              {/* Dégradé pour la lisibilité de l'overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Avis en overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-orange-500 text-sm">★</span>
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed font-space-grotesk">
                  «&nbsp;{review.text}&nbsp;»
                </p>
                <p className="mt-4 text-sm font-semibold text-white font-space-grotesk">
                  {review.name}
                  <span className="ml-2 font-normal text-white/50">
                    — {review.location}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
