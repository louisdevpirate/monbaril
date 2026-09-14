/** Retire les marques en ligne (**gras**, [lien](/url)) pour ne garder que le texte. */
export function texteBrut(texte: string) {
  return texte
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1");
}

/** « Les étapes du thermolaquage » → « les-etapes-du-thermolaquage » */
export function slugifier(texte: string) {
  return texteBrut(texte)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const FORMAT_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formaterDate(jour: string) {
  return FORMAT_DATE.format(new Date(`${jour}T00:00:00Z`));
}

/**
 * Un jour seul serait lu en UTC par les moteurs, et un article publié le matin
 * à Paris pourrait passer pour daté de la veille. On fixe 8 h, heure de Paris
 * (décalage d'hiver de novembre à mars).
 */
export function horodatage(jour: string) {
  const mois = Number(jour.slice(5, 7));
  const decalage = mois >= 4 && mois <= 10 ? "+02:00" : "+01:00";
  return `${jour}T08:00:00${decalage}`;
}
