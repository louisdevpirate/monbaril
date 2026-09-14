import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/blog/types";
import { tempsDeLecture } from "@/lib/blog/articles";
import { formaterDate } from "@/lib/blog/texte";

export default function ArticleCard({
  article,
  /** h2 sur la page blog, où les cartes sont le premier niveau ; h3 ailleurs. */
  niveau = "h3",
  sizes = "(max-width: 768px) 100vw, 33vw",
}: {
  article: Article;
  niveau?: "h2" | "h3";
  sizes?: string;
}) {
  const Titre = niveau;

  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#f5f0ea]">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-[0.2em] uppercase font-space-grotesk">
        <span className="text-orange-500 font-medium">{article.rubrique}</span>
        <span className="text-gray-400">
          <time dateTime={article.publieLe}>{formaterDate(article.publieLe)}</time>
          {" · "}
          {tempsDeLecture(article)} min
        </span>
      </p>

      <Titre className="mt-3 text-2xl md:text-3xl font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.95] group-hover:text-orange-500 transition-colors">
        {article.titre}
      </Titre>

      <p className="mt-3 text-sm text-gray-500 leading-relaxed font-space-grotesk line-clamp-3">
        {article.extrait}
      </p>
    </Link>
  );
}
