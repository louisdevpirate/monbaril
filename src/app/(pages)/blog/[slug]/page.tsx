import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody, { Inline } from "@/components/blog/ArticleBody";
import ArticleCard from "@/components/blog/ArticleCard";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";
import {
  ARTICLES,
  articlesLies,
  derniereModification,
  getArticle,
  nombreDeMots,
  sommaire,
  tempsDeLecture,
} from "@/lib/blog/articles";
import { formaterDate, horodatage, texteBrut } from "@/lib/blog/texte";

const SITE_URL = "https://www.monbaril.fr";

// Les articles vivent dans le code : tout est généré au build, et un slug
// inconnu donne une vraie 404 plutôt qu'une page vide indexable.
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const url = `${SITE_URL}/blog/${article.slug}`;

  return {
    title: article.titreSeo,
    description: article.description,
    keywords: article.motsCles,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      locale: "fr_FR",
      url,
      siteName: "MonBaril™",
      title: article.titre,
      description: article.description,
      publishedTime: horodatage(article.publieLe),
      modifiedTime: horodatage(derniereModification(article)),
      section: article.rubrique,
      tags: article.motsCles,
      images: [{ url: article.image.src, alt: article.image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.titre,
      description: article.description,
      images: [article.image.src],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const url = `${SITE_URL}/blog/${article.slug}`;
  const titres = sommaire(article);
  const lies = articlesLies(article.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: article.titre,
        description: article.description,
        image: [`${SITE_URL}${article.image.src}`],
        datePublished: horodatage(article.publieLe),
        dateModified: horodatage(derniereModification(article)),
        inLanguage: "fr-FR",
        articleSection: article.rubrique,
        keywords: article.motsCles.join(", "),
        wordCount: nombreDeMots(article),
        mainEntityOfPage: url,
        isPartOf: { "@id": `${SITE_URL}/blog#blog` },
        // Rattaché à l'Organization déclarée dans le layout racine : l'article
        // hérite de l'entité (SIRET, adresse, atelier) au lieu d'un auteur
        // anonyme que rien ne permet de vérifier.
        author: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "MonBaril",
          url: SITE_URL,
        },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: article.titreSeo, item: url },
        ],
      },
      ...(article.faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: article.faq.map((q) => ({
                "@type": "Question",
                name: q.question,
                acceptedAnswer: { "@type": "Answer", text: texteBrut(q.reponse) },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="max-w-[95%] mx-auto px-6 lg:px-10 pt-10 md:pt-14">
          <nav aria-label="Fil d'Ariane" className="text-xs font-space-grotesk text-gray-400">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-gray-900 transition-colors">
                  Accueil
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/blog" className="hover:text-gray-900 transition-colors">
                  Blog
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-gray-600">
                {article.rubrique}
              </li>
            </ol>
          </nav>

          <div className="mt-10 max-w-4xl">
            <p className="text-orange-500 text-xs tracking-[0.3em] uppercase font-space-grotesk font-medium">
              +&nbsp;&nbsp;{article.rubrique}
            </p>
            <h1 className="mt-4 text-5xl md:text-6xl lg:text-7xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.9]">
              {article.titre}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-500 leading-relaxed font-space-grotesk max-w-3xl">
              {article.extrait}
            </p>

            <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 font-space-grotesk">
              <span>
                Par{" "}
                <Link href="/about" className="text-gray-900 font-medium hover:text-orange-500 transition-colors">
                  l&apos;atelier MonBaril
                </Link>
              </span>
              <span aria-hidden className="w-1 h-1 rounded-full bg-gray-300" />
              <span>
                Publié le{" "}
                <time dateTime={article.publieLe}>{formaterDate(article.publieLe)}</time>
              </span>
              {article.misAJourLe && (
                <>
                  <span aria-hidden className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>
                    Mis à jour le{" "}
                    <time dateTime={article.misAJourLe}>
                      {formaterDate(article.misAJourLe)}
                    </time>
                  </span>
                </>
              )}
              <span aria-hidden className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{tempsDeLecture(article)} min de lecture</span>
            </p>
          </div>

          <div className="relative mt-10 aspect-[4/3] md:aspect-[21/9] rounded-2xl overflow-hidden bg-[#f5f0ea]">
            <Image
              src={article.image.src}
              alt={article.image.alt}
              fill
              priority
              sizes="95vw"
              className="object-cover"
            />
          </div>
        </header>

        <div className="max-w-[95%] mx-auto px-6 lg:px-10 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)] gap-12 xl:gap-20">
          {/* Sommaire : colonne collante sur desktop, repliable en tête
              d'article sur mobile. Les deux pointent sur les mêmes ancres. */}
          <aside className="hidden lg:block">
            <nav aria-label="Sommaire" className="sticky top-28">
              <p className="text-xs tracking-[0.2em] uppercase font-space-grotesk font-semibold text-gray-900">
                Sommaire
              </p>
              <ol className="mt-5 space-y-3 border-l border-gray-200">
                {titres.map((titre) => (
                  <li key={titre.id}>
                    <a
                      href={`#${titre.id}`}
                      className="block -ml-px pl-4 border-l border-transparent text-sm leading-snug text-gray-500 font-space-grotesk hover:text-orange-500 hover:border-orange-500 transition-colors"
                    >
                      {titre.texte}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="max-w-3xl">
            <details className="lg:hidden mb-10 rounded-2xl border border-gray-200 group">
              <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-xs tracking-[0.2em] uppercase font-space-grotesk font-semibold text-gray-900">
                Sommaire
                <span aria-hidden className="text-orange-500 text-2xl leading-none transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <ol className="px-6 pb-5 space-y-3">
                {titres.map((titre) => (
                  <li key={titre.id}>
                    <a
                      href={`#${titre.id}`}
                      className="text-sm text-gray-600 font-space-grotesk hover:text-orange-500"
                    >
                      {titre.texte}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            <ArticleBody blocs={article.corps} />

            {article.faq.length > 0 && (
              <section aria-labelledby="questions-frequentes" className="mt-20">
                <h2
                  id="questions-frequentes"
                  className="text-4xl md:text-5xl font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.92]"
                >
                  Questions fréquentes
                </h2>
                {/* <details> plutôt qu'un accordéon piloté en JS : les réponses
                    sont dans le HTML servi, lisibles par les moteurs. */}
                <div className="mt-8 space-y-3">
                  {article.faq.map((q, i) => (
                    <details
                      key={q.question}
                      open={i === 0}
                      className="group bg-[#f5f0ea] rounded-2xl overflow-hidden"
                    >
                      <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <h3 className="text-gray-900 font-space-grotesk font-medium text-base">
                          {q.question}
                        </h3>
                        <span
                          aria-hidden
                          className="shrink-0 text-orange-500 text-2xl leading-none transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="px-6 pb-5 text-gray-600 font-space-grotesk font-normal leading-relaxed">
                        <Inline texte={q.reponse} />
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-16 border-t border-gray-200 pt-8 flex flex-col sm:flex-row sm:items-center gap-5">
              <span className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bebas-neue text-2xl shrink-0">
                M
              </span>
              <p className="text-sm text-gray-500 leading-relaxed font-space-grotesk">
                <span className="block text-gray-900 font-semibold">
                  Écrit à l&apos;atelier
                </span>
                MonBaril décape et thermolaque des fûts 200&nbsp;L dans son
                atelier de Longvic (21), près de Dijon.{" "}
                <Link href="/about" className="underline underline-offset-4 hover:text-gray-900">
                  Découvrir l&apos;atelier
                </Link>
              </p>
            </div>
          </div>
        </div>
      </article>

      {lies.length > 0 && (
        <section className="w-full bg-white pb-4">
          <div className="max-w-[95%] mx-auto px-6 lg:px-10">
            <div className="border-t border-gray-200 pt-16 mb-12 flex items-end justify-between gap-6">
              <h2 className="text-4xl md:text-5xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.9]">
                À lire aussi
              </h2>
              <Link
                href="/blog"
                className="shrink-0 text-sm font-space-grotesk text-gray-900 underline underline-offset-4 hover:text-orange-500 transition-colors"
              >
                Tous les articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              {lies.map((lie) => (
                <ArticleCard key={lie.slug} article={lie} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactSection />
      <Footer />
    </div>
  );
}
