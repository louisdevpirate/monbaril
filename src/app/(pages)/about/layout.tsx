import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos de MonBaril™ - Notre histoire et nos valeurs',
  description: 'Découvrez l\'histoire de MonBaril™, nos valeurs de qualité et durabilité, et notre engagement envers l\'excellence dans le stockage.',
  keywords: 'MonBaril, histoire, valeurs, qualité, durabilité, stockage, équipe',
  openGraph: {
    title: 'À propos de MonBaril™ - Notre histoire et nos valeurs',
    description: 'Découvrez l\'histoire de MonBaril™, nos valeurs de qualité et durabilité.',
    images: ['/images/header.webp'],
    url: 'https://monbaril.fr/about',
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
