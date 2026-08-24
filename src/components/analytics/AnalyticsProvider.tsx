"use client";

import { useCallback, useEffect, useState } from "react";
import CookieBanner from "./CookieBanner";
import GoogleAnalytics from "./GoogleAnalytics";
import {
  ConsentChoice,
  discardPendingEvents,
  isAnalyticsConfigured,
  readStoredConsent,
  storeConsent,
  updateConsent,
} from "@/lib/analytics/gtag";

/** Évènement écouté pour rouvrir le bandeau (lien « Cookies » du footer). */
export const CONSENT_REOPEN_EVENT = "monbaril:consent:reopen";

/** Permet à n'importe quel composant de rendre la main au visiteur. */
export function openConsentBanner() {
  window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT));
}

/**
 * « unknown » = localStorage pas encore lu (premier rendu, aligné sur le SSR),
 * « pending » = lu, aucun choix enregistré → bandeau.
 */
type ConsentState = "unknown" | "pending" | ConsentChoice;

/**
 * Point d'entrée unique de la mesure d'audience : décide du consentement, et
 * ne monte Google Analytics que s'il a été accordé.
 */
export default function AnalyticsProvider() {
  const [state, setState] = useState<ConsentState>("unknown");

  useEffect(() => {
    setState(readStoredConsent() ?? "pending");

    const reopen = () => setState("pending");
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
  }, []);

  const decide = useCallback((choice: ConsentChoice) => {
    storeConsent(choice);
    // Les évènements accumulés avant la décision partent, ou disparaissent.
    if (choice === "denied") discardPendingEvents();
    // Utile quand gtag.js est déjà chargé (l'internaute revient sur son choix) :
    // au premier accord, le snippet d'init porte déjà l'état accordé.
    updateConsent(choice);
    setState(choice);
  }, []);

  // Sans ID de flux configuré, aucun cookie n'est déposé : rien à demander.
  if (!isAnalyticsConfigured()) return null;

  return (
    <>
      {state === "granted" && <GoogleAnalytics />}
      {state === "pending" && (
        <CookieBanner
          onAccept={() => decide("granted")}
          onRefuse={() => decide("denied")}
        />
      )}
    </>
  );
}
