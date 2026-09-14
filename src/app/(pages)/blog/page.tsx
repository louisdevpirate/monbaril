import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArticleCard from "@/components/blog/ArticleCard";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/ui/Reveal";
import { ARTICLES, derniereModification, tempsDeLecture } from "@/lib/blog/articles";
import { formaterDate, horodatage } from "@/lib/blog/texte";

const SITE_URL = "https://www.monbaril.fr";

const DESCRIPTION =
  "Thermolaquage, couleurs RAL, fûts métalliques 200 L et décoration industrielle : les guides de l'atelier MonBaril, écrits depuis Longvic.";

export const metadata: Metadata = {
  title: "Blog : thermolaquage, RAL et déco industrielle",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: `${SITE_URL}/blog`,
    siteName: "MonBaril™",
    title: "Journal d'atelier — MonBaril™",
    description: DESCRIPTION,
    images: ["/images/header-desk.png"],
  },
};

export default function BlogPage() {
  const [aLaUne, ...autres] = ARTICLES;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/blog#blog`,
        name: "Journal d'atelier MonBaril",
        description: DESCRIPTION,
        url: `${SITE_URL}/blog`,
        inLanguage: "fr-FR",
        publisher: { "@id": `${SITE_URL}/#organization` },
        blogPost: ARTICLES.map((article) => ({
          "@type": "BlogPosting",
          "@id": `${SITE_URL}/blog/${article.slug}#article`,
          headline: article.titre,
          url: `${SITE_URL}/blog/${article.slug}`,
          datePublished: horodatage(article.publieLe),
          dateModified: horodatage(derniereModification(article)),
          image: `${SITE_URL}${article.image.src}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="max-w-[95%] mx-auto px-6 lg:px-10 pt-16 md:pt-20">
        <Reveal className="max-w-3xl">
          <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk font-medium">
            +&nbsp;&nbsp;LE BLOG
          </p>
          <h1 className="mt-4 text-6xl md:text-7xl lg:text-8xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.88]">
            Journal
            <br />
            d&apos;atelier
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-500 leading-relaxed font-space-grotesk">
            Thermolaquage, couleurs RAL, fûts 200&nbsp;L, décoration
            industrielle : ce que nous apprenons à l&apos;atelier, écrit pour
            vous aider à choisir en connaissance de cause.
          </p>
        </Reveal>
      </section>

      {aLaUne && (
        <section className="max-w-[95%] mx-auto px-6 lg:px-10 pt-14">
          <Reveal>
            <Link
              href={`/blog/${aLaUne.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden bg-[#f5f0ea]"
            >
              <div className="relative min-h-[300px] lg:min-h-[480px]">
                <Image
                  src={aLaUne.image.src}
                  alt={aLaUne.image.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="px-8 md:px-14 py-12 lg:py-16 flex flex-col justify-center">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-[0.2em] uppercase font-space-grotesk">
                  <span className="text-orange-500 font-medium">
                    Dernier article · {aLaUne.rubrique}
                  </span>
                </p>
                <h2 className="mt-5 text-4xl md:text-5xl font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.92] group-hover:text-orange-500 transition-colors">
                  {aLaUne.titre}
                </h2>
                <p className="mt-5 text-gray-600 text-base leading-relaxed font-space-grotesk">
                  {aLaUne.extrait}
                </p>
                <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-space-grotesk">
                  <span className="text-gray-500">
                    <time dateTime={aLaUne.publieLe}>
                      {formaterDate(aLaUne.publieLe)}
                    </time>
                    {" · "}
                    {tempsDeLecture(aLaUne)} min de lecture
                  </span>
                  <span className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                    Lire l&apos;article →
                  </span>
                </p>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {autres.length > 0 && (
        <section className="max-w-[95%] mx-auto px-6 lg:px-10 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
            {autres.map((article, i) => (
              <Reveal key={article.slug} delay={(i % 2) * 100}>
                <ArticleCard
                  article={article}
                  niveau="h2"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <ContactSection />
      <Footer />
    </div>
  );
}
