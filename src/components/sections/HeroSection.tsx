"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/icons";
import SmartImage from "@/components/ui/SmartImage";

export default function HeroSection() {
  return (
    <section className="relative p-28  flex items-center justify-center overflow-hidden px-8">
      <div className="container mx-auto grid lg:grid-cols-3 items-center max-w-7xl gap-12 bg-gradient-to-br from-orange-100 via-white to-orange-200 rounded-3xl p-12">
        {/* Content - style minimaliste */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-left pl-2 pr-4 flex flex-col justify-space-between max-h-[60vh]"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
             className="font-bold text-black leading-[0.9] tracking-tight font-bebas-neue pb-4 w-full"
             style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
          >
            Faites le plein de <span className="text-orange-500">style.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-md text-gray-600 max-w-[80%] font-space-grotesk pb-8"
          >
            Objet culte — design unique.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex gap-2 max-w-md flex-col"
          >
              <Link
                href="/collections"
                className="bg-orange-500 text-white font-light p-4 px-8 rounded-xl text-md transition-all duration-100 transform flex items-center font-space-grotesk gap-2 group overflow-hidden relative w-fit"
              >
                <span className="relative z-10 transition-all duration-300 group-hover:translate-x-8">Voir les collections</span>
                <ArrowRightIcon className="w-4 h-4 transition-all duration-300 group-hover:translate-x-32" />
                <ArrowRightIcon className="w-4 h-4 absolute left-0 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-8" />
              </Link>
              <span className="text-gray-600 text-[10px] ml-2 italic">Paiement 100% sécurisé – Livraison rapide</span>
          </motion.div>
        </motion.div>

        {/* Visual - image stylisée */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl lg:col-span-2"
        >
          <SmartImage
            src="/images/image.png"
            alt="Baril Racing Gulf - Design unique et moderne"
            width={2000}
            height={960}
            className="w-full h-auto"
            priority={true}
            quality={95}
          />
        </motion.div>
      </div>

      {/* Scroll Indicator - minimaliste */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/6"
      >
        <motion.div
          animate={{ y: [0, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 border-2 border-gray-800 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-800 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
