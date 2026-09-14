import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/icons";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/ui/Reveal";
import {
  ARTICLES,
  derniereModification,
  numero,
  tempsDeLecture,
} from "@/lib/blog/articles";
import { formaterDate, horodatage } from "@/lib/blog/texte";
import { RAL_CLASSIC } from "@/lib/ral";

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

// Le nuancier entier en une bande : la signature de la marque, reprise de la
// mise en avant produit, sert ici de filet sous le titre.
const RAL_GRADIENT = `linear-gradient(to right, ${RAL_CLASSIC.map((c) => c.hex).join(",")})`;

const SUJETS = [
  "Thermolaquage",
  "Nuancier RAL",
  "Fût 200 litres",
  "Déco industrielle",
  "Mat · brillant · grainé",
  "Fait à Longvic",
  "Professionnels",
];

/** Lettres évidées : le contour prend la couleur du texte. */
const EVIDE = {
  WebkitTextStroke: "2px currentColor",
  WebkitTextFillColor: "transparent",
} as const;

function Etoile({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1500 1500" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M750 1500C750 1087.3 412.7 750 0 750 412.7 750 750 412.7 750 0c0 412.7 337.3 750 750 750-412.7 0-750 337.3-750 750Z"
      />
    </svg>
  );
}

const deuxChiffres = (n: number) => String(n).padStart(2, "0");

export default function BlogPage() {
  const [aLaUne, ...autres] = ARTICLES;
  const minutesDeLecture = ARTICLES.reduce((total, a) => total + tempsDeLecture(a), 0);
  const rubriques = new Set(ARTICLES.map((a) => a.rubrique)).size;

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
    // La bande inclinée déborde volontairement des deux côtés de l'écran.
    <div className="min-h-screen bg-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ───── En-tête ───── */}
      <section className="max-w-[95%] mx-auto px-6 lg:px-10 pt-6 md:pt-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-full border border-gray-200 py-1.5 pl-1.5 pr-5 text-sm font-space-grotesk text-gray-900 hover:border-gray-900 transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white transition-all duration-300 group-hover:bg-orange-500 group-hover:-translate-x-0.5">
              <ArrowRightIcon className="h-4 w-4 rotate-180" />
            </span>
            Retour à l&apos;accueil
          </Link>

          {aLaUne && (
            <p className="hidden sm:block font-mono text-[11px] tracking-[0.2em] uppercase text-gray-400">
              N°&nbsp;{deuxChiffres(numero(aLaUne))} — {formaterDate(aLaUne.publieLe).replace(/^\d+ /, "")}
            </p>
          )}
        </div>

        {/* Pas de <Reveal> ici : le h1 est au-dessus de la ligne de flottaison,
            et Reveal le rend à opacité nulle tant que le JavaScript n'a pas
            chargé — le premier affichage serait un bloc vide. */}
        <div
          className="relative mt-6 overflow-hidden bg-[#141414] text-white"
          style={{ borderRadius: "48px 48px 48px 10px" }}
        >
          <Etoile className="absolute top-8 right-8 md:top-12 md:right-14 w-10 md:w-14 text-orange-500" />

          <div className="relative px-7 md:px-14 lg:px-20 pt-14 md:pt-20 pb-12 md:pb-16">
            <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk font-medium">
              +&nbsp;&nbsp;LE BLOG MONBARIL
            </p>

            <h1 className="mt-6 font-bebas-neue uppercase tracking-tight leading-[0.8] text-[16vw] md:text-[14vw] xl:text-[12vw] 2xl:text-[15rem]">
              <span className="block">Journal</span>
              <span className="block text-orange-500 md:text-right" style={EVIDE}>
                d&apos;atelier
              </span>
            </h1>

            <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-end">
              <p className="text-lg md:text-xl text-white/70 leading-relaxed font-space-grotesk max-w-xl">
                Thermolaquage, couleurs RAL, fûts 200&nbsp;L, décoration
                industrielle : ce que nous apprenons à l&apos;atelier, écrit
                pour vous aider à choisir en connaissance de cause.
              </p>

              <dl className="grid grid-cols-3 border-t border-white/15 pt-6">
                {[
                  { valeur: deuxChiffres(ARTICLES.length), libelle: "Articles" },
                  { valeur: String(minutesDeLecture), libelle: "Minutes" },
                  { valeur: deuxChiffres(rubriques), libelle: "Rubriques" },
                ].map((stat) => (
                  <div key={stat.libelle} className="flex flex-col-reverse">
                    <dt className="mt-2 font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-white/40">
                      {stat.libelle}
                    </dt>
                    <dd className="font-bebas-neue text-5xl md:text-6xl leading-none text-white">
                      {stat.valeur}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div aria-hidden className="relative h-3 md:h-4" style={{ background: RAL_GRADIENT }} />
        </div>
      </section>

      {/* ───── Bande défilante ───── */}
      <div aria-hidden className="relative mt-16 md:mt-20 -mx-8 -rotate-[1.5deg] bg-orange-500 py-4 md:py-5 overflow-hidden">
        <div className="flex w-max anim-defilement">
          {[0, 1].map((copie) => (
            <ul key={copie} className="flex shrink-0 items-center">
              {[...SUJETS, ...SUJETS].map((sujet, i) => (
                <li
                  key={`${copie}-${i}`}
                  className="flex items-center gap-8 pr-8 font-bebas-neue text-3xl md:text-5xl uppercase leading-none text-white whitespace-nowrap"
                >
                  {sujet}
                  <Etoile className="w-5 md:w-7 text-[#141414]" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ───── À la une ───── */}
      {aLaUne && (
        <section className="max-w-[95%] mx-auto px-6 lg:px-10 pt-20 md:pt-28">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-6">
              <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk font-medium">
                +&nbsp;&nbsp;À LA UNE
              </p>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-gray-400">
                N°&nbsp;{deuxChiffres(numero(aLaUne))}
              </p>
            </div>

            <Link
              href={`/blog/${aLaUne.slug}`}
              className="group relative flex min-h-[560px] lg:min-h-[640px] items-end overflow-hidden rounded-[28px] bg-[#141414]"
            >
              <Image
                src={aLaUne.image.src}
                alt={aLaUne.image.alt}
                fill
                priority
                sizes="95vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />

              <span className="absolute top-6 left-6 md:top-8 md:left-8 rounded-full bg-orange-500 px-4 py-2 text-xs tracking-[0.2em] uppercase text-white font-space-grotesk font-medium">
                {aLaUne.rubrique}
              </span>

              <div className="relative w-full p-6 md:p-12 lg:p-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                <div className="max-w-4xl">
                  <h2 className="font-bebas-neue uppercase tracking-tight text-white leading-[0.88] text-5xl md:text-6xl xl:text-7xl">
                    {aLaUne.titre}
                  </h2>
                  <p className="mt-5 hidden md:block max-w-2xl text-lg leading-relaxed text-white/75 font-space-grotesk">
                    {aLaUne.extrait}
                  </p>
                  <p className="mt-6 font-mono text-[11px] tracking-[0.2em] uppercase text-white/60">
                    <time dateTime={aLaUne.publieLe}>{formaterDate(aLaUne.publieLe)}</time>
                    {" · "}
                    {tempsDeLecture(aLaUne)} min de lecture
                  </p>
                </div>

                <span className="flex h-20 w-20 md:h-28 md:w-28 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-45">
                  <ArrowRightIcon className="h-7 w-7 md:h-9 md:w-9" />
                  <span className="sr-only">Lire l&apos;article</span>
                </span>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {/* ───── Sommaire ───── */}
      {autres.length > 0 && (
        <section className="max-w-[95%] mx-auto px-6 lg:px-10 py-24 md:py-32">
          <Reveal className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk font-medium">
                +&nbsp;&nbsp;TOUS LES ARTICLES
              </p>
              <h2 className="mt-4 font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.88] text-6xl md:text-8xl">
                Le sommaire
              </h2>
            </div>
            <p className="max-w-sm text-gray-500 font-space-grotesk leading-relaxed">
              Du plus récent au plus ancien. Chaque numéro répond à une
              question précise, du four à votre salon.
            </p>
          </Reveal>

          <ol className="border-t-2 border-gray-900">
            {autres.map((article, i) => (
              <li key={article.slug} className="border-b border-gray-200">
                <Reveal delay={i * 60}>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="group relative grid grid-cols-[auto_minmax(0,1fr)] md:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 md:gap-10 py-8 md:py-10"
                  >
                    <span
                      aria-hidden
                      className="w-16 md:w-32 font-bebas-neue text-6xl md:text-8xl leading-none text-gray-900 transition-colors duration-300 group-hover:text-orange-500"
                      style={EVIDE}
                    >
                      {deuxChiffres(numero(article))}
                    </span>

                    <div className="md:max-w-xl">
                      <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase">
                        <span className="text-orange-500">{article.rubrique}</span>
                        <span className="text-gray-400">
                          <time dateTime={article.publieLe}>{formaterDate(article.publieLe)}</time>
                          {" · "}
                          {tempsDeLecture(article)} min
                        </span>
                      </p>
                      <h3 className="mt-3 font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.92] text-3xl md:text-5xl transition-colors duration-300 group-hover:text-orange-500">
                        {article.titre}
                      </h3>
                      <p className="mt-3 hidden sm:block text-gray-500 font-space-grotesk leading-relaxed line-clamp-2">
                        {article.extrait}
                      </p>
                    </div>

                    <span className="hidden md:flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 text-gray-900 transition-all duration-300 group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white group-hover:-rotate-45">
                      <ArrowRightIcon className="h-5 w-5" />
                    </span>

                    {/* Aperçu au survol, seulement là où il reste de la place à
                        droite du texte : en dessous de xl, il masquerait le titre. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-28 top-1/2 z-10 hidden xl:block aspect-[4/3] w-64 -translate-y-1/2 -rotate-6 scale-90 overflow-hidden rounded-xl opacity-0 shadow-2xl transition duration-300 group-hover:rotate-3 group-hover:scale-100 group-hover:opacity-100"
                    >
                      <Image src={article.image.src} alt="" fill sizes="256px" className="object-cover" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      )}

      <ContactSection />
      <Footer />
    </div>
  );
}
