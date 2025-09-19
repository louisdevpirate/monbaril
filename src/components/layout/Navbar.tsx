"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase/supabaseClient";
import {
  CartIcon,
  HeartIcon,
  LogOutIcon,
  UserIcon,
  HomeIcon,
} from "@/components/icons/icons";

export default function Navbar() {
  const { cart, clearCart } = useCart();
  const { user, loading } = useUser();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userDropdownTimeout, setUserDropdownTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [mobileSearchValue, setMobileSearchValue] = useState("");
  const [userAvatar, setUserAvatar] = useState<string>("1.png");
  const [userProfile, setUserProfile] = useState<{username: string, role: string} | null>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Récupérer l'avatar et le profil utilisateur
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
            if (profile.avatar_url) {
              setUserAvatar(profile.avatar_url);
            }
            if (profile.username) {
              setUserProfile({ 
                username: profile.username, 
                role: profile.role || 'user' 
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

  // Gestion du drawer mobile
  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen);
  };

  const closeMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  // Gestion de la recherche
  const clearSearch = () => {
    setSearchValue("");
  };

  const clearMobileSearch = () => {
    setMobileSearchValue("");
  };

  // Gestion du dropdown utilisateur avec délai
  const handleUserDropdownEnter = () => {
    if (userDropdownTimeout) {
      clearTimeout(userDropdownTimeout);
      setUserDropdownTimeout(null);
    }
    setIsUserDropdownOpen(true);
  };

  const handleUserDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setIsUserDropdownOpen(false);
    }, 150); // Délai de 150ms
    setUserDropdownTimeout(timeout);
  };

  // Gestion de la déconnexion
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearCart();
      console.log("✅ Panier vidé après déconnexion");
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion:", error);
    }
  };

  // Fermeture avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMobileDrawerOpen) {
          closeMobileDrawer();
        }
        if (searchValue) {
          clearSearch();
        }
        if (mobileSearchValue) {
          clearMobileSearch();
        }
        if (isUserDropdownOpen) {
          setIsUserDropdownOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileDrawerOpen, searchValue, mobileSearchValue, isUserDropdownOpen]);

  // Cleanup du timeout au démontage du composant
  useEffect(() => {
    return () => {
      if (userDropdownTimeout) {
        clearTimeout(userDropdownTimeout);
      }
    };
  }, [userDropdownTimeout]);

  return (
    <header className="site-header" role="banner">
      <div className="navbar-container header-inner max-w-95/100">
        {/* Bloc gauche : Logo + Nav primaire */}
        <div className="header-left">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              MonBaril<span className="text-orange-500">™</span>
            </Link>
          </div>

          <nav className="primary-nav" aria-label="Primary">
            <ul className="nav-list">
            <li className="nav-item">
                <Link className="nav-link" href="/">
                  Accueil
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/collections">
                  Collections
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/about">
                  À propos
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/contact">
                  Contact
                </Link>
              </li>{" "}
              <li className="nav-item">
                <Link className="nav-link" href="/blog">
                  Blog
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bloc droit : Recherche + Icônes */}
        <div className="header-right">
          <form className="search" role="search" aria-label="Product Search">
            <label className="visually-hidden" htmlFor="q">
              Search
            </label>
            <span className="search-icon" aria-hidden="true"></span>
            <input
              id="q"
              name="q"
              className="search-input"
              type="search"
              placeholder="Rechercher un produit"
              autoComplete="off"
              inputMode="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <button
                className="search-clear"
                type="button"
                aria-label="Clear search"
                onClick={clearSearch}
              >
                &times;
              </button>
            )}
          </form>

          <div
            className="header-icons"
            role="group"
            aria-label="Account and cart"
          >
            {!loading && user && (
              <Link className="icon-btn" href="/favorites" aria-label="Favoris">
                <HeartIcon className="w-5 h-5 hover:text-orange-500" />
              </Link>
            )}

            <Link
              className="icon-btn icon-btn--cart"
              href="/cart"
              aria-label="Panier"
            >
              <CartIcon
                className="w-5 h-5 hover:text-orange-500"
                itemCount={totalItems}
              />
            </Link>

            {!loading && user ? (
              <div
                className="relative"
                onMouseEnter={handleUserDropdownEnter}
                onMouseLeave={handleUserDropdownLeave}
              >
                <button className="icon-btn" title="Menu utilisateur">
                  <UserIcon className="w-5 h-5" />
                </button>

                {/* Dropdown utilisateur */}
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
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Mon Profil
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Mes commandes
                      </Link>
                      {userProfile?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <LogOutIcon className="w-4 h-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk"
                >
                  Connexion
                </Link>
                <Link
                  href="/signup"
                  className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors duration-200 font-space-grotesk"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: hamburger (caché en desktop) */}
          <button
            className="hamburger"
            aria-label="Open menu"
            aria-controls="mobile-drawer"
            aria-expanded={isMobileDrawerOpen}
            onClick={toggleMobileDrawer}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile drawer (nav + recherche) */}
      <div
        id="mobile-drawer"
        className="drawer"
        ref={mobileDrawerRef}
        hidden={!isMobileDrawerOpen}
      >
        <form
          className="search search--mobile"
          role="search"
          aria-label="Product Search (mobile)"
        >
          <label className="visually-hidden" htmlFor="mq">
            Search
          </label>
          <span className="search-icon" aria-hidden="true"></span>
          <input
            id="mq"
            name="q"
            className="search-input"
            type="search"
            placeholder="Search products"
            inputMode="search"
            value={mobileSearchValue}
            onChange={(e) => setMobileSearchValue(e.target.value)}
          />
          {mobileSearchValue && (
            <button
              className="search-clear"
              type="button"
              aria-label="Clear search"
              onClick={clearMobileSearch}
            >
              &times;
            </button>
          )}
        </form>
        <nav className="mobile-nav" aria-label="Primary mobile">
          <Link className="mobile-link" href="/collections">
            Collections
          </Link>
          <Link className="mobile-link" href="/about">
            À propos
          </Link>
          <Link className="mobile-link" href="/blog">
            Blog
          </Link>
          <Link className="mobile-link" href="/contact">
            Contact
          </Link>

          {/* Actions mobile */}
          <div className="mobile-actions">
            {!loading && user && (
              <Link className="mobile-link" href="/favorites">
                <HeartIcon className="w-4 h-4 mr-2" />
                Favoris
              </Link>
            )}
            <Link className="mobile-link" href="/cart">
              <CartIcon className="w-4 h-4 mr-2" itemCount={totalItems} />
              Panier{totalItems > 0 && ` (${totalItems})`}
            </Link>
          </div>

          {/* Authentification mobile */}
          {!loading && user ? (
            <div className="mobile-auth">
              <div className="text-sm text-gray-500 mb-2 font-space-grotesk">
                Connecté en tant que {user.email?.split("@")[0]}
              </div>
              {user.email?.includes("admin") && (
                <div className="space-y-2">
                  <Link
                    href="/admin/profiles"
                    className="block py-2 text-purple-600 hover:text-purple-800 transition-colors duration-200 font-space-grotesk"
                  >
                    Administration
                  </Link>
                  <Link
                    href="/admin/stocks"
                    className="block py-2 text-orange-600 hover:text-orange-800 transition-colors duration-200 font-space-grotesk"
                  >
                    Gestion des stocks
                  </Link>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full mt-3 text-left py-2 text-gray-500 hover:text-black transition-colors duration-200 font-space-grotesk"
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="mobile-auth space-y-2">
              <Link
                href="/login"
                className="block py-2 text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk"
              >
                Se connecter
              </Link>
              <Link
                href="/signup"
                className="block py-2 bg-black text-white rounded-xl text-center hover:bg-gray-800 transition-colors duration-200 font-space-grotesk"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
