"use client";

import Link from "next/link";

/**
 * Bandeau de consentement.
 *
 * Refuser doit coûter exactement un clic, comme accepter : c'est la condition
 * posée par la CNIL, et la raison pour laquelle les deux boutons sont côte à
 * côte et de même poids visuel.
 */
export default function CookieBanner({
  onAccept,
  onRefuse,
}: {
  onAccept: () => void;
  onRefuse: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentement aux cookies de mesure d'audience"
      className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.12)] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-gray-600 font-space-grotesk">
            <span className="font-semibold text-gray-900">Cookies de mesure.</span>{" "}
            On aimerait savoir quelles pages vous intéressent, pour améliorer la
            boutique. Rien de plus, et rien sans votre accord.{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-gray-900 transition-colors"
            >
              Politique de confidentialité
            </Link>
            .
          </p>

          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={onRefuse}
              className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white transition-transform hover:bg-gray-800 active:scale-[0.98]"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
