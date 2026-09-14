import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase/config";
import { ARTICLES, derniereModification } from "@/lib/blog/articles";

const baseUrl = "https://www.monbaril.fr";

export const revalidate = 3600; // régénère le sitemap toutes les heures

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/pro`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    // /login et /signup n'y figurent pas volontairement : un formulaire derrière
    // lequel il n'y a rien à lire finit en « explorée, actuellement non indexée »
    // et dilue le budget d'exploration sans jamais rapporter une visite.
  ];

  // La date réelle de l'article, pas celle du build : un lastmod qui change à
  // chaque déploiement sans que le texte bouge finit ignoré par Google.
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: ARTICLES[0] ? new Date(derniereModification(ARTICLES[0])) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...ARTICLES.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(derniereModification(article)),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase
      .from("categories")
      .select("slug, created_at")
      .eq("is_active", true),
    supabase
      .from("products")
      .select("slug, created_at")
      .eq("is_active", true),
  ]);

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: c.created_at ? new Date(c.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.created_at ? new Date(p.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...categoryPages, ...productPages];
}
