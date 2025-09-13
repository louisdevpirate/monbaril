"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const footerData = {
  about: {
    title: "À propos",
    links: [
      { name: "Notre histoire", href: "/about" },
      { name: "Notre équipe", href: "/about#team" },
      { name: "Nos valeurs", href: "/about#values" },
      { name: "Carrières", href: "/careers" },
    ],
  },
  collections: {
    title: "Collections",
    links: [
      { name: "Racing Legends", href: "/categories/racing" },
      { name: "Vintage Oil", href: "/categories/vintage" },
      { name: "Military & Cargo", href: "/categories/military" },
      { name: "Cyberpunk", href: "/categories/cyberpunk" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { name: "FAQ", href: "/faq" },
      { name: "Contact", href: "/contact" },
      { name: "Livraison", href: "/shipping" },
      { name: "Retours", href: "/returns" },
      { name: "Suivi de commande", href: "/track-order" },
    ],
  },
  legal: {
    title: "Légal",
    links: [
      { name: "CGV", href: "/terms" },
      { name: "Mentions légales", href: "/legal" },
      { name: "Politique de confidentialité", href: "/privacy" },
      { name: "Cookies", href: "/cookies" },
    ],
  },
};

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Merci pour votre inscription à la newsletter !");
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Logo */}
        <div>
          <Link href="/" className="text-xl font-semibold text-gray-900">
            MonBaril<span className="text-orange-500">™</span>
          </Link>
        </div>

        {/* À propos */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{footerData.about.title}</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            {footerData.about.links.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-gray-900">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Collections */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{footerData.collections.title}</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            {footerData.collections.links.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-gray-900">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Rejoignez notre newsletter</h3>
          <form onSubmit={handleNewsletterSubmit} className="flex items-center border-b border-gray-300 pb-2">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 text-sm text-gray-600 placeholder-gray-400 focus:outline-none"
            />
            <button type="submit" className="ml-2 text-gray-900 hover:text-gray-600">
              →
            </button>
          </form>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-gray-200 mt-8">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row justify-between text-sm text-gray-500">
          <p>Copyright © {new Date().getFullYear()} MonBaril™. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-gray-900">CGV</Link>
            <Link href="/privacy" className="hover:text-gray-900">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
