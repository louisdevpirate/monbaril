"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase/supabaseClient";
import { CartIcon, HeartIcon, LogOutIcon } from "@/components/icons/icons";
import Image from "next/image";

export default function Navbar() {
  const { cart, clearCart } = useCart();
  const { user, loading } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearCart();
      console.log("✅ Panier vidé après déconnexion");
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto py-4">
        <div className="rounded-2xl py-2">
          <div className="px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/monbaril.fr.svg" alt="MonBaril" width={100} height={100} />
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/collections"
              className="text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk"
            >
              Collections
            </Link>

            <Link
              href="/about"
              className="text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk"
            >
              À propos
            </Link>
            <Link
              href="/blog"
              className="text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk"
            >
              Contact
            </Link>
          </div>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {!loading && user && (
              <Link
                href="/favorites"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
              >
                <HeartIcon className="w-5 h-5" />
              </Link>
            )}

            <Link
              href="/cart"
              className="relative text-gray-600 hover:text-orange-500 transition-colors duration-200"
            >
              <CartIcon className="w-5 h-5" itemCount={totalItems} />
            </Link>

            {!loading &&
              (user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 font-space-grotesk">
                    {user.email?.split("@")[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-black transition-colors duration-200"
                    title="Déconnexion"
                  >
                    <LogOutIcon className="w-5 h-5 cursor-pointer hover:text-orange-500 transition-colors duration-200" />
                  </button>
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
                    className="bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors duration-200 font-space-grotesk"
                  >
                    S'inscrire
                  </Link>
                </div>
              ))}
          </div>

          {/* Menu Mobile Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors duration-200"
          >
            <span className="text-sm font-space-grotesk">Menu</span>
            <div className="flex flex-col space-y-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden mt-8 backdrop-blur-sm border rounded-2xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <Link
                href="/categories"
                className="block py-2 text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk"
              >
                Collections
              </Link>
              <Link
                href="/products"
                className="block py-2 text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk"
              >
                Produits
              </Link>
              <Link
                href="/about"
                className="block py-2 text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk"
              >
                À propos
              </Link>
              <Link
                href="/contact"
                className="block py-2 text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk"
              >
                Contact
              </Link>
            </div>

            <div className="px-4 py-3 border-b border-gray-100">
              {!loading && user && (
                <Link
                  href="/favorites"
                  className="flex items-center py-2 text-gray-600 hover:text-orange-500 transition-colors duration-200"
                >
                  <HeartIcon className="w-4 h-4 mr-2" />
                  <span className="font-space-grotesk">Favoris</span>
                </Link>
              )}
              <Link
                href="/cart"
                className="flex items-center py-2 text-gray-600 hover:text-orange-500 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
                <span className="font-space-grotesk">
                  Panier{totalItems > 0 && ` (${totalItems})`}
                </span>
              </Link>
            </div>

            {!loading &&
              (user ? (
                <div className="px-4 py-3">
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
                <div className="px-4 py-3 space-y-2">
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
              ))}
          </div>
        )}
        </div>
      </div>
    </nav>
  );
}
