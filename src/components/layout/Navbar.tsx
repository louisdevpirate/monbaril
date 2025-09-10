"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase/supabaseClient";

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-black tracking-wide font-bebas-neue">
              MonBaril<span className="text-orange-500">™</span>
            </h1>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/categories" className="text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk">
              Collections
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk">
              Produits
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk">
              Contact
            </Link>
          </div>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {!loading && user && (
              <Link href="/favorites" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
            )}
            
            <Link href="/cart" className="relative text-gray-600 hover:text-orange-500 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-space-grotesk">
                  {totalItems}
                </span>
              )}
            </Link>

            {!loading && (
              user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 font-space-grotesk">
                    {user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-black transition-colors duration-200 font-space-grotesk"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="text-sm text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk">
                    Connexion
                  </Link>
                  <Link href="/signup" className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors duration-200 font-space-grotesk">
                    S'inscrire
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Menu Mobile Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <span className="text-sm font-space-grotesk">Menu</span>
            <div className="flex flex-col space-y-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <Link href="/categories" className="block py-2 text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk">
                Collections
              </Link>
              <Link href="/products" className="block py-2 text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk">
                Produits
              </Link>
              <Link href="/about" className="block py-2 text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk">
                À propos
              </Link>
              <Link href="/contact" className="block py-2 text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk">
                Contact
              </Link>
            </div>
            
            <div className="px-4 py-3 border-b border-gray-100">
              {!loading && user && (
                <Link href="/favorites" className="flex items-center py-2 text-gray-600 hover:text-orange-500 transition-colors duration-200">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-space-grotesk">Favoris</span>
                </Link>
              )}
              <Link href="/cart" className="flex items-center py-2 text-gray-600 hover:text-orange-500 transition-colors duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span className="font-space-grotesk">
                  Panier{totalItems > 0 && ` (${totalItems})`}
                </span>
              </Link>
            </div>

            {!loading && (
              user ? (
                <div className="px-4 py-3">
                  <div className="text-sm text-gray-500 mb-2 font-space-grotesk">
                    Connecté en tant que {user.email?.split('@')[0]}
                  </div>
                  {user.email?.includes('admin') && (
                    <div className="space-y-2">
                      <Link href="/admin/profiles" className="block py-2 text-purple-600 hover:text-purple-800 transition-colors duration-200 font-space-grotesk">
                        Administration
                      </Link>
                      <Link href="/admin/stocks" className="block py-2 text-orange-600 hover:text-orange-800 transition-colors duration-200 font-space-grotesk">
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
                  <Link href="/login" className="block py-2 text-gray-600 hover:text-black transition-colors duration-200 font-space-grotesk">
                    Se connecter
                  </Link>
                  <Link href="/signup" className="block py-2 bg-black text-white rounded-lg text-center hover:bg-gray-800 transition-colors duration-200 font-space-grotesk">
                    S'inscrire
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
