# Mesure d'audience & référencement — mise en service

Le code est en place. Il reste trois choses à faire une seule fois, côté Google,
puis à reporter dans les variables d'environnement (local **et** Vercel).

---

## 1. Google Analytics 4

1. [analytics.google.com](https://analytics.google.com) → créer une propriété
   « MonBaril » (fuseau **France**, devise **EUR**).
2. Créer un **flux de données Web** sur `https://www.monbaril.fr`.
3. Copier l'**ID de mesure** (`G-XXXXXXXXXX`).
4. Le poser dans `.env.local` puis dans Vercel :

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

> Tant que cette variable est vide, **aucun script Google n'est chargé et le
> bandeau cookies ne s'affiche pas**. C'est le comportement voulu en local.

### Ce qui est mesuré automatiquement

| Évènement GA4      | Déclencheur                                              |
| ------------------ | -------------------------------------------------------- |
| `page_view`        | Chaque changement d'URL, navigations client comprises     |
| `view_item`        | Ouverture d'une fiche produit                             |
| `add_to_cart`      | Ajout au panier et incrément de quantité                  |
| `remove_from_cart` | Retrait du panier et décrément de quantité                |
| `begin_checkout`   | Départ vers Stripe (panier, fiche produit, best-sellers)  |
| `purchase`         | Page de confirmation, dédupliquée par numéro de commande  |

Montants en **euros**, devise `EUR`. Les barils configurés remontent sous
l'identifiant du produit en base, la teinte RAL et la finition dans
`item_variant` — sinon chaque coloris deviendrait un produit distinct.

### Vérifier que ça remonte

GA4 → **Administration → DebugView**, ou **Rapports → Temps réel**. Compter
quelques minutes après le premier accord de consentement.

---

## 2. Google Search Console

1. [search.google.com/search-console](https://search.google.com/search-console)
   → ajouter une propriété de type **Préfixe d'URL** : `https://www.monbaril.fr`.
2. Choisir la validation par **balise HTML**. Google donne :
   `<meta name="google-site-verification" content="AbC123..." />`
3. Ne reporter que la valeur du `content` :

```
GOOGLE_SITE_VERIFICATION=AbC123...
```

4. Déployer, **puis** cliquer sur « Valider » dans Search Console.
5. Une fois validé : **Sitemaps → ajouter** `sitemap.xml`.

Le sitemap est généré dynamiquement depuis Supabase (`src/app/sitemap.ts`) et
régénéré toutes les heures : les nouveaux produits y entrent tout seuls.

### Bing (optionnel)

Même principe sur [Bing Webmaster Tools](https://www.bing.com/webmasters), qui
sait aussi importer la propriété depuis Search Console :

```
BING_SITE_VERIFICATION=...
```

---

## 3. Consentement (RGPD / CNIL)

- Rien ne part avant le clic : gtag.js n'est **chargé** qu'après acceptation.
- « Refuser » coûte un clic, comme « Accepter ».
- Le choix est mémorisé dans `localStorage` (`monbaril:consent:v1`).
- Le lien **« Gérer les cookies »** du footer rouvre le bandeau à tout moment.
- Consent Mode v2 est signalé à Google dans les deux sens.

Pour redemander le consentement à tout le monde (changement de finalité,
nouvel outil), incrémenter la clé dans `src/lib/analytics/gtag.ts` :
`monbaril:consent:v1` → `v2`.

---

## Où se trouve quoi

| Fichier                                          | Rôle                                            |
| ------------------------------------------------ | ----------------------------------------------- |
| `src/lib/analytics/gtag.ts`                       | Helpers, file d'attente, consentement, évènements |
| `src/components/analytics/AnalyticsProvider.tsx`  | Décide du consentement, monte GA le cas échéant |
| `src/components/analytics/GoogleAnalytics.tsx`    | Chargement de gtag.js + vues de page            |
| `src/components/analytics/CookieBanner.tsx`       | Le bandeau                                      |
| `src/app/layout.tsx`                              | Balises de vérification, métadonnées, JSON-LD   |
| `src/middleware.ts`                               | CSP — autorise les domaines Google              |
| `src/app/sitemap.ts` / `src/app/robots.ts`        | Sitemap dynamique et robots.txt                 |

---

## Déjà en place côté SEO

Métadonnées Open Graph et Twitter, canoniques, `robots.txt`, sitemap dynamique,
JSON-LD `Organization` (accueil), `Product` (fiches) et `FAQPage` (FAQ).

Restent à faire, hors code :

- Renseigner `sameAs` dans le JSON-LD de `src/app/layout.tsx` dès que les
  comptes réseaux sociaux existent.
- Créer une fiche **Google Business Profile** pour l'atelier de Dijon, puis
  ajouter un JSON-LD `LocalBusiness` — c'est ce qui fait apparaître l'atelier
  sur Maps et dans les recherches locales.
