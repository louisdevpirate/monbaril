import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Bebas_Neue } from "next/font/google";
import ClientProviders from "@/components/layout/ClientProviders";
import { SOCIAL_PROFILE_URLS } from "@/lib/social";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const SITE_URL = "https://www.monbaril.fr";

// Chrome Origin Trial — WebMCP (expire le 17 nov. 2026)
const WEBMCP_ORIGIN_TRIAL_TOKEN =
  "AjGCJyKy0h59j8qyUM7WQybivHlWVWLQ5nybFwNr0fvIgbm4gSfSeDJ3+eapP8hPhSs2KAAhpL7fGQGmBZxDVwsAAABPeyJvcmlnaW4iOiJodHRwczovL3d3dy5tb25iYXJpbC5mcjo0NDMiLCJmZWF0dXJlIjoiV2ViTUNQIiwiZXhwaXJ5IjoxNzk0ODczNjAwfQ==";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MonBaril™ — Barils d'exception, design upcyclé",
    template: "%s | MonBaril™",
  },
  description:
    "MonBaril™ transforme des fûts métalliques 200L en pièces de design uniques. Racing, vintage, sur mesure : décapés et thermolaqués en France.",
  keywords: [
    "baril design",
    "baril décoration",
    "baril upcyclé",
    "baril industriel",
    "MonBaril",
    "déco vintage",
    "déco industrielle",
    "mobilier baril",
    "baril racing",
    "baril sur mesure",
  ],
  authors: [{ name: "MonBaril" }],
  creator: "MonBaril",
  publisher: "MonBaril",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "MonBaril™",
    title: "MonBaril™ — Barils d'exception, design upcyclé",
    description:
      "Des fûts métalliques 200L métamorphosés en pièces de caractère. Bruts, vivants, uniques. Fabriqués en France.",
    images: [
      {
        url: "/images/hero-salon.png",
        width: 3466,
        height: 2437,
        alt: "MonBaril — Baril thermolaqué orange dans un salon vintage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MonBaril™ — Barils d'exception, design upcyclé",
    description:
      "Des barils industriels métamorphosés en pièces de caractère. Bruts, vivants, uniques.",
    images: ["/images/hero-salon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  /**
   * Vérification de propriété. Google Search Console et Bing Webmaster Tools
   * fournissent chacun un jeton à coller dans les variables d'environnement —
   * la balise disparaît d'elle-même tant qu'ils ne sont pas renseignés.
   */
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  category: "shopping",
};

export const viewport: Viewport = {
  themeColor: "#e85d04",
  width: "device-width",
  initialScale: 1,
};

/**
 * Adresse unique : le siège social et l'atelier sont au même endroit. Elle DOIT
 * rester identique partout — mentions légales, page confidentialité, balisage,
 * fiche Google, fiche Bing : Google recoupe le balisage avec le contenu visible
 * de la page, et deux adresses divergentes valent mieux qu'aucune des deux,
 * c'est-à-dire rien.
 *
 * Comme le public y est reçu (retrait sur rendez-vous), elle est portée à la
 * fois par l'Organization — obligation légale — et par le LocalBusiness, où
 * elle est ce qui rend un référencement local possible.
 */
const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "330 rue de la Via Agrippa",
  postalCode: "21600",
  addressLocality: "Longvic",
  addressRegion: "Bourgogne-Franche-Comté",
  addressCountry: "FR",
};

const CONTACT_EMAIL = "contact@monbaril.fr";
const CONTACT_PHONE = "+33 7 70 59 36 04";

/**
 * Un seul graphe pour deux entités distinctes : la marque (Organization) et le
 * lieu où l'on peut venir chercher son baril (LocalBusiness). Les `@id` les
 * relient sans que Google ne les confonde — c'est ce lien qui permet à l'atelier
 * de remonter dans les recherches locales et sur Maps tout en héritant de la
 * marque.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "MonBaril",
      legalName: "MonBaril™",
      // Le domaine sert de nom alternatif : c'est le seul libellé qui ne peut
      // pas être confondu avec une autre enseigne. On n'y met surtout PAS la
      // graphie « Mon Baril » en deux mots, qui est le nom d'un concurrent —
      // la revendiquer reviendrait à demander à être fusionné avec lui.
      alternateName: "monbaril.fr",
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      slogan: "Faites le plein de style",
      foundingDate: "2024",
      description:
        "MonBaril™ transforme des fûts métalliques industriels en pièces de design uniques, décapées et thermolaquées en France.",
      /**
       * Champ prévu par schema.org exactement pour ce cas : plusieurs enseignes
       * françaises portent un nom proche et vendent, elles aussi, des fûts 200 L
       * décorés. Un moteur qui lit « MonBaril » doit pouvoir trancher.
       *
       * Trois éléments vérifiables sont posés ici, et un seul de plus qu'ailleurs
       * ne servirait à rien : le SIRET (recoupable auprès de l'INSEE), la commune
       * du siège (identique aux mentions légales et à la page confidentialité),
       * et le procédé — thermolaquage au four, par opposition à l'impression
       * d'autocollants sur laquelle travaillent les enseignes voisines. C'est ce
       * dernier point qui distingue réellement l'entité, pas le nom.
       */
      disambiguatingDescription:
        "MonBaril™ (monbaril.fr) est l'entreprise immatriculée sous le SIRET 95336154000016, dont le siège et l'atelier sont au 330 rue de la Via Agrippa, 21600 Longvic, en Côte-d'Or. À ne pas confondre avec d'autres enseignes françaises au nom proche qui vendent également des fûts 200 L décorés : MonBaril™ décape, traite et thermolaque chaque fût au four dans son propre atelier, dans une teinte RAL au choix — il ne s'agit ni de peinture appliquée à froid, ni d'impression d'autocollants.",
      knowsAbout: [
        "Thermolaquage",
        "Peinture poudre électrostatique",
        "Upcycling de fûts métalliques 200 L",
        "Mobilier et décoration de style industriel",
        "Nuancier RAL",
      ],
      address: POSTAL_ADDRESS,
      identifier: {
        "@type": "PropertyValue",
        propertyID: "SIRET",
        value: "95336154000016",
      },
      sameAs: SOCIAL_PROFILE_URLS,
    },
    {
      // FurnitureStore hérite de LocalBusiness : le type précis est ce que
      // Google attend pour un commerce, le générique ne déclenche rien.
      "@type": "FurnitureStore",
      "@id": `${SITE_URL}/#atelier`,
      name: "MonBaril",
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      url: SITE_URL,
      address: POSTAL_ADDRESS,
      image: `${SITE_URL}/images/hero-salon.png`,
      description:
        "Atelier de décapage et de thermolaquage de fûts 200 L à Longvic (21), en périphérie de Dijon. Fabrication à la commande, retrait sur rendez-vous.",
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      // Aucune adresse postale, une zone de service à la place : c'est ainsi que
      // la fiche Google Business Profile est déclarée, et les deux doivent dire
      // la même chose.
      //
      // Longvic est la commune du siège comme de l'atelier : une seule
      // adresse à faire converger, ce qui est la situation la plus lisible pour
      // un moteur. Dijon reste déclarée en zone servie parce que c'est le repère
      // que les gens cherchent ; la France couvre l'expédition.
      areaServed: [
        { "@type": "City", name: "Longvic", postalCode: "21600", addressCountry: "FR" },
        { "@type": "City", name: "Dijon", postalCode: "21000", addressCountry: "FR" },
        { "@type": "Country", name: "France" },
      ],
      currenciesAccepted: "EUR",
      paymentAccepted: "Carte bancaire",
      priceRange: "400 € - 500 €",
      sameAs: SOCIAL_PROFILE_URLS,
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${bebasNeue.variable}`}>
      <head>
        <meta httpEquiv="origin-trial" content={WEBMCP_ORIGIN_TRIAL_TOKEN} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-space-grotesk">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
