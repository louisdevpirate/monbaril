import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Bebas_Neue } from "next/font/google";
import ClientProviders from "@/components/layout/ClientProviders";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MonBaril™ — Barils d'exception, design upcyclé",
    template: "%s | MonBaril™",
  },
  description:
    "MonBaril™ transforme des barils industriels en pièces de design uniques. Racing, vintage, sur mesure : des objets bruts, vivants, fabriqués à la main en France.",
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
      "Des barils industriels métamorphosés en pièces de caractère. Bruts, vivants, uniques. Fabriqués à la main en France.",
    images: [
      {
        url: "/images/header-desk.png",
        width: 1200,
        height: 900,
        alt: "MonBaril — Baril design dans un intérieur contemporain",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MonBaril™ — Barils d'exception, design upcyclé",
    description:
      "Des barils industriels métamorphosés en pièces de caractère. Bruts, vivants, uniques.",
    images: ["/images/header-desk.png"],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MonBaril",
  legalName: "MonBaril™",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  description:
    "MonBaril™ transforme des barils industriels en pièces de design uniques fabriquées à la main en France.",
  sameAs: [],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${bebasNeue.variable}`}>
      <head>
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
