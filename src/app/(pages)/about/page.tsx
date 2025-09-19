"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { StarIcon, HammerIcon, SeedingIcon, LightbulbIcon, HandshakeIcon, SearchIcon } from "@/components/icons/icons";
import Footer from "@/components/sections/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
                À propos de nous
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Découvrez l'histoire passionnante derrière la révolution des barils 
                premium et notre engagement pour une qualité exceptionnelle.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20 bg-white">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Notre Histoire
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Fondée en 2024, <span className="font-bold font-space-grotesk">MonBaril</span><span className="text-orange-500">™</span> est née d'une passion pour l'artisanat 
                  et la qualité exceptionnelle. Notre mission est simple : révolutionner 
                  l'industrie des barils en proposant des produits d'exception qui 
                  allient tradition et innovation.
                </p>
                <p className="text-lg">
                  Chaque baril <span className="font-bold font-space-grotesk">MonBaril</span><span className="text-orange-500">™</span> est le fruit d'un savoir-faire ancestral 
                  transmis de génération en génération, combiné aux technologies 
                  les plus avancées pour garantir une qualité irréprochable.
                </p>
                <p className="text-lg">
                  Nous croyons fermement que chaque détail compte, de la sélection 
                  des matériaux jusqu'à la finition parfaite de nos produits.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-96 lg:h-[500px] overflow-hidden shadow-2xl">
                <Image
                  src="/images/products/japan.png"
                  alt="Atelier MonBaril - Fabrication artisanale"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les principes qui guident notre entreprise et façonnent chaque produit <span className="font-bold font-space-grotesk">MonBaril</span><span className="text-orange-500">™</span>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Qualité Exceptionnelle",
                description: "Chaque baril est soumis à des contrôles rigoureux pour garantir une qualité irréprochable.",
                icon: StarIcon
              },
              {
                title: "Artisanat Traditionnel",
                description: "Nous préservons les techniques ancestrales tout en intégrant l'innovation moderne.",
                icon: HammerIcon
              },
              {
                title: "Durabilité",
                description: "Nos produits sont conçus pour durer, réduisant l'impact environnemental.",
                icon: SeedingIcon
              },
              {
                title: "Innovation",
                description: "Nous repoussons constamment les limites pour améliorer nos produits.",
                icon: LightbulbIcon
              },
              {
                title: "Service Client",
                description: "Votre satisfaction est notre priorité absolue, avec un support exceptionnel.",
                icon: HandshakeIcon
              },
              {
                title: "Transparence",
                description: "Nous communiquons ouvertement sur nos processus et nos engagements.",
                icon: SearchIcon
              }
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="mb-4 text-orange-500">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="py-20 bg-white">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des artisans passionnés et des experts dédiés à l'excellence MonBaril<span className="text-orange-500">™</span>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Louis Martin",
                role: "Fondateur & CEO",
                description: "Passionné d'artisanat depuis 15 ans, Louis a créé MonBaril™ pour révolutionner l'industrie.",
                image: "/images/products/street.png"
              },
              {
                name: "Sophie Dubois",
                role: "Directrice Qualité",
                description: "Ingénieure spécialisée, Sophie garantit l'excellence de chaque produit MonBaril™.",
                image: "/images/products/japan-white.png"
              },
              {
                name: "Pierre Leroy",
                role: "Maître Artisan",
                description: "Avec 30 ans d'expérience, Pierre transmet son savoir-faire ancestral à notre équipe.",
                image: "/images/products/texaco.png"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                  <Image
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-orange-500 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-20 bg-orange-500">
        <div className="max-w-[95%]">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "1000+", label: "Barils Vendus" },
              { number: "98%", label: "Clients Satisfaits" },
              { number: "15", label: "Années d'Expérience" },
              { number: "24/7", label: "Support Client" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement */}
      <section className="py-20 bg-white">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full h-full overflow-hidden shadow-2xl aspect-square">
                <Image
                  src="/images/products/green.png"
                  alt="Engagement MonBaril - Qualité et durabilité"
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <SeedingIcon className="w-8 h-8 text-green-500 mb-4" />
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Notre Engagement
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Chez MonBaril™, nous nous engageons à fournir des produits 
                  d'exception qui respectent l'environnement et répondent aux 
                  besoins les plus exigeants de nos clients.
                </p>
                <p className="text-lg">
                  Notre engagement va au-delà de la simple vente de produits. 
                  Nous construisons des relations durables avec nos clients 
                  et nous nous efforçons de contribuer positivement à notre communauté.
                </p>
                <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                  <p className="text-lg font-medium text-gray-900">
                    "Chaque baril MonBaril™ est une promesse de qualité, 
                    de durabilité et d'excellence artisanale."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-[95%] mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Rejoignez la Révolution MonBaril<span className="text-orange-200">™</span>
            </h2>
            <p className="text-md text-orange-100 mb-8 max-w-xl mx-auto">
              Découvrez notre collection exclusive et faites l'expérience 
              de la qualité exceptionnelle qui nous distingue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/collections"
                className="bg-white text-orange-500 px-8 py-4 font-semibold text-lg hover:bg-gray-50 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Découvrir nos Collections
              </motion.a>
              <motion.a
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 font-semibold text-lg hover:bg-white hover:text-orange-500 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Nous Contacter
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}