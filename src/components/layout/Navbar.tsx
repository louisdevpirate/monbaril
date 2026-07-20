"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase/supabaseClient";
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const closeMobile = () => setIsMobileOpen(false);

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
      closeMobile();
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMobileOpen) closeMobile();
        if (isUserDropdownOpen) setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileOpen, isUserDropdownOpen]);

  useEffect(() => {
    return () => {
      if (userDropdownTimeout) clearTimeout(userDropdownTimeout);
    };
  }, [userDropdownTimeout]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-[95%] mx-auto px-4 lg:px-10 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-base lg:text-xl font-bold tracking-tight text-gray-900 uppercase font-space-grotesk shrink-0"
          >
            MonBaril
            <span className="text-orange-500 text-[10px] lg:text-xs align-super font-bold">
              TM
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            <Link href="/" className="text-sm text-gray-700 hover:text-orange-500 font-space-grotesk">
              Accueil
            </Link>
            <Link href="/categories" className="text-sm text-gray-700 hover:text-orange-500 font-space-grotesk">
              Collections
            </Link>
            <Link href="/about" className="text-sm text-gray-700 hover:text-orange-500 font-space-grotesk">
              À propos
            </Link>
            <Link href="/faq" className="text-sm text-gray-700 hover:text-orange-500 font-space-grotesk">
              FAQ
            </Link>
            <Link href="/contact" className="text-sm text-gray-700 hover:text-orange-500 font-space-grotesk">
              Contact
            </Link>
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-4">
            <form className="relative w-56" role="search">
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
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:bg-white focus:border-gray-300 font-space-grotesk"
              />
            </form>

            {!loading && user && (
              <Link href="/favorites" aria-label="Favoris" className="text-gray-700 hover:text-orange-500">
                <HeartIcon className="w-5 h-5" />
              </Link>
            )}

            <Link href="/cart" aria-label="Panier" className="text-gray-700 hover:text-orange-500">
              <CartIcon className="w-5 h-5" itemCount={totalItems} />
            </Link>

            {!loading && user ? (
              <div
                className="relative"
                onMouseEnter={handleUserDropdownEnter}
                onMouseLeave={handleUserDropdownLeave}
              >
                <button className="text-gray-700 hover:text-orange-500" title="Menu utilisateur">
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
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-black font-space-grotesk"
                >
                  Connexion
                </Link>
                <Link
                  href="/signup"
                  className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 font-space-grotesk"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile : cart + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/cart" aria-label="Panier" className="p-2 text-gray-700">
              <CartIcon className="w-5 h-5" itemCount={totalItems} />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Ouvrir le menu"
              className="p-2 -mr-2 text-gray-900"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
            <Link
              href="/"
              onClick={closeMobile}
              className="text-base font-bold tracking-tight text-gray-900 uppercase font-space-grotesk"
            >
              MonBaril
              <span className="text-orange-500 text-[10px] align-super font-bold">TM</span>
            </Link>
            <button
              type="button"
              onClick={closeMobile}
              aria-label="Fermer le menu"
              className="p-2 -mr-2 text-gray-900"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="px-6 pt-6">
            <form className="relative" role="search">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Rechercher un produit"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-3 text-sm focus:outline-none focus:bg-white focus:border-gray-300 font-space-grotesk"
              />
            </form>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col px-6 py-4 gap-1">
            {[
              { href: "/", label: "Accueil" },
              { href: "/categories", label: "Collections" },
              { href: "/about", label: "À propos" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className="flex items-center justify-between py-4 border-b border-gray-100 text-2xl font-bold uppercase tracking-tight text-gray-900 font-bebas-neue"
              >
                <span>{link.label}</span>
                <span className="text-gray-400 text-xl">→</span>
              </Link>
            ))}
          </nav>

          {/* Auth bottom */}
          <div className="mt-auto px-6 pb-8 pt-4">
            {!loading && user ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={closeMobile}
                  className="block bg-gray-100 rounded-lg px-4 py-3 text-sm font-semibold text-gray-900 text-center font-space-grotesk"
                >
                  Mon profil
                </Link>
                <Link
                  href="/orders"
                  onClick={closeMobile}
                  className="block bg-gray-100 rounded-lg px-4 py-3 text-sm font-semibold text-gray-900 text-center font-space-grotesk"
                >
                  Mes commandes
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 text-sm font-semibold text-center font-space-grotesk"
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={closeMobile}
                  className="block w-full text-center border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-900 font-space-grotesk"
                >
                  Connexion
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMobile}
                  className="block w-full text-center bg-gray-900 text-white rounded-lg px-4 py-3 text-sm font-semibold font-space-grotesk"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
