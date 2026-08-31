import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barils personnalisés pour professionnels",
  description:
    "Fûts 200 L thermolaqués à votre teinte RAL et marqués à votre logo. Concessions, bars, restaurants, showrooms, salons : devis sous 48 h, tarif dégressif dès 5 unités, fabrication en France.",
  keywords:
    "baril personnalisé entreprise, fût logo entreprise, mobilier industriel professionnel, PLV baril, décoration concession automobile, baril RAL sur mesure",
  alternates: { canonical: "/pro" },
  openGraph: {
    title: "Barils personnalisés pour professionnels — MonBaril™",
    description:
      "Votre logo, votre teinte RAL, à partir de 5 unités. Devis sous 48 h, fabrication en France.",
    images: ["/images/thermolaquage/rouge-design.png"],
    url: "https://www.monbaril.fr/pro",
    type: "website",
  },
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return children;
}
