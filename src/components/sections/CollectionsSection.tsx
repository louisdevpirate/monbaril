"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import CTAButton from "@/components/ui/CTAButton";

const collectionsData = [
  {
    id: "racing",
    title: "Racing Legends",
    description: "Inspirés des plus grandes courses automobiles",
    image: "/images/products/texaco.png",
    backgroundImage: "/images/products/japan.png",
    slug: "racing",
  },
  {
    id: "vintage",
    title: "Vintage Oil Barrels",
    description: "Le charme industriel d'antan",
    image: "/images/products/image.png",
    backgroundImage: "/images/products/loft.jpeg",
    slug: "vintage",
  },
  {
    id: "military",
    title: "Military & Cargo",
    description: "Style commando et robustesse",
    image: "/images/products/image2.png",
    backgroundImage: "/images/products/street.png",
    slug: "military",
  },
  {
    id: "cyberpunk",
    title: "Cyberpunk/Urbex",
    description: "Futurisme et esthétique urbaine",
    image: "/images/products/image3.png",
    backgroundImage: "/images/products/newyork.jpeg",
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
      },
    },
  };

  return (
    <section id="collections" ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-[95%]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-left mb-16"
        >
          <h2 className="text-4xl lg:text-md font-bold text-gray-900 mb-2">
            Collections en vedette
          </h2>
          <p className="text-md text-gray-600 max-w-3xl">
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
            >
                <Link href={`/categories/${collection.slug}`}>
                  <div className="group bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 aspect-square">
                    <div className="relative w-full h-full overflow-hidden">
                      {/* Background Image */}
                      <Image
                        src={collection.backgroundImage}
                        alt={`Background ${collection.title}`}
                        width={400}
                        height={400}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg scale-150 group-hover:scale-175 transition-transform duration-500"
                      />
                      
                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300 z-10" />
                      
                      {/* Product Image */}
                      <div className="relative z-20 flex items-center justify-center h-full">
                        <Image
                          src={collection.image}
                          alt={collection.title}
                          width={1000}
                          height={1000}
                          className="object-contain w-full h-full rounded-lg"
                        />
                      </div>
                      
                      {/* Overlay Text */}
                      <div className="absolute inset-0 flex items-end p-6 pb-10 z-30">
                        <div className="text-white">
                          <h3 className="text-xl font-bold mb-1">{collection.title}</h3>
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
          className="flex justify-center mt-12"
        >
          <CTAButton href="/collections" variant="secondary">
            Voir toutes les collections
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
}
