"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CTAButton from "@/components/ui/CTAButton";
import Footer from "@/components/sections/Footer";
import { useWebMCPTool } from "@/hooks/useWebMCPTool";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Comment passer une commande ?",
    answer: "C'est très simple ! Parcourez nos produits, ajoutez-les à votre panier, puis procédez au checkout. Vous recevrez une confirmation par email."
  },
  {
    id: 2,
    question: "Quels sont les délais de livraison ?",
    answer: "Chaque baril est fabriqué à la commande : comptez 7 à 10 jours ouvrés de fabrication en atelier (décapage, thermolaquage, finitions). Le baril étant un colis hors-gabarit, le transporteur et les délais de livraison sont en cours de finalisation et seront confirmés avant validation de votre commande."
  },
  {
    id: 3,
    question: "Puis-je modifier ou annuler ma commande ?",
    answer: "Vous pouvez modifier votre commande tant qu'elle n'a pas été expédiée. Contactez-nous rapidement pour toute modification."
  },
  {
    id: 4,
    question: "Quelle est votre politique de retour ?",
    answer: "Nous acceptons les retours sous 14 jours. Les produits doivent être dans leur état d'origine avec l'emballage intact."
  },
  {
    id: 5,
    question: "Comment contacter le service client ?",
    answer: "Vous pouvez nous contacter via ce formulaire ou par email à contact@monbaril.fr. Nous répondons personnellement à chaque message."
  }
];

export default function ContactPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert("Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  useWebMCPTool({
    name: "list_faq",
    description: "Liste les questions fréquentes et leurs réponses.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () =>
      JSON.stringify(faqData.map((f) => ({ question: f.question, answer: f.answer }))),
  });

  useWebMCPTool<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>({
    name: "send_contact_message",
    description:
      "Remplit et envoie le formulaire de contact avec le nom, l'email, le sujet et le message fournis.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Nom complet" },
        email: { type: "string", description: "Adresse email" },
        subject: {
          type: "string",
          enum: ["question", "commande", "livraison", "retour", "autre"],
        },
        message: { type: "string", description: "Contenu du message" },
      },
      required: ["name", "email", "subject", "message"],
    },
    execute: async ({ name, email, subject, message }) => {
      setFormData({ name, email, subject, message });
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
      return `Message envoyé : "${subject}" de la part de ${name}.`;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-100 via-white to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Parlons de votre projet
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Commande, personnalisation RAL, projet pro ou simple question&nbsp;:
              l&apos;atelier vous répond sous 24&nbsp;h ouvrées.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pl-2">
              Questions fréquentes
            </h2>
            <div className="space-y-1">
              {faqData.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openFAQ === faq.id ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <svg
                        className="w-5 h-5 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="square"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 pt-4 text-gray-600">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Envoyez-nous un message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="question">Question générale</option>
                  <option value="commande">Problème de commande</option>
                  <option value="livraison">Question livraison</option>
                  <option value="retour">Retour/Échange</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Décrivez votre demande en détail..."
                />
              </div>

              <CTAButton
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                showArrow={false}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              </CTAButton>
            </form>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à trouver votre baril ?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Parcourez les collections, ou composez le vôtre sur mesure.
            </p>
            <CTAButton
              href="/categories"
              variant="secondary"
              className="text-orange-600 bg-white hover:bg-gray-100"
            >
              Explorer les collections
            </CTAButton>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}