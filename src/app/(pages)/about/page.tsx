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
                L&apos;atelier
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                MonBaril transforme des fûts industriels 200&nbsp;L en pièces
                de design. À la main, en France, un baril à la fois.
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
                  <span className="font-bold font-space-grotesk">MonBaril</span><span className="text-orange-500">™</span> est né en 2024 d&apos;un constat simple&nbsp;:
                  des milliers de fûts métalliques finissent à la casse alors
                  que leur acier peut vivre encore cinquante ans. Nous avons
                  décidé de leur donner une seconde vie — pas en les cachant,
                  en les célébrant.
                </p>
                <p className="text-lg">
                  Chaque baril est sélectionné, décapé puis thermolaqué&nbsp;:
                  une peinture poudre appliquée par procédé électrostatique et
                  cuite au four, pour une finition durable et résistante.
                  Couleur RAL au choix, finition mat, brillant ou
                  grainy&nbsp;: chaque pièce est fabriquée à la commande,
                  jamais stockée.
                </p>
                <p className="text-lg">
                  Le résultat&nbsp;: un objet de caractère qui porte les traces
                  de sa première vie — et le soin de la seconde.
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
              Ce qui guide chaque baril qui sort de l&apos;atelier <span className="font-bold font-space-grotesk">MonBaril</span><span className="text-orange-500">™</span>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "La matière d'abord",
                description: "Des fûts sélectionnés un par un, décapés et traités antirouille avant toute mise en peinture.",
                icon: StarIcon
              },
              {
                title: "Finition thermolaquée",
                description: "Peinture poudre appliquée par procédé électrostatique et cuite au four : résistante aux chocs, aux rayures et aux UV.",
                icon: HammerIcon
              },
              {
                title: "Upcycling",
                description: "Réemployer l'acier existant plutôt que d'en produire du neuf. C'est le cœur du projet.",
                icon: SeedingIcon
              },
              {
                title: "Sur mesure",
                description: "Couleur RAL, texture, finition : votre baril est fabriqué à la demande, jamais sorti d'un stock.",
                icon: LightbulbIcon
              },
              {
                title: "Accompagnement",
                description: "Un interlocuteur direct, de la commande à la livraison. L'atelier répond sous 24 h.",
                icon: HandshakeIcon
              },
              {
                title: "Transparence",
                description: "Prix, procédés, délais : tout est annoncé, rien n'est caché.",
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
                description: "Louis a fondé MonBaril™ avec une conviction : la matière brute mérite mieux que la casse.",
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
              { number: "200 L", label: "D'acier upcyclé par pièce" },
              { number: "98 %", label: "Clients satisfaits" },
              { number: "100 %", label: "Fabriqué en France" },
              { number: "24 h", label: "Réponse atelier" }
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
                  Un baril MonBaril™, c&apos;est environ 20&nbsp;kg d&apos;acier
                  qui ne partent pas à la fonte. Le réemploi consomme une
                  fraction de l&apos;énergie nécessaire à la production
                  d&apos;acier neuf — et conserve ce que la matière a de plus
                  précieux&nbsp;: son vécu.
                </p>
                <p className="text-lg">
                  Nous travaillons avec des peintures durables, fabriquons à la
                  commande pour ne rien produire d&apos;inutile, et concevons
                  chaque pièce pour qu&apos;elle traverse les décennies, pas
                  les tendances.
                </p>
                <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                  <p className="text-lg font-medium text-gray-900">
                    &laquo;&nbsp;Le meilleur déchet est celui qu&apos;on ne
                    produit pas. Le deuxième meilleur devient un
                    baril.&nbsp;&raquo;
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
              Votre baril vous attend
            </h2>
            <p className="text-md text-orange-100 mb-8 max-w-xl mx-auto">
              Parcourez les collections, ou imaginez le vôtre — couleur RAL,
              texture et finition au choix, fabriqué à la commande.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/categories"
                className="bg-white text-orange-500 px-8 py-4 font-semibold text-lg hover:bg-gray-50 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explorer les collections
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