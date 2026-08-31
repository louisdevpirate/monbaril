"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import CTAButton from "@/components/ui/CTAButton";
import Footer from "@/components/sections/Footer";
import BarilBlueprint from "@/components/pro/BarilBlueprint";
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
    ref: "01",
    title: "Concessions auto & moto",
    description:
      "Un baril aux couleurs de la marque dans le hall, en bout de ligne d'exposition ou comme table d'accueil. La teinte constructeur existe en RAL : on la reproduit à l'identique.",
    image: "/images/thermolaquage/rouge-design.png",
  },
  {
    ref: "02",
    title: "Bars, restaurants & hôtels",
    description:
      "Mange-debout, table basse de lounge, support de terrasse. L'acier tient le passage, la finition thermolaquée tient les chocs et le nettoyage quotidien.",
    image: "/images/thermolaquage/black-loft.png",
  },
  {
    ref: "03",
    title: "Showrooms & retail",
    description:
      "Présentoir de vitrine ou mobilier de corner, décliné dans la teinte de l'enseigne. Série homogène, même finition d'un magasin à l'autre.",
    image: "/images/thermolaquage/blue-swedish.png",
  },
  {
    ref: "04",
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

/** Intitulé de section présenté comme un repère de plan : indice, filet, titre. */
function Repere({
  indice,
  titre,
  chapo,
  sombre = false,
}: {
  indice: string;
  titre: string;
  chapo?: string;
  sombre?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-3xl mb-14"
    >
      <div className="flex items-center gap-4 mb-6">
        <span
          className={`font-mono text-[11px] tracking-[0.25em] ${
            sombre ? "text-blue-200/60" : "text-[#1e3a8a]/55"
          }`}
        >
          {indice}
        </span>
        <span
          className={`h-px flex-1 ${sombre ? "bg-blue-200/20" : "bg-[#1e3a8a]/15"}`}
        />
      </div>
      <h2
        className={`text-4xl font-bold mb-5 ${
          sombre ? "text-white" : "text-[#0a1a3c]"
        }`}
      >
        {titre}
      </h2>
      {chapo && (
        <p className={`text-xl ${sombre ? "text-blue-100/70" : "text-[#0a1a3c]/65"}`}>
          {chapo}
        </p>
      )}
    </motion.div>
  );
}

const champ =
  "w-full px-4 py-3 bg-white border border-[#1e3a8a]/20 rounded-none text-[#0a1a3c] " +
  "focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors";
const etiquette =
  "block font-mono text-[11px] tracking-[0.15em] uppercase text-[#1e3a8a]/70 mb-2";

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
    <div className="min-h-screen">
      {/* ── Hero : la planche de dessin ─────────────────────────── */}
      <section className="relative bp-blue bp-grid text-white overflow-hidden">
        <div className="relative max-w-[95%] mx-auto px-6 lg:px-10 py-20 lg:py-24">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-[11px] tracking-[0.25em] text-orange-500">
                  MB-200-01
                </span>
                <span className="h-px w-16 bg-blue-200/25" />
                <span className="font-mono text-[11px] tracking-[0.25em] text-blue-200/60">
                  PROFESSIONNELS
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-[1.05]">
                Vos barils, votre logo,
                <br />
                votre couleur.
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100/75 leading-relaxed mb-10 max-w-2xl">
                Des fûts industriels 200&nbsp;L décapés, thermolaqués à votre
                teinte RAL et marqués à votre logo. Vous envoyez votre charte,
                l&apos;atelier s&apos;occupe du reste — de 1 pièce à plusieurs
                dizaines.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <CTAButton href="#devis" className="!rounded-none">
                  Demander un devis
                </CTAButton>
                {/* La variante secondaire est gris 900 : invisible sur le bleu
                    de plan. On la passe en blanc plutôt que d'ajouter une
                    variante au composant pour un seul usage. */}
                <CTAButton
                  href="/categories"
                  variant="secondary"
                  showArrow={false}
                  className="!rounded-none !bg-white !text-[#0a1a3c] hover:!bg-blue-50"
                >
                  Voir les finitions
                </CTAButton>
              </div>

              {/* Cartouche : les constantes du produit, comme en bas d'un plan. */}
              <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 border-t border-l border-white/70">
                {[
                  ["Capacité", "200 L"],
                  ["Hauteur", "910 mm"],
                  ["Diamètre", "590 mm"],
                  ["Teintes", "RAL au choix"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="border-r border-b border-white/70 px-4 py-3"
                  >
                    <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-blue-200/50">
                      {k}
                    </dt>
                    <dd className="text-white mt-1 font-mono text-sm">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="font-mono text-[11px] tracking-[0.12em] text-blue-200/45 mt-6">
                RÉPONSE SOUS 48 H OUVRÉES · DÉGRESSIF DÈS 5 UNITÉS · FABRIQUÉ À
                DIJON
              </p>
            </motion.div>

            <div className="hidden lg:flex justify-center">
              <BarilBlueprint className="h-[640px] w-auto text-blue-200/85" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Arguments ───────────────────────────────────────────── */}
      <section className="bp-paper py-24">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <Repere
            indice="01 — POURQUOI"
            titre="Pourquoi les pros nous appellent"
            chapo="Un objet de marque qui ne ressemble à aucun goodie : assez solide pour rester dix ans dans un hall, assez singulier pour qu'on le remarque."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-l border-dashed border-[#1e3a8a]/30">
            {ARGUMENTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="border-r border-b border-dashed border-[#1e3a8a]/30 p-8 hover:bg-white transition-colors group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <Icon className="w-7 h-7 text-orange-500" />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#1e3a8a]/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0a1a3c] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#0a1a3c]/65 leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Secteurs ────────────────────────────────────────────── */}
      <section className="bp-paper bp-grid py-24 border-t border-[#1e3a8a]/10">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <Repere
            indice="02 — APPLICATIONS"
            titre="Où nos barils travaillent"
            chapo="Le même fût, quatre métiers différents. À chaque fois, la teinte et le marquage changent tout."
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="-mt-8 mb-14"
          >
            <CTAButton href="#devis" className="!rounded-none">
              Chiffrer mon projet
            </CTAButton>
          </motion.div>

          <div className="grid md:grid-cols-2 border-t border-l border-[#1e3a8a]/20">
            {SECTORS.map((sector, i) => (
              <motion.figure
                key={sector.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="bg-white border-r border-b border-[#1e3a8a]/20"
              >
                <div className="relative h-72 m-3 mb-0 overflow-hidden">
                  <Image
                    src={sector.image}
                    alt={sector.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-orange-500">
                      RÉF. {sector.ref}
                    </span>
                    <span className="h-px flex-1 bg-[#1e3a8a]/12" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0a1a3c] mb-3">
                    {sector.title}
                  </h3>
                  <p className="text-[#0a1a3c]/65 leading-relaxed">
                    {sector.description}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ─────────────────────────────────────────────── */}
      <section className="bp-paper py-24 border-t border-[#1e3a8a]/10">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <Repere
            indice="03 — DÉROULÉ"
            titre="De votre logo au baril livré"
            chapo="Quatre étapes, aucune surprise sur le prix ni sur le délai."
          />

          <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Filet de liaison entre les étapes, comme une ligne de cote. */}
            <span
              aria-hidden
              className="hidden lg:block absolute left-0 right-0 top-7 h-px border-t border-dashed border-[#1e3a8a]/25"
            />
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative z-10 w-14 h-14 flex items-center justify-center border border-[#1e3a8a]/30 bg-[#f7f8fb] rounded-full font-mono text-sm text-[#0a1a3c] mb-6">
                  {step.n}
                </div>
                <h3 className="text-xl font-bold text-[#0a1a3c] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#0a1a3c]/65 leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Devis ───────────────────────────────────────────────── */}
      <section id="devis" className="bp-blue bp-grid py-24 scroll-mt-16">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Repere
                indice="04 — DEVIS"
                titre="Demandez votre devis"
                chapo="Dites-nous simplement combien de barils et pour quel usage. Nous revenons vers vous sous 48 h ouvrées avec un prix unitaire, un délai ferme et les frais de livraison."
                sombre
              />
              <div className="space-y-4 text-blue-200/60 text-sm">
                <p>
                  Vous préférez le téléphone ou l&apos;email&nbsp;?
                  <br />
                  <a
                    href="mailto:contact@monbaril.fr"
                    className="text-orange-500 hover:underline font-mono"
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
              className="bg-[#f7f8fb] border border-[#1e3a8a]/20"
            >
              {/* En-tête de cartouche */}
              <div className="flex items-center justify-between px-8 py-4 border-b border-[#1e3a8a]/15 bg-white">
                <span className="font-mono text-[11px] tracking-[0.2em] text-[#1e3a8a]/70">
                  DEMANDE DE DEVIS
                </span>
                <span className="font-mono text-[11px] tracking-[0.2em] text-[#1e3a8a]/40">
                  MONBARIL™ / PRO
                </span>
              </div>

              <div className="p-8 space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="company" className={etiquette}>
                      Société *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleInputChange}
                      className={champ}
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className={etiquette}>
                      Votre nom *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className={champ}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className={etiquette}>
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={champ}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={etiquette}>
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={champ}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="sector" className={etiquette}>
                      Votre activité *
                    </label>
                    <select
                      id="sector"
                      name="sector"
                      required
                      value={formData.sector}
                      onChange={handleInputChange}
                      className={`${champ} bp-select !pr-12`}
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
                    <label htmlFor="quantity" className={etiquette}>
                      Quantité envisagée *
                    </label>
                    <select
                      id="quantity"
                      name="quantity"
                      required
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className={`${champ} bp-select !pr-12`}
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
                    <label htmlFor="ral" className={etiquette}>
                      Teinte souhaitée
                    </label>
                    <input
                      type="text"
                      id="ral"
                      name="ral"
                      placeholder="RAL 3020, ou votre code Pantone"
                      value={formData.ral}
                      onChange={handleInputChange}
                      className={champ}
                    />
                  </div>
                  <div>
                    <label htmlFor="deadline" className={etiquette}>
                      Échéance
                    </label>
                    <input
                      type="text"
                      id="deadline"
                      name="deadline"
                      placeholder="Salon en mars, ouverture en juin…"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className={champ}
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer border border-[#1e3a8a]/15 bg-white px-4 py-3">
                  <input
                    type="checkbox"
                    name="logo"
                    checked={formData.logo}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 accent-orange-500"
                  />
                  <span className="text-sm text-[#0a1a3c]">
                    Je souhaite faire marquer mon logo sur les barils
                  </span>
                </label>

                <div>
                  <label htmlFor="message" className={etiquette}>
                    Votre projet
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Usage prévu, contraintes, questions…"
                    className={`${champ} resize-none`}
                  />
                </div>

                <CTAButton
                  type="submit"
                  disabled={isSubmitting}
                  fullWidth
                  className="!rounded-none"
                  showArrow={false}
                >
                  {isSubmitting ? "Envoi en cours..." : "Recevoir mon devis"}
                </CTAButton>

                <p className="text-xs text-[#0a1a3c]/50">
                  Vos informations servent uniquement à établir votre devis.
                  Elles ne sont ni revendues, ni utilisées pour de la
                  prospection.
                </p>
              </div>
            </motion.form>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="bp-paper py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <Repere indice="05 — QUESTIONS" titre="Questions des pros" />

          <div className="border-t border-[#1e3a8a]/15">
            {FAQ_PRO.map((faq) => (
              <div key={faq.id} className="border-b border-[#1e3a8a]/15">
                <button
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  className="w-full py-5 text-left flex items-center gap-5 group"
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[#1e3a8a]/40 shrink-0">
                    {String(faq.id).padStart(2, "0")}
                  </span>
                  <span className="text-[#0a1a3c] flex-1 group-hover:text-orange-500 transition-colors">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: openFAQ === faq.id ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <svg
                      className="w-5 h-5 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="square"
                        strokeWidth={1.5}
                        d="M12 6v12M6 12h12"
                      />
                    </svg>
                  </motion.span>
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
                      <div className="pb-6 pl-12 pr-10 text-[#0a1a3c]/70 leading-relaxed">
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
