/**
 * Comptes officiels — source unique.
 *
 * Ces URL alimentent à la fois les liens visibles du footer et le `sameAs` du
 * JSON-LD. Les deux doivent rester identiques : Google se sert des liens
 * réellement présents sur la page pour confirmer ce que le balisage déclare, et
 * un `sameAs` que rien ne corrobore ne vaut pas grand-chose.
 */
export const SOCIAL_LINKS = [
  { name: "Instagram", url: "https://www.instagram.com/monbaril.fr/" },
  { name: "Pinterest", url: "https://www.pinterest.com/monbaril/" },
] as const;

export const SOCIAL_PROFILE_URLS = SOCIAL_LINKS.map((link) => link.url);
