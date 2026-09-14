/**
 * Le corps d'un article est une suite de blocs typés plutôt que du Markdown :
 * aucune bibliothèque de rendu à ajouter, un sommaire et un nombre de mots qui
 * se calculent sans analyse, et un contenu qui ne peut pas glisser de HTML.
 *
 * Deux marques en ligne sont reconnues dans les textes : **gras** et
 * [libellé](/lien).
 */
export type Bloc =
  | { type: "p"; texte: string }
  | { type: "h2"; texte: string }
  | { type: "h3"; texte: string }
  | { type: "liste"; items: string[]; ordonnee?: boolean }
  | { type: "tableau"; entetes: string[]; lignes: string[][] }
  | {
      type: "encadre";
      titre: string;
      texte: string;
      lien?: { libelle: string; href: string };
    };

export interface QuestionReponse {
  question: string;
  reponse: string;
}

export interface Article {
  slug: string;
  /** Titre affiché en h1. */
  titre: string;
  /** Balise <title>, sans la marque que le gabarit ajoute : 55 caractères au plus. */
  titreSeo: string;
  /** Meta description : 160 caractères au plus, sinon Google la tronque. */
  description: string;
  /** Chapô, repris sur les cartes. */
  extrait: string;
  rubrique: string;
  /** AAAA-MM-JJ */
  publieLe: string;
  misAJourLe?: string;
  image: { src: string; alt: string };
  motsCles: string[];
  corps: Bloc[];
  /**
   * Affichées en fin d'article ET balisées en FAQPage : Google n'accepte le
   * balisage que s'il reprend un contenu réellement visible sur la page.
   */
  faq: QuestionReponse[];
}
