import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ArticleCard from "@/components/blog/ArticleCard";
import { ARTICLES } from "@/lib/blog/articles";

/**
 * Les trois derniers articles, juste avant la bannière d'achat. Au-delà de la
 * lecture, c'est le lien le plus exploré du site vers le blog : le panneau
 * latéral n'existe dans le HTML qu'une fois ouvert, les robots ne le voient pas.
 */
export default function BlogTeaser() {
  const derniers = ARTICLES.slice(0, 3);
  if (derniers.length === 0) return null;

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        <Reveal className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk font-medium">
              +&nbsp;&nbsp;JOURNAL D&apos;ATELIER
            </p>
            <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.9]">
              Le métal,
              <br />
              expliqué
            </h2>
            <p className="mt-5 text-gray-500 text-base leading-relaxed font-space-grotesk">
              Thermolaquage, couleurs RAL, fûts 200&nbsp;L : ce que nous
              apprenons à l&apos;atelier, écrit pour vous aider à choisir.
            </p>
          </div>

          <Link
            href="/blog"
            className="shrink-0 text-sm font-space-grotesk text-gray-900 underline underline-offset-4 hover:text-orange-500 transition-colors"
          >
            Tous les articles →
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {derniers.map((article, i) => (
            <Reveal key={article.slug} delay={i * 100}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
