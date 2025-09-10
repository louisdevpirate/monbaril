"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
  social: [
    { name: "Instagram", href: "https://instagram.com/monbaril", icon: "📷" },
    { name: "Facebook", href: "https://facebook.com/monbaril", icon: "📘" },
    { name: "TikTok", href: "https://tiktok.com/@monbaril", icon: "🎵" },
    { name: "YouTube", href: "https://youtube.com/monbaril", icon: "📺" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">
                MonBaril<span className="text-orange-500">™</span>
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Des barils iconiques transformés en objets d&apos;art pour les amoureux de design et de pop culture.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {footerData.social.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors duration-300"
                  >
                    <span className="text-lg">{social.icon}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* About */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold mb-4">{footerData.about.title}</h4>
              <ul className="space-y-2">
                {footerData.about.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Collections */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold mb-4">{footerData.collections.title}</h4>
              <ul className="space-y-2">
                {footerData.collections.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Support */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold mb-4">{footerData.support.title}</h4>
              <ul className="space-y-2">
                {footerData.support.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Legal */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold mb-4">{footerData.legal.title}</h4>
              <ul className="space-y-2">
                {footerData.legal.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} MonBaril™. Tous droits réservés.
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>🇫🇷 Fabriqué en France</span>
            <span>🚚 Livraison Europe</span>
            <span>💳 Paiement sécurisé</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
