/**
 * Google Analytics 4 — couche d'accès unique.
 *
 * Le site ne charge gtag.js qu'après un consentement explicite (RGPD/CNIL).
 * D'ici là, les évènements émis par les composants sont mis en attente : une
 * vue produit se déclenche au montage de la page, souvent avant que la
 * bibliothèque ne soit prête, et la perdre fausserait tout l'entonnoir. La file
 * est vidée à l'initialisation, ou jetée si le visiteur refuse.
 *
 * Convention de prix : partout dans l'app les montants manipulés côté panier
 * et commande sont en EUROS (le passage centimes → euros se fait à la lecture
 * du produit). Les helpers e-commerce attendent donc des euros.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** La mesure n'est possible que si un ID de flux est configuré. */
export const isAnalyticsConfigured = () => GA_MEASUREMENT_ID.length > 0;

export const CURRENCY = "EUR";

// ─────────────────────────────────────────────────────────────────────────────
// Consentement
// ─────────────────────────────────────────────────────────────────────────────

export type ConsentChoice = "granted" | "denied";

/** Clé localStorage. Versionnée : bumper le suffixe redemande le consentement. */
export const CONSENT_STORAGE_KEY = "monbaril:consent:v1";

export function readStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    // Navigation privée verrouillée, quotas, etc. : on retombe sur « pas de choix ».
    return null;
  }
}

export function storeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    /* le choix ne survivra pas à la session, sans conséquence fonctionnelle */
  }
}

/**
 * Consent Mode v2. Volontairement direct plutôt que mis en file : un signal de
 * consentement n'a de sens que pour une bibliothèque déjà chargée — sinon
 * l'état posé à l'initialisation fait foi.
 */
export function updateConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;
  window.gtag?.("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * File d'attente pré-initialisation. Passe à `null` une fois gtag.js amorcé ;
 * la borne évite qu'un visiteur qui ne consentira jamais n'accumule des
 * évènements à l'infini.
 */
const MAX_PENDING_EVENTS = 50;
let pending: unknown[][] | null = [];

/** Émet vers gtag.js, ou met en attente tant qu'il n'est pas amorcé. */
export function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (pending) {
    if (pending.length < MAX_PENDING_EVENTS) pending.push(args);
    return;
  }
  window.gtag?.(...args);
}

/** Refus : ce qui a été mis en attente ne doit jamais partir. */
export function discardPendingEvents() {
  if (pending) pending = [];
}

/**
 * Amorce le dataLayer, l'état de consentement et le flux GA4, puis rejoue les
 * évènements en attente. Idempotent — le second appel ne fait rien.
 *
 * Fait en JS plutôt que par un snippet inline : c'est le seul moyen de garantir
 * que `config` précède les évènements rejoués, quel que soit l'ordre réel de
 * chargement du script distant.
 */
export function initGtag() {
  if (typeof window === "undefined" || !isAnalyticsConfigured()) return;
  if (!pending) return;

  window.dataLayer = window.dataLayer || [];
  const dataLayer = window.dataLayer;
  // gtag.js lit l'objet `arguments` tel quel : c'est le contrat du snippet officiel.
  window.gtag = function gtagShim() {
    dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
  // Ce composant n'est monté qu'après accord ; l'état par défaut ci-dessus
  // n'existe que pour respecter la séquence attendue par Consent Mode.
  window.gtag("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    // Les vues sont émises par le routeur : voir `pageview`.
    send_page_view: false,
    anonymize_ip: true,
    // 13 mois, la durée recommandée par la CNIL pour un cookie de mesure —
    // et celle annoncée dans la politique de confidentialité. Sans ce
    // réglage, GA4 pose `_ga` pour deux ans et la page dirait faux.
    cookie_expires: 34128000,
  });

  const queued = pending;
  pending = null;
  queued.forEach((args) => window.gtag?.(...args));
}

/**
 * Vue de page. Le `config` initial est posé avec `send_page_view: false` :
 * c'est ce helper, branché sur le routeur, qui compte les vues — y compris les
 * navigations client qui ne rechargent jamais la page.
 */
export function pageview(path: string) {
  if (!isAnalyticsConfigured()) return;
  gtag("event", "page_view", {
    page_path: path,
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
    page_title: typeof document !== "undefined" ? document.title : undefined,
  });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (!isAnalyticsConfigured()) return;
  gtag("event", name, params);
}

// ─────────────────────────────────────────────────────────────────────────────
// E-commerce (schéma GA4 « items »)
// ─────────────────────────────────────────────────────────────────────────────

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  /** Prix unitaire en euros. */
  price: number;
  quantity?: number;
  /** Configuration choisie, ex. « RAL 3020 · Brillant ». */
  item_variant?: string;
  item_category?: string;
  /** Rang dans la liste affichée, à partir de 0. */
  index?: number;
};

/**
 * Liste dans laquelle un produit est présenté. GA4 rattache `view_item_list`,
 * `select_item` et la fiche produit par cet identifiant : c'est lui qui permet
 * de dire quelle vitrine amène réellement des clics, et non seulement des vues.
 */
export type ItemList = {
  /** Identifiant stable, en snake_case — ne pas le renommer à la légère. */
  id: string;
  /** Libellé lisible dans les rapports. */
  name: string;
};

const totalOf = (items: AnalyticsItem[]) =>
  Number(
    items
      .reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0)
      .toFixed(2)
  );

/** Une vitrine de produits vient d'être affichée. */
export function trackViewItemList(list: ItemList, items: AnalyticsItem[]) {
  if (items.length === 0) return;
  trackEvent("view_item_list", {
    item_list_id: list.id,
    item_list_name: list.name,
    items: items.map((item, i) => ({
      ...item,
      index: item.index ?? i,
      item_list_id: list.id,
      item_list_name: list.name,
    })),
  });
}

/** Un produit a été cliqué dans une vitrine. */
export function trackSelectItem(
  list: ItemList,
  item: AnalyticsItem,
  index: number
) {
  trackEvent("select_item", {
    item_list_id: list.id,
    item_list_name: list.name,
    items: [{ ...item, index, item_list_id: list.id, item_list_name: list.name }],
  });
}

export function trackViewItem(item: AnalyticsItem) {
  trackEvent("view_item", {
    currency: CURRENCY,
    value: item.price,
    items: [item],
  });
}

export function trackAddToCart(item: AnalyticsItem) {
  trackEvent("add_to_cart", {
    currency: CURRENCY,
    value: totalOf([item]),
    items: [item],
  });
}

export function trackRemoveFromCart(item: AnalyticsItem) {
  trackEvent("remove_from_cart", {
    currency: CURRENCY,
    value: totalOf([item]),
    items: [item],
  });
}

export function trackViewCart(items: AnalyticsItem[]) {
  trackEvent("view_cart", {
    currency: CURRENCY,
    value: totalOf(items),
    items,
  });
}

export function trackBeginCheckout(items: AnalyticsItem[]) {
  trackEvent("begin_checkout", {
    currency: CURRENCY,
    value: totalOf(items),
    items,
  });
}

export function trackPurchase(params: {
  transactionId: string;
  value: number;
  items: AnalyticsItem[];
  shipping?: number;
}) {
  trackEvent("purchase", {
    transaction_id: params.transactionId,
    currency: CURRENCY,
    value: params.value,
    shipping: params.shipping,
    items: params.items,
  });
}
