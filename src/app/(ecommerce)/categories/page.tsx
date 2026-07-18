import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { supabaseConfig } from "@/lib/supabase/config";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/ui/Reveal";
import CollectionTile, { TileEffect } from "@/components/collections/CollectionTile";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Racing, vintage, sur mesure : découvrez les collections de barils MonBaril. Fûts métalliques 200L upcyclés et thermolaqués en France.",
  alternates: { canonical: "/categories" },
};

interface Category {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
}

async function getCollections() {
  const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, title, slug, description, image")
      .eq("is_active", true),
    supabase.from("products").select("categoryid").eq("is_active", true),
  ]);

  const counts = new Map<string, number>();
  for (const p of products ?? []) {
    counts.set(p.categoryid, (counts.get(p.categoryid) ?? 0) + 1);
  }

  return { categories: (categories ?? []) as Category[], counts };
}

// Effet de survol thématique selon la collection
function effectFor(slug: string): TileEffect {
  if (slug.includes("racing")) return "racing";
  if (slug.includes("vintage")) return "vintage";
  return "default";
}

// Vidéo de survol optionnelle : déposer un mp4 muet en boucle dans
// public/videos/collections/<slug>.mp4 et il sera utilisé automatiquement.
function hoverVideoFor(slug: string): string | undefined {
  const file = path.join(process.cwd(), "public", "videos", "collections", `${slug}.mp4`);
  return fs.existsSync(file) ? `/videos/collections/${slug}.mp4` : undefined;
}

export default async function CollectionsPage() {
  const { categories, counts } = await getCollections();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 max-w-[95%] w-full mx-auto px-6 lg:px-10 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk font-medium">
            +&nbsp;&nbsp;LES UNIVERS MONBARIL
          </p>
          <h1 className="mt-4 text-6xl md:text-7xl lg:text-8xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.9]">
            Collections
          </h1>
          <p className="mt-4 text-gray-500 font-space-grotesk max-w-md">
            Chaque collection raconte une histoire. Choisissez la vôtre —
            ou composez-la sur mesure.
          </p>
        </div>

        {/* Grille de collections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, i) => {
            const count = counts.get(category.id) ?? 0;
            return (
              <Reveal key={category.id} delay={i * 80}>
                <CollectionTile
                  href={`/categories/${category.slug}`}
                  title={category.title}
                  badge={count > 0 ? `${count} modèle${count > 1 ? "s" : ""}` : undefined}
                  description={category.description ?? undefined}
                  image={category.image}
                  effect={effectFor(category.slug)}
                  videoSrc={hoverVideoFor(category.slug)}
                />
              </Reveal>
            );
          })}

          {/* Tuile Sur mesure */}
          <Reveal delay={categories.length * 80}>
            <CollectionTile
              href="/contact"
              title="Sur mesure"
              badge="Couleur RAL, texture, finition"
              description="Votre baril, vos règles. →"
              effect="custom"
              orange
              starIcon
            />
          </Reveal>
        </div>
      </div>

      <Footer />
    </div>
  );
}
