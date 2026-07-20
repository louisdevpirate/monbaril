"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/sections/Footer";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

// Contenu vérifié : chaque réponse s'appuie sur ce qui est déjà établi
// ailleurs sur le site (CGV, mentions légales) — rien n'est inventé ici.
const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Qu'est-ce qu'un baril MonBaril, concrètement ?",
    answer:
      "Un fût métallique 200 L d'origine industrielle, décapé, traité antirouille puis thermolaqué (peinture poudre électrostatique cuite au four) dans notre atelier en France. Chaque pièce est fabriquée à la commande.",
  },
  {
    id: 2,
    question: "Les barils peuvent-ils être utilisés en extérieur ?",
    answer:
      "Le thermolaquage est un procédé réputé pour sa résistance aux intempéries, largement utilisé sur du mobilier et des équipements extérieurs. Nous recommandons toutefois d'éviter une exposition prolongée à des conditions extrêmes (gel intense, embruns salins) pour préserver la finition dans le temps. Pour un usage extérieur régulier, contactez-nous avant commande.",
  },
  {
    id: 3,
    question: "Comment entretenir un baril thermolaqué ?",
    answer:
      "Un simple chiffon doux légèrement humide suffit pour l'entretien courant. Évitez les produits abrasifs, l'acétone et les éponges grattantes, qui peuvent ternir la finition.",
  },
  {
    id: 4,
    question: "Chaque baril est-il vraiment unique ?",
    answer:
      "Oui. Nos fûts proviennent d'un usage industriel réel avant transformation : les micro-variations de matière font qu'aucune pièce ne ressort strictement identique à une autre, même sur un même modèle.",
  },
  {
    id: 5,
    question: "Quelles finitions existent (mat, brillant, grainé) ?",
    answer:
      "Notre catalogue propose des barils en finition mat, brillant ou grainée selon les modèles. Chaque fiche produit précise la finition de la pièce proposée.",
  },
  {
    id: 6,
    question: "Puis-je personnaliser la couleur ou ajouter mon logo ?",
    answer:
      "La personnalisation (couleur, logo, sur-mesure) n'est pas encore en libre-service sur le site. Pour un projet sur mesure, écrivez-nous via notre page contact : nous étudions chaque demande individuellement.",
  },
  {
    id: 7,
    question: "Quel est le délai de fabrication ?",
    answer:
      "Comptez 7 à 10 jours ouvrés de fabrication en atelier (décapage, traitement, thermolaquage) avant expédition, votre baril étant fabriqué à la commande et non stocké à l'avance.",
  },
  {
    id: 8,
    question: "Quels sont les délais et frais de livraison ?",
    answer:
      "Un baril de 200 L ne relève pas de la messagerie standard : nous finalisons actuellement le choix du transporteur adapté à ce format. Les délais et frais exacts seront affichés sur la fiche produit et confirmés avant toute validation de commande.",
  },
  {
    id: 9,
    question: "Puis-je me faire rembourser si le produit ne convient pas ?",
    answer:
      "Vous disposez de 14 jours après réception pour exercer votre droit de rétractation, conformément à la réglementation en vigueur. Le produit doit être retourné non endommagé, dans son emballage d'origine. Le détail des conditions figure dans nos conditions générales de vente.",
  },
  {
    id: 10,
    question: "Le paiement est-il sécurisé ?",
    answer:
      "Oui, tous les paiements sont traités par Stripe, l'un des prestataires de paiement les plus utilisés au monde. Vos coordonnées bancaires ne transitent jamais par nos serveurs.",
  },
  {
    id: 11,
    question: "MonBaril est-il vraiment fabriqué en France ?",
    answer:
      "Oui. Chaque baril est décapé, traité et thermolaqué dans notre atelier français — ce n'est pas un produit importé et reconditionné.",
  },
  {
    id: 12,
    question: "Comment contacter le service client ?",
    answer:
      "Le plus simple est notre formulaire de contact, ou directement par email à contact@monbaril.fr. Nous répondons personnellement à chaque message.",
  },
];

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-[95%] mx-auto px-6 lg:px-10 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-gray-900 mb-4">
            Questions fréquentes
          </h1>
          <p className="text-lg text-gray-500 font-space-grotesk">
            Tout ce qu&apos;il faut savoir avant de commander votre baril
          </p>
        </div>

        {/* Accordéon */}
        <div className="max-w-3xl mx-auto space-y-3 mb-16">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="bg-[#f5f0ea] rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
              >
                <span className="text-gray-900 font-space-grotesk font-medium">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openFAQ === faq.id ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 text-orange-500 text-2xl leading-none"
                  aria-hidden
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openFAQ === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-gray-600 font-space-grotesk leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA contact */}
        <div className="text-center">
          <p className="text-gray-500 font-space-grotesk mb-4">
            Vous ne trouvez pas la réponse à votre question ?
          </p>
          <a
            href="/contact"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-space-grotesk font-medium transition-colors"
          >
            Contactez-nous
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
