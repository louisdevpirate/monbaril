"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="px-8 mb-16">
      <div className="max-w-[95%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Besoin d'aide pour choisir ?</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Notre équipe d'experts est là pour vous accompagner dans votre choix de baril. 
            Contactez-nous pour des conseils personnalisés.
          </p>


          {/* Boutons CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-orange-500 px-8 py-4 font-semibold hover:bg-gray-100 transition-colors"
            >
              Nous contacter
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white hover:text-orange-500 transition-colors"
            >
              En savoir plus
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
