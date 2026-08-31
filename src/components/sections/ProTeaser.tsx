import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/icons";

/**
 * Passerelle vers la voie pro, posée en bas des pages de catalogue.
 * Le professionnel qui furète dans les collections ne voit sinon qu'un prix
 * unitaire et un panier : rien ne lui signale qu'il existe un devis et un
 * dégressif. Le bandeau reprend le bleu de plan de /pro pour que le lien vers
 * l'autre voie se lise avant même d'être lu.
 */
export default function ProTeaser() {
  return (
    <section className="bp-blue bp-grid">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10 py-14">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <span className="font-mono text-[11px] tracking-[0.25em] text-orange-500">
              PROFESSIONNELS
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mt-4 mb-3">
              Vous équipez un lieu&nbsp;?
            </h2>
            <p className="text-blue-100/70 max-w-xl">
              Teinte RAL de votre charte, logo marqué, tarif dégressif dès
              5&nbsp;unités. Concessions, bars, showrooms, salons&nbsp;: devis
              sous 48&nbsp;h ouvrées.
            </p>
          </div>

          <Link
            href="/pro"
            className="group shrink-0 inline-flex items-center gap-3 bg-orange-500 text-white px-8 py-4 text-sm font-space-grotesk hover:bg-orange-600 transition-colors"
          >
            Découvrir l&apos;offre pro
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
