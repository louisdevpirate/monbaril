"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Marque */}
          <div className="md:col-span-2">
            <Link href="/" className="text-3xl font-semibold text-gray-900">
              MonBaril<span className="text-orange-500">™</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 font-space-grotesk max-w-xs leading-relaxed">
              Barils industriels transformés en mobilier d&apos;exception.<br />
              Atelier artisanal, pièces uniques.
            </p>
          </div>

          {/* Boutique */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-900 mb-5 font-space-grotesk">
              Boutique
            </h3>
            <ul className="space-y-3 text-sm text-gray-500 font-space-grotesk">
              <li>
                <Link href="/categories" className="hover:text-gray-900 transition-colors">
                  Toutes les catégories
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gray-900 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* À propos */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-900 mb-5 font-space-grotesk">
              À propos
            </h3>
            <ul className="space-y-3 text-sm text-gray-500 font-space-grotesk">
              <li>
                <Link href="/about" className="hover:text-gray-900 transition-colors">
                  Notre histoire
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gray-900 transition-colors">
                  Nos valeurs
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-gray-900 transition-colors">
                  Carrières
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-900 mb-5 font-space-grotesk">
              Légal
            </h3>
            <ul className="space-y-3 text-sm text-gray-500 font-space-grotesk">
              <li>
                <Link href="/terms" className="hover:text-gray-900 transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-900 transition-colors">
                  Confidentialité & Cookies
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="hover:text-gray-900 transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Barre légale */}
      <div className="border-t border-gray-200">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row md:justify-between items-center gap-4 text-sm text-gray-400 font-space-grotesk">
          <p>© {new Date().getFullYear()} MonBaril™. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/terms" className="hover:text-gray-700 transition-colors">CGV</Link>
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">Politique de confidentialité</Link>
            <Link href="/mentions-legales" className="hover:text-gray-700 transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
