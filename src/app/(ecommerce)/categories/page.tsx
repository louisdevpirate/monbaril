import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supabaseConfig } from "@/lib/supabase/config";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/ui/Reveal";

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
                <Link
                  href={`/categories/${category.slug}`}
                  className="group relative block aspect-[16/10] rounded-2xl overflow-hidden bg-gray-200"
                >
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={`Collection ${category.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Flèche au survol */}
                  <span className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>

                  <div className="absolute bottom-0 inset-x-0 p-6">
                    {count > 0 && (
                      <span className="text-orange-400 text-xs font-semibold tracking-wider uppercase font-space-grotesk">
                        {count} modèle{count > 1 ? "s" : ""}
                      </span>
                    )}
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-bebas-neue uppercase tracking-wide mt-1">
                      {category.title}
                    </h2>
                    {category.description && (
                      <p className="text-white/80 text-sm font-space-grotesk mt-1 line-clamp-2 max-w-md">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            );
          })}

          {/* Tuile Sur mesure */}
          <Reveal delay={categories.length * 80}>
            <Link
              href="/customizer"
              className="group relative block aspect-[16/10] rounded-2xl overflow-hidden bg-orange-500"
            >
              <Image
                src="/images/star.svg"
                alt=""
                width={65}
                height={65}
                className="absolute top-6 left-6"
              />
              <div className="absolute bottom-0 inset-x-0 p-6">
                <span className="text-white/70 text-xs font-semibold tracking-wider uppercase font-space-grotesk">
                  Couleur RAL, texture, finition
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white font-bebas-neue uppercase tracking-wide mt-1">
                  Sur mesure
                </h2>
                <p className="text-white/80 text-sm font-space-grotesk mt-1 group-hover:text-white transition-colors">
                  Votre baril, vos règles. →
                </p>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>

      <Footer />
    </div>
  );
}
