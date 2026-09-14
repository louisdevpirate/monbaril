import { Fragment } from "react";
import Link from "next/link";
import type { Bloc } from "@/lib/blog/types";
import { slugifier } from "@/lib/blog/texte";

const MARQUES = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;
const LIEN = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

/** Rend **gras** et [libellé](/lien) ; tout le reste reste du texte. */
export function Inline({ texte }: { texte: string }) {
  return (
    <>
      {texte.split(MARQUES).map((morceau, i) => {
        if (morceau.startsWith("**") && morceau.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-gray-900">
              {morceau.slice(2, -2)}
            </strong>
          );
        }
        const lien = morceau.match(LIEN);
        if (lien) {
          const [, libelle, href] = lien;
          return (
            <Link
              key={i}
              href={href}
              className="text-gray-900 underline decoration-orange-500 decoration-2 underline-offset-4 hover:text-orange-500 transition-colors"
            >
              {libelle}
            </Link>
          );
        }
        return <Fragment key={i}>{morceau}</Fragment>;
      })}
    </>
  );
}

// Corps de texte en 400 : le 100 hérité du body, rabattu sur le 300 chargé,
// se lit bien sur trois lignes, pas sur mille mots.
const TEXTE = "text-[17px] md:text-lg leading-[1.8] text-gray-600 font-normal font-space-grotesk";

function RenduBloc({ bloc }: { bloc: Bloc }) {
  switch (bloc.type) {
    case "p":
      return (
        <p className={`mt-6 ${TEXTE}`}>
          <Inline texte={bloc.texte} />
        </p>
      );

    case "h2":
      return (
        <h2
          id={slugifier(bloc.texte)}
          className="mt-16 scroll-mt-24 text-4xl md:text-5xl font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.92]"
        >
          {bloc.texte}
        </h2>
      );

    case "h3":
      return (
        <h3 className="mt-10 text-2xl md:text-3xl font-bebas-neue uppercase tracking-wide text-gray-900 leading-none">
          {bloc.texte}
        </h3>
      );

    case "liste": {
      const Balise = bloc.ordonnee ? "ol" : "ul";
      return (
        <Balise className="mt-6 space-y-4">
          {bloc.items.map((item, i) => (
            <li key={i} className={`flex gap-4 ${TEXTE}`}>
              {bloc.ordonnee ? (
                <span
                  aria-hidden
                  className="shrink-0 w-7 font-bebas-neue text-2xl leading-[1.45] text-orange-500"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : (
                <span
                  aria-hidden
                  className="shrink-0 mt-[0.75em] w-2 h-2 rounded-full bg-orange-500"
                />
              )}
              <span>
                <Inline texte={item} />
              </span>
            </li>
          ))}
        </Balise>
      );
    }

    case "tableau":
      return (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full min-w-[560px] text-left text-sm md:text-[15px] font-space-grotesk">
            <thead className="bg-[#f5f0ea]">
              <tr>
                {bloc.entetes.map((entete) => (
                  <th
                    key={entete}
                    scope="col"
                    className="px-5 py-4 text-xs tracking-[0.15em] uppercase font-semibold text-gray-900"
                  >
                    {entete}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bloc.lignes.map((ligne, i) => (
                <tr key={i}>
                  {ligne.map((cellule, j) =>
                    j === 0 ? (
                      <th
                        key={j}
                        scope="row"
                        className="px-5 py-4 align-top font-medium text-gray-900"
                      >
                        <Inline texte={cellule} />
                      </th>
                    ) : (
                      <td
                        key={j}
                        className="px-5 py-4 align-top text-gray-600 font-normal leading-relaxed"
                      >
                        <Inline texte={cellule} />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "encadre":
      return (
        <aside className="mt-12 rounded-2xl bg-[#f5f0ea] p-8 md:p-10">
          <p className="text-orange-500 text-xs tracking-[0.3em] uppercase font-space-grotesk font-medium">
            +&nbsp;&nbsp;{bloc.titre}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-gray-700 font-normal font-space-grotesk">
            <Inline texte={bloc.texte} />
          </p>
          {bloc.lien && (
            <Link
              href={bloc.lien.href}
              className="mt-6 inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold font-space-grotesk py-4 px-8 rounded-xl transition-colors"
            >
              {bloc.lien.libelle}
            </Link>
          )}
        </aside>
      );
  }
}

export default function ArticleBody({ blocs }: { blocs: Bloc[] }) {
  return (
    <div className="[&>*:first-child]:mt-0">
      {blocs.map((bloc, i) => (
        <RenduBloc key={i} bloc={bloc} />
      ))}
    </div>
  );
}
