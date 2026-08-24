"use client";

import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_MEASUREMENT_ID, initGtag, pageview } from "@/lib/analytics/gtag";

/**
 * Compteur de vues de page.
 *
 * `config` est posé avec `send_page_view: false` : sur un routeur client, la
 * vue initiale de gtag.js serait la seule jamais comptée. On les émet donc
 * toutes ici, à chaque changement d'URL.
 */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Une URL n'est comptée qu'une fois : re-rendus et double montage du mode
  // strict ne doivent pas gonfler les vues.
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    if (lastSent.current === url) return;
    lastSent.current = url;
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Charge gtag.js. Monté uniquement lorsque le visiteur a accepté la mesure
 * (voir `AnalyticsProvider`) : avant cela, aucune requête ne part vers Google
 * et aucun cookie n'est déposé.
 */
export default function GoogleAnalytics() {
  // Amorçage avant tout : le <Script> ci-dessous ne fait que lancer un
  // téléchargement, qui s'exécutera après cet effet. Le dataLayer est donc
  // toujours en ordre — consentement, config, puis les évènements en attente.
  useEffect(() => {
    initGtag();
  }, []);

  return (
    <>
      <Script
        id="ga-lib"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      {/* useSearchParams force le rendu client de l'arbre parent hors Suspense. */}
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  );
}
