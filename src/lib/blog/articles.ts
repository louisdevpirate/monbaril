import type { Article, Bloc } from "./types";
import { slugifier, texteBrut } from "./texte";
import thermolaquage from "./articles/thermolaquage-definition-etapes-avantages";
import futMetallique from "./articles/fut-metallique-200-litres-dimensions-poids";
import couleurRal from "./articles/choisir-couleur-ral";
import decoIndustrielle from "./articles/deco-industrielle-idees-baril-metallique";
import barilProfessionnels from "./articles/baril-personnalise-professionnels";

/**
 * Du plus récent au plus ancien.
 *
 * Un article ne renvoie dans son corps qu'à des articles publiés AVANT lui :
 * un lien vers un texte daté de plus tard trahirait une date de publication
 * arrangée. Les renvois vers les plus récents passent par « À lire aussi »,
 * calculé au rendu.
 */
export const ARTICLES: Article[] = [
  thermolaquage,
  futMetallique,
  couleurRal,
  decoIndustrielle,
  barilProfessionnels,
].sort((a, b) => b.publieLe.localeCompare(a.publieLe));

export function getArticle(slug: string) {
  return ARTICLES.find((article) => article.slug === slug);
}

export function articlesLies(slug: string, nombre = 3) {
  return ARTICLES.filter((article) => article.slug !== slug).slice(0, nombre);
}

export function derniereModification(article: Article) {
  return article.misAJourLe ?? article.publieLe;
}

export function sommaire(article: Article) {
  return article.corps
    .filter((bloc): bloc is Extract<Bloc, { type: "h2" }> => bloc.type === "h2")
    .map((bloc) => ({ id: slugifier(bloc.texte), texte: texteBrut(bloc.texte) }));
}

function textesDuBloc(bloc: Bloc): string[] {
  switch (bloc.type) {
    case "liste":
      return bloc.items;
    case "tableau":
      return [...bloc.entetes, ...bloc.lignes.flat()];
    case "encadre":
      return [bloc.titre, bloc.texte];
    default:
      return [bloc.texte];
  }
}

export function nombreDeMots(article: Article) {
  return [
    article.extrait,
    ...article.corps.flatMap(textesDuBloc),
    ...article.faq.flatMap((q) => [q.question, q.reponse]),
  ]
    .map(texteBrut)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** 230 mots par minute : la vitesse de lecture courante d'un texte en français. */
export function tempsDeLecture(article: Article) {
  return Math.max(1, Math.round(nombreDeMots(article) / 230));
}
