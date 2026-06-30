"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useWebMCPTool } from "@/hooks/useWebMCPTool";

/**
 * Tools WebMCP globaux, montés sur toutes les pages (via ClientProviders).
 * Permettent à un agent IA de découvrir le catalogue et de naviguer le site
 * sans dépendre de l'état d'une page précise.
 */
export default function SiteNavigationTools() {
  const router = useRouter();

  useWebMCPTool<{ query: string; limit?: number }>({
    name: "search_products",
    description:
      "Recherche des barils MonBaril par mot-clé dans le titre ou la description. Renvoie une liste de produits avec slug, titre, prix et description.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Mot-clé de recherche" },
        limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
      },
      required: ["query"],
    },
    annotations: { readOnlyHint: true },
    execute: async ({ query, limit }) => {
      const { data, error } = await supabase
        .from("products")
        .select("title, slug, price, description")
        .eq("is_active", true)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(limit ?? 10);

      if (error) return `Erreur de recherche : ${error.message}`;
      if (!data || data.length === 0)
        return `Aucun produit trouvé pour "${query}".`;

      return JSON.stringify(
        data.map((p) => ({
          title: p.title,
          slug: p.slug,
          url: `/products/${p.slug}`,
          price_eur: p.price / 100,
          description: p.description,
        }))
      );
    },
  });

  useWebMCPTool({
    name: "list_collections",
    description:
      "Liste toutes les collections (catégories) de barils disponibles avec leur titre, slug et description.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("title, slug, description")
        .eq("is_active", true);

      if (error) return `Erreur : ${error.message}`;
      if (!data || data.length === 0) return "Aucune collection disponible.";

      return JSON.stringify(
        data.map((c) => ({
          title: c.title,
          slug: c.slug,
          url: `/categories/${c.slug}`,
          description: c.description,
        }))
      );
    },
  });

  useWebMCPTool({
    name: "list_bestsellers",
    description:
      "Liste les barils best-sellers / mis en avant, avec slug, titre et prix.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("title, slug, price, description, is_featured")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) return `Erreur : ${error.message}`;
      if (!data || data.length === 0) return "Aucun produit disponible.";

      return JSON.stringify(
        data.map((p) => ({
          title: p.title,
          slug: p.slug,
          url: `/products/${p.slug}`,
          price_eur: p.price / 100,
        }))
      );
    },
  });

  useWebMCPTool<{ path: string }>({
    name: "navigate_to",
    description:
      "Navigue vers une page du site MonBaril via un chemin relatif (ex: /categories, /products/baril-racing-gulf, /cart, /about, /contact, /faq).",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Chemin relatif commençant par /",
        },
      },
      required: ["path"],
    },
    execute: ({ path }) => {
      if (!path.startsWith("/")) {
        return "Le chemin doit commencer par /.";
      }
      router.push(path);
      return `Navigation vers ${path}.`;
    },
  });

  return null;
}
