"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { InstagramIcon, PinterestIcon } from "@/components/icons/icons";
import { SOCIAL_LINKS } from "@/lib/social";

const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  Pinterest: PinterestIcon,
} as const;

const LIENS = [
  { href: "/", label: "Accueil" },
  { href: "/categories", label: "Collections" },
  { href: "/about", label: "À propos" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/**
 * Bouton burger qui devient une croix. C'est le même élément dans les deux
 * états — un seul bouton qui se déforme, plutôt que deux qui se remplacent —
 * et il reste au-dessus du panneau pour pouvoir le refermer.
 */
export function BurgerButton({
  open,
  onClick,
  sombre = false,
}: {
  open: boolean;
  onClick: () => void;
  sombre?: boolean;
}) {
  const trait = {
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={open}
      className={`p-2 -mr-2 hover:text-orange-500 transition-colors ${
        sombre ? "text-white" : "text-gray-900"
      }`}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <motion.line
          x1="4"
          x2="20"
          animate={open ? { y1: 12, y2: 12, rotate: 45 } : { y1: 7, y2: 7, rotate: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ originX: "12px", originY: "12px" }}
          {...trait}
        />
        <motion.line
          x1="4"
          y1="12"
          x2="20"
          y2="12"
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          {...trait}
        />
        <motion.line
          x1="4"
          x2="20"
          animate={open ? { y1: 12, y2: 12, rotate: -45 } : { y1: 17, y2: 17, rotate: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ originX: "12px", originY: "12px" }}
          {...trait}
        />
      </svg>
    </button>
  );
}

export default function SideMenu({
  open,
  onClose,
  connecte,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  connecte: boolean;
  onLogout: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="voile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-gray-900/40"
            aria-hidden
          />

          {/* Le panneau glisse sous la barre d'en-tête, elle-même blanche : les
              deux surfaces n'en forment qu'une, et le burger reste cliquable. */}
          <motion.aside
            key="panneau"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 z-40 h-full w-full sm:w-[420px] bg-white border-l border-gray-100 flex flex-col"
          >
            <nav className="flex-1 overflow-y-auto flex flex-col justify-center px-8 sm:px-12 pt-24 pb-8">
              {LIENS.map((lien, i) => (
                <motion.div
                  key={lien.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.35 }}
                >
                  <Link
                    href={lien.href}
                    onClick={onClose}
                    className="block text-right text-4xl sm:text-5xl font-bebas-neue tracking-tight text-gray-900 hover:text-orange-500 transition-colors py-2"
                  >
                    {lien.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="px-8 sm:px-12 pb-10 space-y-6"
            >
              <div className="flex justify-end gap-4 text-sm text-gray-500 font-space-grotesk">
                {connecte ? (
                  <>
                    <Link href="/profile" onClick={onClose} className="hover:text-gray-900">
                      Mon profil
                    </Link>
                    <Link href="/orders" onClick={onClose} className="hover:text-gray-900">
                      Mes commandes
                    </Link>
                    <button
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="hover:text-gray-900"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={onClose} className="hover:text-gray-900">
                      Connexion
                    </Link>
                    <Link href="/signup" onClick={onClose} className="hover:text-gray-900">
                      S&apos;inscrire
                    </Link>
                  </>
                )}
              </div>

              {/* La voie pro sort de la liste : elle ne s'adresse pas au même
                  visiteur que « FAQ » ou « À propos ». */}
              <div className="border-t border-gray-200 pt-6">
                <Link
                  href="/pro"
                  onClick={onClose}
                  className="group block bp-blue bp-grid p-6 text-right"
                >
                  <span className="font-mono text-[10px] tracking-[0.25em] text-orange-500">
                    PROFESSIONNELS
                  </span>
                  <span className="block text-3xl font-bebas-neue text-white mt-2 group-hover:text-orange-500 transition-colors">
                    Votre logo, vos couleurs
                  </span>
                  <span className="block text-xs text-blue-100/60 mt-2 font-space-grotesk">
                    Dégressif dès 5 unités · Devis sous 48 h
                  </span>
                </Link>

                <Link
                  href="/pro#devis"
                  onClick={onClose}
                  className="block w-full bg-orange-500 text-white text-center py-4 text-sm font-space-grotesk hover:bg-orange-600 transition-colors mt-3"
                >
                  Demander un devis
                </Link>
              </div>

              <div className="flex items-center justify-end gap-3">
                {SOCIAL_LINKS.map(({ name, url }) => {
                  const Icon = SOCIAL_ICONS[name];
                  return (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label={`MonBaril sur ${name}`}
                      className="inline-flex h-10 w-10 items-center justify-center border border-gray-200 text-gray-500 transition-colors hover:border-orange-500 hover:text-orange-500"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
