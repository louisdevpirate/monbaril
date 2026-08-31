import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase/config";

/**
 * Sans titre propre, les pages collection héritent de celui du site : autant
 * d'URL distinctes affichées sous un seul et même libellé dans les résultats de
 * recherche. Le titre et la description sortent des champs déjà saisis en base
 * — l'admin édite la collection, le référencement suit.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const alternates = { canonical: `/categories/${slug}` };

  const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
  const { data: category } = await supabase
    .from("categories")
    .select("title, description, image")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!category) {
    return { title: "Collection introuvable", alternates };
  }

  // La description saisie en admin est écrite pour la page, pas pour Google :
  // elle reste la meilleure source, avec un repli qui nomme quand même l'objet.
  const description =
    category.description ??
    `${category.title} — fûts métalliques 200 L décapés et thermolaqués en France par MonBaril.`;

  return {
    title: category.title,
    description,
    alternates,
    openGraph: {
      title: `${category.title} | MonBaril™`,
      description,
      url: `/categories/${slug}`,
      ...(category.image ? { images: [{ url: category.image, alt: category.title }] } : {}),
    },
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
