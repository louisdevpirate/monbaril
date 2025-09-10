"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden pt-24">
      {/* Background Pattern - très subtil */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>


      <div className="container mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center max-w-7xl">
        {/* Content - style minimaliste */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-left space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-block"
          >
            <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium font-space-grotesk">
              Faites le plein de style
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-6xl lg:text-8xl font-bold text-black leading-[0.9] tracking-tight font-bebas-neue"
          >
            Faites le plein {" "}
            <span className="text-orange-500"><br />de style.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl text-gray-600 max-w-lg leading-relaxed font-space-grotesk"
          >
            Transformés en objets d&apos;art pour les amoureux de design, de pop culture et d&apos;objets uniques.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex gap-4"
          >
            <Link
              href="#collections"
              className="bg-black hover:bg-gray-800 text-white font-medium py-4 px-8 rounded-full text-md transition-all duration-300 transform hover:scale-105 flex items-center font-space-grotesk"
            >
              Voir les collections →
            </Link>
            <Link
              href="/products"
              className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium py-4 px-8 rounded-xl text-lg transition-all duration-300 font-space-grotesk"
            >
              Tous les produits
            </Link>
          </motion.div>
        </motion.div>

        {/* Visual - image stylisée */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            {/* Container avec ombre subtile */}
            <div className="relative bg-gray-50 rounded-3xl p-8 shadow-2xl">
              <Image
                src="/barils/baril1.png"
                alt="Baril Racing Gulf"
                width={500}
                height={600}
                className="object-contain"
                priority
              />
              
              {/* Accent orange subtil */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - minimaliste */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
