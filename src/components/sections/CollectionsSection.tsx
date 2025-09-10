"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const collectionsData = [
  {
    id: "racing",
    title: "Racing Legends",
    description: "Inspirés des plus grandes courses automobiles",
    image: "/barils/baril1.png",
    slug: "racing",
  },
  {
    id: "vintage",
    title: "Vintage Oil Barrels",
    description: "Le charme industriel d'antan",
    image: "/barils/baril3.png",
    slug: "vintage",
  },
  {
    id: "military",
    title: "Military & Cargo",
    description: "Style commando et robustesse",
    image: "/barils/baril2.png",
    slug: "military",
  },
  {
    id: "cyberpunk",
    title: "Cyberpunk/Urbex",
    description: "Futurisme et esthétique urbaine",
    image: "/barils/baril1.png", // Utiliser une autre image quand disponible
    slug: "cyberpunk",
  },
];

export default function CollectionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="collections" ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Collections en vedette
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos univers iconiques, chacun racontant une histoire unique
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {collectionsData.map((collection) => (
            <motion.div
              key={collection.id}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="group"
            >
              <Link href={`/categories/${collection.slug}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                    
                    {/* Overlay Text */}
                    <div className="absolute inset-0 flex items-end p-6">
                      <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold mb-2">{collection.title}</h3>
                        <p className="text-sm opacity-90">{collection.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/categories"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
          >
            Voir toutes les collections
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
