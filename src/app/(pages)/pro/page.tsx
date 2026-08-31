"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import CTAButton from "@/components/ui/CTAButton";
import Footer from "@/components/sections/Footer";
import { useWebMCPTool } from "@/hooks/useWebMCPTool";
import {
  HammerIcon,
  TruckIcon,
  CustomIcon,
  HandshakeIcon,
  MedalIcon,
  ClockIcon,
} from "@/components/icons/icons";

const SECTORS = [
  {
    title: "Concessions auto & moto",
    description:
      "Un baril aux couleurs de la marque dans le hall, en bout de ligne d'exposition ou comme table d'accueil. La teinte constructeur existe en RAL : on la reproduit à l'identique.",
    image: "/images/thermolaquage/rouge-design.png",
  },
  {
    title: "Bars, restaurants & hôtels",
    description:
      "Mange-debout, table basse de lounge, support de terrasse. L'acier tient le passage, la finition thermolaquée tient les chocs et le nettoyage quotidien.",
    image: "/images/thermolaquage/black-loft.png",
  },
  {
    title: "Showrooms & retail",
    description:
      "Présentoir de vitrine ou mobilier de corner, décliné dans la teinte de l'enseigne. Série homogène, même finition d'un magasin à l'autre.",
    image: "/images/thermolaquage/blue-swedish.png",
  },
  {
    title: "Salons, événementiel & PLV",
    description:
      "Un stand qu'on remarque de loin, réutilisable salon après salon — là où le carton part à la benne le dimanche soir.",
    image: "/images/thermolaquage/street-yellow.png",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Vous nous dites quoi",
    text: "Quantité, secteur, teinte RAL si vous la connaissez, logo à marquer ou non. Le formulaire ci-dessous suffit — pas besoin de brief formaté.",
  },
  {
    n: "02",
    title: "Devis sous 48 h",
    text: "Prix unitaire dégressif selon le volume, délai de fabrication ferme, frais de livraison chiffrés. Un seul document, pas d'aller-retour inutile.",
  },
  {
    n: "03",
    title: "Validation avant peinture",
    text: "Vous recevez le rendu de la teinte et du placement du logo. Rien ne part au four tant que vous n'avez pas validé.",
  },
  {
    n: "04",
    title: "Fabrication et livraison",
    text: "Décapage, traitement antirouille, thermolaquage, marquage. Livraison sur palette à l'adresse de votre choix, ou retrait à l'atelier de Dijon.",
  },
];

const ARGUMENTS = [
  {
    icon: CustomIcon,
    title: "Votre charte, à l'identique",
    text: "Teinte RAL exacte, finition mat, brillant ou grainé, logo marqué. Vous envoyez le fichier, on s'occupe du reste — aucun design à créer de votre côté.",
  },
  {
    icon: MedalIcon,
    title: "Une série homogène",
    text: "Dix barils commandés ensemble sortent du même bain de poudre et de la même cuisson : pas d'écart de teinte d'une pièce à l'autre.",
  },
  {
    icon: HammerIcon,
    title: "Thermolaquage, pas peinture",
    text: "Poudre appliquée par procédé électrostatique et cuite au four. Résistant aux chocs, aux rayures et aux UV — conçu pour un usage recevant du public.",
  },
  {
    icon: HandshakeIcon,
    title: "Tarif dégressif dès 5 unités",
    text: "Le prix unitaire baisse avec le volume. Facture au nom de la société, TVA récupérable, paiement par virement possible.",
  },
  {
    icon: TruckIcon,
    title: "Livraison sur palette",
    text: "France métropolitaine et Monaco, livraison groupée pour les séries. Retrait gratuit à l'atelier de Dijon (21) sur rendez-vous.",
  },
  {
    icon: ClockIcon,
    title: "Fabriqué à la commande",
    text: "Aucun stock, aucune série morte : chaque baril part de son fût d'origine, décapé puis remis en peinture pour vous.",
  },
];

const FAQ_PRO = [
  {
    id: 1,
    question: "Y a-t-il un minimum de commande ?",
    answer:
      "Non. Vous pouvez commander une pièce unique pour tester le rendu avant d'engager une série. Le tarif dégressif, lui, démarre à partir de 5 unités.",
  },
  {
    id: 2,
    question: "Sous quel format envoyer notre logo ?",
    answer:
      "Un vectoriel (SVG, AI, EPS, PDF) donne le meilleur résultat. Un PNG en haute définition sur fond transparent fonctionne aussi. Envoyez-le en réponse à notre devis, nous vous confirmerons sa faisabilité sur la surface courbe du fût.",
  },
  {
    id: 3,
    question: "Pouvez-vous reproduire exactement notre couleur de marque ?",
    answer:
      "Si votre charte donne une référence RAL, oui, à l'identique. Si elle est en Pantone, HEX ou CMJN, nous cherchons l'équivalent RAL le plus proche et vous le soumettons avant fabrication.",
  },
  {
    id: 4,
    question: "Quels sont les délais sur une série ?",
    answer:
      "Comptez 7 à 10 jours ouvrés de fabrication pour les petites séries, davantage au-delà de 25 unités. Le devis porte un délai ferme, calculé sur le plan de charge réel de l'atelier au moment de votre demande.",
  },
  {
    id: 5,
    question: "Comment se passe la facturation ?",
    answer:
      "Facture au nom de la société avec TVA détaillée et numéro de TVA intracommunautaire. Acompte à la commande, solde avant expédition. Paiement par virement ou carte.",
  },
  {
    id: 6,
    question: "Les barils sont-ils utilisables en extérieur ?",
    answer:
      "Oui. Le thermolaquage résiste aux UV et aux intempéries. Pour une exposition permanente en extérieur ou en bord de mer, dites-le nous : nous adaptons le traitement antirouille en conséquence.",
  },
];

const EMPTY_FORM = {
  company: "",
  name: "",
  email: "",
  phone: "",
  sector: "",
  quantity: "",
  ral: "",
  logo: false,
  deadline: "",
  message: "",
};

export default function ProPage() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const sendQuote = async (payload: typeof EMPTY_FORM) => {
    const res = await fetch("/api/pro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendQuote(formData);
      toast.success("Demande reçue ! Votre devis part sous 48 h ouvrées.");
      setFormData(EMPTY_FORM);
    } catch {
      toast.error(
        "Une erreur est survenue. Réessayez ou écrivez-nous à contact@monbaril.fr"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useWebMCPTool<{
    company: string;
    name: string;
    email: string;
    sector: string;
    quantity: string;
    phone?: string;
    ral?: string;
    logo?: boolean;
    deadline?: string;
    message?: string;
  }>({
    name: "request_pro_quote",
    description:
      "Envoie une demande de devis professionnel pour des barils personnalisés (logo, teinte RAL, volume).",
    inputSchema: {
      type: "object",
      properties: {
        company: { type: "string", description: "Nom de la société" },
        name: { type: "string", description: "Nom du contact" },
        email: { type: "string", description: "Email professionnel" },
        phone: { type: "string", description: "Téléphone" },
        sector: {
          type: "string",
          enum: [
            "concession",
            "restauration",
            "retail",
            "evenementiel",
            "bureau",
            "autre",
          ],
        },
        quantity: {
          type: "string",
          enum: ["1-4", "5-9", "10-24", "25-49", "50+"],
        },
        ral: { type: "string", description: "Référence RAL souhaitée" },
        logo: { type: "boolean", description: "Marquage du logo souhaité" },
        deadline: { type: "string", description: "Échéance du projet" },
        message: { type: "string", description: "Précisions sur le projet" },
      },
      required: ["company", "name", "email", "sector", "quantity"],
    },
    execute: async (input) => {
      const payload = { ...EMPTY_FORM, ...input };
      setFormData(payload);
      setIsSubmitting(true);
      try {
        await sendQuote(payload);
        setFormData(EMPTY_FORM);
        return `Demande de devis envoyée pour ${input.company} (${input.quantity} barils).`;
      } catch {
        return `Erreur lors de l'envoi de la demande de devis de ${input.company}.`;
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <Image
          src="/images/thermolaquage/black-loft.png"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="relative max-w-[95%] mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-orange-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded font-space-grotesk mb-6">
              Professionnels
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Vos barils, votre logo,
              <br />
              votre couleur.
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed mb-10">
              Des fûts industriels 200&nbsp;L décapés, thermolaqués à votre
              teinte RAL et marqués à votre logo. Vous envoyez votre charte,
              l&apos;atelier s&apos;occupe du reste — de 1 pièce à plusieurs
              dizaines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTAButton href="#devis">Demander un devis</CTAButton>
              {/* La variante secondaire est gris 900 : invisible sur un hero
                  sombre. On l'inverse en blanc plutôt que d'ajouter une
                  variante au composant pour un seul usage. */}
              <CTAButton
                href="/categories"
                variant="secondary"
                showArrow={false}
                className="!bg-white !text-gray-900 hover:!bg-gray-100"
              >
                Voir les finitions
              </CTAButton>
            </div>
            <p className="text-sm text-gray-400 mt-6 font-space-grotesk">
              Réponse sous 48&nbsp;h ouvrées · Tarif dégressif dès 5 unités ·
              Fabriqué à Dijon
            </p>
          </motion.div>
        </div>
      </section>

      {/* Arguments */}
      <section className="py-20 bg-white">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Pourquoi les pros nous appellent
            </h2>
            <p className="text-xl text-gray-600">
              Un objet de marque qui ne ressemble à aucun goodie&nbsp;: assez
              solide pour rester dix ans dans un hall, assez singulier pour
              qu&apos;on le remarque.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARGUMENTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="border border-gray-200 rounded-lg p-8 hover:border-orange-500 transition-colors"
                >
                  <Icon className="w-8 h-8 text-orange-500 mb-5" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Secteurs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Où nos barils travaillent
            </h2>
            <p className="text-xl text-gray-600">
              Le même fût, quatre métiers différents. À chaque fois, la teinte
              et le marquage changent tout.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {SECTORS.map((sector, i) => (
              <motion.div
                key={sector.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="relative h-64">
                  <Image
                    src={sector.image}
                    alt={sector.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {sector.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {sector.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              De votre logo au baril livré
            </h2>
            <p className="text-xl text-gray-600">
              Quatre étapes, aucune surprise sur le prix ni sur le délai.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-bold text-orange-500 mb-4 font-space-grotesk">
                  {step.n}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de devis */}
      <section id="devis" className="py-20 bg-gray-900 scroll-mt-16">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Demandez votre devis
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Dites-nous simplement combien de barils et pour quel usage.
                Nous revenons vers vous sous 48&nbsp;h ouvrées avec un prix
                unitaire, un délai ferme et les frais de livraison.
              </p>
              <div className="space-y-4 text-gray-400 text-sm font-space-grotesk">
                <p>
                  Vous préférez le téléphone ou l&apos;email&nbsp;?
                  <br />
                  <a
                    href="mailto:contact@monbaril.fr"
                    className="text-orange-500 hover:underline"
                  >
                    contact@monbaril.fr
                  </a>
                </p>
                <p>
                  Envoyez votre logo en réponse à notre devis — inutile de le
                  joindre maintenant.
                </p>
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-8 space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Société *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Votre nom *
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
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email professionnel *
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
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="sector"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Votre activité *
                  </label>
                  <select
                    id="sector"
                    name="sector"
                    required
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="concession">Concession auto / moto</option>
                    <option value="restauration">
                      Bar · Restaurant · Hôtel
                    </option>
                    <option value="retail">Retail · Showroom</option>
                    <option value="evenementiel">
                      Événementiel · Salon · PLV
                    </option>
                    <option value="bureau">Bureau · Entreprise</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Quantité envisagée *
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    required
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="1-4">1 à 4 barils</option>
                    <option value="5-9">5 à 9 barils</option>
                    <option value="10-24">10 à 24 barils</option>
                    <option value="25-49">25 à 49 barils</option>
                    <option value="50+">50 barils et plus</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="ral"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Teinte souhaitée
                  </label>
                  <input
                    type="text"
                    id="ral"
                    name="ral"
                    placeholder="RAL 3020, ou votre code Pantone"
                    value={formData.ral}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="deadline"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Échéance
                  </label>
                  <input
                    type="text"
                    id="deadline"
                    name="deadline"
                    placeholder="Salon en mars, ouverture en juin…"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="logo"
                  checked={formData.logo}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 accent-orange-500"
                />
                <span className="text-sm text-gray-700">
                  Je souhaite faire marquer mon logo sur les barils
                </span>
              </label>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Votre projet
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Usage prévu, contraintes, questions…"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                />
              </div>

              <CTAButton
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center"
                showArrow={false}
              >
                {isSubmitting ? "Envoi en cours..." : "Recevoir mon devis"}
              </CTAButton>

              <p className="text-xs text-gray-500">
                Vos informations servent uniquement à établir votre devis. Elles
                ne sont ni revendues, ni utilisées pour de la prospection.
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      {/* FAQ pro */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-12 text-center"
          >
            Questions des pros
          </motion.h2>

          <div className="space-y-1">
            {FAQ_PRO.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-900 pr-4">{faq.question}</span>
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
                      <div className="px-6 pb-4 pt-4 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
