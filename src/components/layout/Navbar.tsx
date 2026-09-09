"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase/supabaseClient";
import SideMenu, { BurgerButton } from "@/components/layout/SideMenu";
import {
  CartIcon,
  HeartIcon,
  LogOutIcon,
  UserIcon,
} from "@/components/icons/icons";

export default function Navbar() {
  const { cart, clearCart } = useCart();
  const { user, loading } = useUser();
  const router = useRouter();
  // Sur la voie pro, la barre passe au bleu de plan : le visiteur voit dans
  // quelle voie il se trouve, et le logo le ramène à la boutique en un clic.
  const chemin = usePathname() ?? "";
  // « /products/baril-monochrome » commence lui aussi par « /pro » : sans le
  // slash, la page produit héritait de l'habillage professionnel.
  const surPro = chemin === "/pro" || chemin.startsWith("/pro/");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTimeout, setMenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userDropdownTimeout, setUserDropdownTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [userAvatar, setUserAvatar] = useState<string>("1.png");
  const [userProfile, setUserProfile] = useState<{ username: string; role: string } | null>(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("avatar_url, username, role")
            .eq("id", user.id)
            .single();
          if (profile) {
            if (profile.avatar_url) setUserAvatar(profile.avatar_url);
            if (profile.username) {
              setUserProfile({
                username: profile.username,
                role: profile.role || "user",
              });
            }
          }
        } catch (error) {
          console.error("Erreur récupération profil:", error);
        }
      }
    };
    fetchUserProfile();
  }, [user]);

  // Lock body scroll when menu open
  useEffect(() => {
    // Sur desktop le panneau s'ouvre au survol : bloquer le défilement y
    // punirait un simple passage de souris. Le verrou reste au plein écran.
    if (isMenuOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  /**
   * Le survol n'ouvre le menu que là où il veut dire quelque chose : un
   * pointeur fin, capable de survoler, sur un écran large. Sur tactile,
   * « hover » se déclenche au premier appui et ouvrirait le panneau à
   * contretemps — le clic y reste seul maître.
   */
  const peutSurvoler = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)")
      .matches;

  const survolEntre = () => {
    if (!peutSurvoler()) return;
    if (menuTimeout) {
      clearTimeout(menuTimeout);
      setMenuTimeout(null);
    }
    setIsMenuOpen(true);
  };

  const survolSort = () => {
    if (!peutSurvoler()) return;
    setMenuTimeout(setTimeout(() => setIsMenuOpen(false), 260));
  };

  const handleUserDropdownEnter = () => {
    if (userDropdownTimeout) {
      clearTimeout(userDropdownTimeout);
      setUserDropdownTimeout(null);
    }
    setIsUserDropdownOpen(true);
  };

  const handleUserDropdownLeave = () => {
    const timeout = setTimeout(() => setIsUserDropdownOpen(false), 150);
    setUserDropdownTimeout(timeout);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearCart();
      closeMenu();
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMenuOpen) closeMenu();
        if (isUserDropdownOpen) setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen, isUserDropdownOpen]);

  useEffect(() => {
    return () => {
      if (userDropdownTimeout) clearTimeout(userDropdownTimeout);
    };
  }, [userDropdownTimeout]);

  useEffect(() => {
    return () => {
      if (menuTimeout) clearTimeout(menuTimeout);
    };
  }, [menuTimeout]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors ${
          surPro
            ? "bg-[#0a1a3c] border-white/10"
            : "bg-white border-gray-100"
        }`}
      >
        <div className="max-w-[95%] mx-auto px-4 lg:px-10 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className={`text-base lg:text-xl font-semibold tracking-tight font-space-grotesk shrink-0 flex items-center gap-3 ${
              surPro ? "text-white" : "text-gray-900"
            }`}
          >
            <span>
              MonBaril
              <span className="text-orange-500 text-[10px] lg:text-xs align-super font-bold">
                TM
              </span>
            </span>
            {surPro && (
              <span className="font-mono text-[10px] tracking-[0.2em] text-orange-500 border border-orange-500 px-2 py-0.5">
                PRO
              </span>
            )}
          </Link>

          {/* Les rubriques vivent désormais dans le panneau latéral : la barre
              ne garde que ce qui sert à acheter — chercher, ses favoris, son
              panier, son compte. */}
          <div className="flex items-center gap-3 lg:gap-4">
            <form className="relative w-56 hidden lg:block" role="search">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Rechercher un produit"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className={`w-full rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none font-space-grotesk border ${
                  surPro
                    ? "bg-white/5 border-white/15 text-white placeholder:text-blue-100/40 focus:border-orange-500"
                    : "bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-300"
                }`}
              />
            </form>

            {!loading && user && (
              <Link
                href="/favorites"
                aria-label="Favoris"
                className={`hidden lg:block hover:text-orange-500 ${
                  surPro ? "text-blue-100/80" : "text-gray-700"
                }`}
              >
                <HeartIcon className="w-5 h-5" />
              </Link>
            )}

            <Link
              href="/cart"
              aria-label="Panier"
              className={`hover:text-orange-500 ${
                surPro ? "text-blue-100/80" : "text-gray-700"
              }`}
            >
              <CartIcon className="w-5 h-5" itemCount={totalItems} />
            </Link>

            {!loading && user && (
              <div
                className="relative hidden lg:block"
                onMouseEnter={handleUserDropdownEnter}
                onMouseLeave={handleUserDropdownLeave}
              >
                <button
                  className={`hover:text-orange-500 ${
                    surPro ? "text-blue-100/80" : "text-gray-700"
                  }`}
                  title="Menu utilisateur"
                >
                  <UserIcon className="w-5 h-5" />
                </button>
                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    onMouseEnter={handleUserDropdownEnter}
                    onMouseLeave={handleUserDropdownLeave}
                  >
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-100 text-center">
                        <div className="flex justify-center mb-2">
                          <img
                            src={`/images/avatar/${userAvatar}`}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full object-cover border border-gray-500"
                          />
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {userProfile?.username || user.email?.split("@")[0]}
                        </p>
                      </div>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Mon Profil
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Mes commandes
                      </Link>
                      {userProfile?.role === "admin" && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOutIcon className="w-4 h-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Link
              href="/pro"
              className={`hidden lg:inline-block font-mono text-[11px] tracking-[0.2em] border px-3 py-1.5 transition-colors ${
                surPro
                  ? "border-orange-500 text-orange-500"
                  : "border-gray-300 text-gray-900 hover:border-orange-500 hover:text-orange-500"
              }`}
            >
              PRO
            </Link>

            <span onMouseEnter={survolEntre} onMouseLeave={survolSort}>
              <BurgerButton
                open={isMenuOpen}
                onClick={() => setIsMenuOpen((v) => !v)}
                sombre={surPro}
              />
            </span>
          </div>
        </div>
      </header>

      <SideMenu
        open={isMenuOpen}
        onClose={closeMenu}
        onMouseEnter={survolEntre}
        onMouseLeave={survolSort}
        connecte={!loading && !!user}
        onLogout={handleLogout}
      />
    </>
  );
}
