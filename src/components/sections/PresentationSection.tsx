"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const presentationData = [
  {
    icon: "🎨",
    title: "Design unique",
    description: "Chaque baril est une œuvre d'art. Inspirés par les univers du racing, du rétro, du militaire ou du cyberpunk.",
  },
  {
    icon: "🛢️",
    title: "Véritable baril en métal",
    description: "Authentique baril 200L, vidé, nettoyé, retravaillé avec soin pour devenir un objet décoratif exceptionnel.",
  },
  {
    icon: "🇫🇷",
    title: "Créé en France",
    description: "Personnalisé à la main dans notre atelier, expédié partout en Europe avec amour et savoir-faire.",
  },
];

export default function PresentationSection() {
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
    hidden: { opacity: 0, y: 30 },
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
    <section ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight font-bebas-neue">
            Pourquoi MonBaril ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-space-grotesk">
            Trois raisons qui font de nos barils des objets d&apos;exception
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {presentationData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 h-full transition-all duration-300 shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200">
                <div className="text-center space-y-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-5xl mb-6 inline-block"
                  >
                    {item.icon}
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-orange-500 transition-colors duration-300 font-bebas-neue">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed text-lg font-space-grotesk">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
