"use client";

import { motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const reviewsData = [
  {
    id: 1,
    name: "Marie L.",
    avatar: "👩",
    rating: 5,
    text: "Mon baril Racing Gulf est absolument magnifique ! La qualité est exceptionnelle et il fait sensation dans mon salon. Livraison rapide et emballage soigné.",
    location: "Paris",
  },
  {
    id: 2,
    name: "Thomas M.",
    avatar: "👨",
    rating: 5,
    text: "J'ai commandé le baril Military Cargo pour mon bureau. L'attention aux détails est incroyable. Un vrai objet d'art qui donne du caractère à ma pièce.",
    location: "Lyon",
  },
  {
    id: 3,
    name: "Sophie D.",
    avatar: "👩",
    rating: 5,
    text: "Service client au top ! Ils ont répondu à toutes mes questions avant l'achat. Le baril Vintage Oil dépasse mes attentes. Je recommande vivement !",
    location: "Marseille",
  },
];

export default function ReviewsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Avis clients
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez ce que pensent nos clients de leurs barils MonBaril™
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {reviewsData.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { duration: 0.3 },
              }}
              className="group"
            >
              <div className="bg-gray-50 rounded-2xl p-8 h-full transition-all duration-300 shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{review.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {renderStars(review.rating)}
                </div>
                
                <p className="text-gray-700 leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">500+</div>
            <div className="text-gray-600">Barils vendus</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">4.9/5</div>
            <div className="text-gray-600">Note moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">98%</div>
            <div className="text-gray-600">Clients satisfaits</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">24h</div>
            <div className="text-gray-600">Livraison express</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
