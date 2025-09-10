"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function NewsletterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'envoi (à remplacer par une vraie API)
    setTimeout(() => {
      toast.success("🎉 Bienvenue dans la team MonBaril ! Vous recevrez 10% de réduction sur votre première commande.");
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Rejoignez la team{" "}
            <span className="text-orange-500">MonBaril™</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Recevez 10% de réduction sur votre premier baril et soyez les premiers informés de nos nouvelles collections exclusives.
          </p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              required
              className="flex-1 px-6 py-4 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl transition-colors duration-300 whitespace-nowrap"
            >
              {isLoading ? "⏳..." : "S'inscrire"}
            </motion.button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm text-gray-400 mt-4"
          >
            🔒 Vos données sont protégées. Désabonnement possible à tout moment.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 grid md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="text-3xl mb-3">🎁</div>
              <h3 className="text-lg font-bold text-white mb-2">10% de réduction</h3>
              <p className="text-gray-400 text-sm">Sur votre première commande</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-bold text-white mb-2">Nouveautés en avant-première</h3>
              <p className="text-gray-400 text-sm">Soyez les premiers informés</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💌</div>
              <h3 className="text-lg font-bold text-white mb-2">Contenu exclusif</h3>
              <p className="text-gray-400 text-sm">Conseils et inspirations déco</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
