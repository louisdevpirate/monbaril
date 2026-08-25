import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase/config";
import { RAL_CLASSIC } from "@/lib/ral";
import {
  DropletIcon,
  LockIcon,
  ClockIcon,
  LocationIcon,
} from "@/components/icons/icons";
import Reveal from "@/components/ui/Reveal";

/**
 * Mise en avant d'un seul produit — le catalogue n'en compte qu'un.
 * Une grille de best-sellers ou un mur de collections sonnerait creux ;
 * ici toute la page pousse vers le configurateur.
 */
async function getSpotlight() {
  const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
  const { data } = await supabase
    .from("products")
    .select("id, title, slug, price, image, description")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

const ARGUMENTS = ["Brillant, mat ou grainé", "Fabriqué en France"];

// Le nuancier complet, en dégradé. Sur la fiche produit c'est un curseur ;
// ici il est seulement montré — d'où le lien vers le configurateur plutôt
// qu'un contrôle qui aurait l'air manipulable sans l'être.
const RAL_GRADIENT = `linear-gradient(to right, ${RAL_CLASSIC.map(
  (c) => c.hex
).join(",")})`;

// Réassurance posée au moment du doute — sous le bouton, là où la main
// hésite — plutôt qu'en frise de badges que personne ne lit. Les trois
// points reprennent des engagements déjà écrits dans les CGV.
const TRUST = [
  { Icon: LockIcon, label: "Paiement sécurisé" },
  { Icon: ClockIcon, label: "14 jours pour changer d'avis" },
  { Icon: LocationIcon, label: "Retrait gratuit à l'atelier" },
];

export default async function ProductSpotlight() {
  const product = await getSpotlight();
  if (!product) return null;

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Visuel */}
          <Reveal>
            <Link
              href={`/products/${product.slug}`}
              className="group relative block aspect-square rounded-2xl overflow-hidden bg-[#f5f0ea]"
            >
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          </Reveal>

          {/* Argumentaire */}
          <Reveal delay={100}>
            <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk font-medium">
              +&nbsp;&nbsp;LA PIÈCE
            </p>

            <h2 className="mt-4 text-5xl md:text-6xl lg:text-7xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.9]">
              {product.title}
            </h2>

            <p className="mt-5 text-gray-500 text-base leading-relaxed font-space-grotesk max-w-md">
              {product.description}
            </p>

            <ul className="mt-7 flex flex-wrap gap-x-3 gap-y-2 font-space-grotesk">
              {ARGUMENTS.map((arg) => (
                <li
                  key={arg}
                  className="text-sm text-gray-600 border border-gray-200 rounded-full px-4 py-1.5"
                >
                  {arg}
                </li>
              ))}
            </ul>

            {/* Le nuancier dit d'un coup d'œil que l'orange n'est qu'une
                option parmi 213 — ce qu'une pastille de texte ne fait pas. */}
            <Link
              href={`/products/${product.slug}`}
              className="group mt-8 block max-w-sm"
            >
              <span className="flex items-baseline justify-between font-space-grotesk">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <DropletIcon className="w-4 h-4 text-orange-500 shrink-0" />
                  Disponible en 213 teintes RAL
                </span>
                <span className="text-xs text-gray-400 group-hover:text-orange-500 transition-colors">
                  Voir le nuancier →
                </span>
              </span>
              <span
                aria-hidden
                className="mt-2 block h-6 w-full rounded-full border border-gray-200 transition-transform group-hover:scale-[1.02]"
                style={{ background: RAL_GRADIENT }}
              />
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
              <span className="text-3xl font-bold text-gray-900 font-bebas-neue tracking-wide whitespace-nowrap">
                {(product.price / 100).toFixed(2).replace(".", ",")} €
              </span>
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold font-space-grotesk py-4 px-8 rounded-xl transition-colors"
              >
                Choisir ma couleur →
              </Link>
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-space-grotesk">
              {TRUST.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-xs text-gray-500"
                >
                  <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
