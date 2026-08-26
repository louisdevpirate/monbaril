import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase/config";
import Reveal from "@/components/ui/Reveal";

/**
 * Dernier appel à l'achat, posé juste après les avis.
 *
 * Sans lui, le dernier lien vers le produit se trouvait au tiers de la page :
 * un visiteur qui lisait tout devait remonter pour commander. Le bloc contact
 * qui suit reste un recours pour ceux qui hésitent encore, pas une conversion.
 */
async function getFeatured() {
  const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
  const { data } = await supabase
    .from("products")
    .select("slug, price")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export default async function FinalCta() {
  const product = await getFeatured();
  if (!product) return null;

  return (
    <section className="w-full bg-white pt-4 pb-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="border-t border-gray-200 pt-12 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.9]">
              Composez le vôtre
            </h2>
            <p className="mt-4 text-gray-500 text-base leading-relaxed font-space-grotesk max-w-md">
              213 teintes RAL, trois finitions, thermolaqué à la commande dans
              notre atelier.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
              <span className="text-3xl font-bold text-gray-900 font-bebas-neue tracking-wide whitespace-nowrap">
                {(product.price / 100).toFixed(2).replace(".", ",")} €
              </span>
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold font-space-grotesk py-4 px-8 rounded-xl transition-colors"
              >
                Composer mon baril →
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
