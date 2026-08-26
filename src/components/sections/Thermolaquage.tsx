import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

/**
 * L'argument qui justifie l'écart de prix face aux barils décoratifs
 * peints classiquement.
 *
 * La comparaison porte sur deux PROCÉDÉS, jamais sur des concurrents nommés :
 * comparer des méthodes est factuel et vérifiable, désigner une entreprise
 * relèverait du dénigrement. Aucune durée de vie n'est avancée non plus tant
 * que la fiche technique de la poudre n'est pas au dossier — le reste du site
 * a déjà été purgé de ce genre d'affirmation invérifiable.
 */

const AEROSOL = [
  "Appliquée au pistolet ou à la bombe, puis séchée à l'air",
  "Film mince, sensible aux chocs et aux rayures",
  "S'écaille sur les arêtes et les cerclages, là où le métal travaille",
  "Se ternit ou se dissout au contact des produits ménagers",
  "Coulures et surépaisseurs difficiles à éviter",
];

const THERMOLAQUAGE = [
  "Poudre déposée par charge électrostatique, puis cuite au four",
  "Couche épaisse et continue, liée au métal sur toute la surface",
  "Couvre les arêtes et les nervures aussi bien que les aplats",
  "Se nettoie à l'éponge sans altérer la finition",
  "Teinte uniforme, sans coulure ni reprise",
  "Sans solvant",
];

function Mark({ good }: { good: boolean }) {
  return (
    <span
      aria-hidden
      className={`mt-1.5 shrink-0 ${
        good
          ? "w-4 h-4 rounded-full bg-orange-500"
          : "w-4 h-px bg-gray-300 mt-3"
      }`}
    />
  );
}

export default function Thermolaquage() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        <Reveal className="mb-12 max-w-2xl">
          <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk font-medium">
            +&nbsp;&nbsp;LA DIFFÉRENCE
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.9]">
            Thermolaqué,
            <br />
            pas peint.
          </h2>
          <p className="mt-5 text-gray-500 text-base leading-relaxed font-space-grotesk">
            Un baril décoratif se peint généralement au pistolet. Le nôtre passe
            au four. Ce n&apos;est pas la même finition, et ça ne se voit pas
            seulement le premier jour.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Le procédé courant — volontairement en retrait */}
          <Reveal>
            <div className="h-full rounded-2xl border border-gray-200 p-8">
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 font-space-grotesk font-medium">
                Le procédé courant
              </p>
              <h3 className="mt-3 text-2xl md:text-3xl font-bold font-bebas-neue uppercase tracking-wide text-gray-400">
                Peinture aérosol
              </h3>
              <ul className="mt-6 space-y-4">
                {AEROSOL.map((line) => (
                  <li key={line} className="flex gap-3">
                    <Mark good={false} />
                    <span className="text-sm text-gray-500 leading-relaxed font-space-grotesk">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Le nôtre */}
          <Reveal delay={100}>
            <div className="h-full rounded-2xl border-2 border-orange-500 p-8 shadow-xl shadow-orange-500/5">
              <p className="text-xs tracking-[0.2em] uppercase text-orange-500 font-space-grotesk font-medium">
                Notre procédé
              </p>
              <h3 className="mt-3 text-2xl md:text-3xl font-bold font-bebas-neue uppercase tracking-wide text-gray-900">
                Thermolaquage au four
              </h3>
              <ul className="mt-6 space-y-4">
                {THERMOLAQUAGE.map((line) => (
                  <li key={line} className="flex gap-3">
                    <Mark good />
                    <span className="text-sm text-gray-700 leading-relaxed font-space-grotesk">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Ancrage de crédibilité : où le procédé est employé ailleurs.
            Formulé en affirmations — la version précédente ouvrait sur « n'a
            rien d'artisanal », ce que le pied de page revendique par ailleurs,
            et concluait que le baril, lui, reste au salon : l'argument de
            résistance se retournait alors contre lui-même. */}
        <Reveal delay={200}>
          <div className="mt-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <p className="text-gray-500 text-base leading-relaxed font-space-grotesk max-w-2xl">
              Jantes automobiles, mobilier urbain, menuiseries en aluminium : le
              thermolaquage est le procédé retenu quand une finition doit tenir
              des années sans faiblir.{" "}
              <span className="text-gray-900 font-medium">
                Même poudre, même passage au four, pour une pièce qui vivra chez
                vous.
              </span>
            </p>

            <Link
              href="/products/baril-monochrome"
              className="shrink-0 inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold font-space-grotesk py-4 px-8 rounded-xl transition-colors"
            >
              Choisir ma finition →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
