import Image from "next/image";

const reviewsData = [
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
  { value: "500+", label: "Barils vendus" },
  { value: "4.9/5", label: "Note moyenne" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "24H", label: "Livraison express" },
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

        {/* Stats — single row sur mobile, séparateurs propres */}
        <div className="grid grid-cols-4 border-t border-b border-gray-200 divide-x divide-gray-200 mb-16">
          {statsData.map((stat) => (
            <div key={stat.label} className="text-center py-6 md:py-8 px-2 md:px-4">
              <p className="text-xl md:text-3xl lg:text-4xl font-bold text-orange-500 font-bebas-neue tracking-wide">
                {stat.value}
              </p>
              <p className="mt-1 text-[9px] md:text-xs text-gray-400 tracking-wider uppercase font-space-grotesk leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Cartes d'avis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsData.map((review) => (
            <div key={review.name} className="flex flex-col gap-4 border border-gray-100 rounded-2xl p-6 shadow-sm">
              {/* Étoiles */}
              <div className="flex gap-0.5">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-orange-500 text-sm">★</span>
                ))}
              </div>

              {/* Texte */}
              <p className="text-gray-600 text-sm leading-relaxed font-space-grotesk">
                {review.text}
              </p>

              {/* Avatar + Nom */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold font-space-grotesk">
                    {review.initial}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 font-space-grotesk">
                    {review.name}
                  </p>
                  <p className="text-xs text-gray-400 font-space-grotesk">
                    {review.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
