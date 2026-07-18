import Footer from "@/components/sections/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-lg text-gray-600">
            MonBaril™ - Protection de vos données personnelles
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            MonBaril™ s'engage à protéger votre vie privée et vos données personnelles. 
            Cette politique de confidentialité explique comment nous collectons, utilisons, 
            stockons et protégeons vos informations conformément au Règlement Général sur 
            la Protection des Données (RGPD) et à la loi française.
          </p>
        </div>

        {/* Contenu */}
        <div className="prose prose-lg max-w-none">
          
          {/* Article 1 - Responsable du traitement */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 1 - Responsable du traitement</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>MonBaril™</strong> est responsable du traitement de vos données personnelles.
              </p>
              <div className="text-gray-700 space-y-2">
                <p><strong>Raison sociale :</strong> MonBaril™ — entreprise individuelle (SIRET 953 361 540 00016)</p>
                <p><strong>Email :</strong> contact@monbaril.fr</p>
                <p><strong>Adresse :</strong> 7 rue des Lavières, 21380 Messigny-et-Vantoux, France</p>
              </div>
            </div>
          </section>

          {/* Article 2 - Données collectées */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 2 - Données collectées</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous collectons les données personnelles suivantes :
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Données d'identification</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Adresse de livraison</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Données de navigation</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Adresse IP</li>
                  <li>Type de navigateur</li>
                  <li>Pages visitées</li>
                  <li>Durée de visite</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Données de commande</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Historique des commandes</li>
                <li>Préférences produits</li>
                <li>Informations de paiement (cryptées)</li>
                <li>Données de livraison</li>
              </ul>
            </div>
          </section>

          {/* Article 3 - Finalités du traitement */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 3 - Finalités du traitement</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vos données personnelles sont utilisées pour les finalités suivantes :
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion des commandes</h3>
                <p className="text-gray-700">Traitement, expédition et suivi de vos commandes</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Service client</h3>
                <p className="text-gray-700">Répondre à vos questions et résoudre vos problèmes</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Communication marketing</h3>
                <p className="text-gray-700">Envoi de newsletters et offres promotionnelles (avec votre consentement)</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Amélioration du site</h3>
                <p className="text-gray-700">Analyse du comportement pour améliorer l'expérience utilisateur</p>
              </div>
            </div>
          </section>

          {/* Article 4 - Base légale */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 4 - Base légale du traitement</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                Le traitement de vos données repose sur les bases légales suivantes :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Exécution du contrat :</strong> Pour traiter vos commandes</li>
                <li><strong>Intérêt légitime :</strong> Pour améliorer nos services</li>
                <li><strong>Consentement :</strong> Pour les communications marketing</li>
                <li><strong>Obligation légale :</strong> Pour la comptabilité et la facturation</li>
              </ul>
            </div>
          </section>

          {/* Article 5 - Partage des données */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 5 - Partage des données</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vos données personnelles ne sont jamais vendues à des tiers. Elles peuvent être partagées avec :
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Prestataires de services</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Transporteurs (livraison)</li>
                  <li>Stripe (paiement sécurisé)</li>
                  <li>Hébergeur web</li>
                  <li>Service d'email</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Obligations légales</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Autorités fiscales</li>
                  <li>Forces de l'ordre</li>
                  <li>Tribunaux</li>
                  <li>Organismes de contrôle</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Article 6 - Conservation des données */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 6 - Durée de conservation</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous conservons vos données personnelles pendant les durées suivantes :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Données de commande :</strong> 10 ans (obligation comptable)</li>
                <li><strong>Données de contact :</strong> 3 ans après dernier contact</li>
                <li><strong>Données de navigation :</strong> 13 mois maximum</li>
                <li><strong>Newsletter :</strong> Jusqu'au désabonnement</li>
              </ul>
            </div>
          </section>

          {/* Article 7 - Vos droits */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 7 - Vos droits</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Droit d'accès</h3>
                <p className="text-sm text-gray-700">Consulter vos données personnelles</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Droit de rectification</h3>
                <p className="text-sm text-gray-700">Corriger des données inexactes</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Droit d'effacement</h3>
                <p className="text-sm text-gray-700">Supprimer vos données</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Droit à la portabilité</h3>
                <p className="text-sm text-gray-700">Récupérer vos données</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Droit d'opposition</h3>
                <p className="text-sm text-gray-700">Vous opposer au traitement</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Droit de limitation</h3>
                <p className="text-sm text-gray-700">Limiter le traitement</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Comment exercer vos droits ?</h3>
              <p className="text-gray-700 mb-2">
                Pour exercer vos droits, contactez-nous à : <strong>contact@monbaril.fr</strong>
              </p>
              <p className="text-gray-700">
                Nous vous répondrons dans un délai d'un mois. En cas de litige, 
                vous pouvez saisir la CNIL : <a href="https://www.cnil.fr" className="text-orange-500 hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
              </p>
            </div>
          </section>

          {/* Article 8 - Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 8 - Cookies et technologies similaires</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Notre site utilise des cookies pour améliorer votre expérience de navigation :
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies essentiels</h3>
                <p className="text-gray-700">Nécessaires au fonctionnement du site (panier, session)</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies analytiques</h3>
                <p className="text-gray-700">Mesure d'audience et statistiques de visite</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies marketing</h3>
                <p className="text-gray-700">Personnalisation des publicités (avec votre consentement)</p>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mt-4">
              Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur 
              ou notre bannière de consentement.
            </p>
          </section>

          {/* Article 9 - Sécurité */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 9 - Sécurité des données</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mesures techniques</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Chiffrement SSL/TLS</li>
                  <li>Serveurs sécurisés</li>
                  <li>Sauvegardes régulières</li>
                  <li>Contrôle d'accès</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mesures organisationnelles</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Formation du personnel</li>
                  <li>Procédures de sécurité</li>
                  <li>Audits réguliers</li>
                  <li>Accès limité aux données</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Article 10 - Transferts internationaux */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 10 - Transferts internationaux</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vos données sont principalement stockées en France. En cas de transfert vers des pays tiers, 
              nous nous assurons que des garanties appropriées sont en place :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Décision d'adéquation de la Commission européenne</li>
              <li>Clauses contractuelles types</li>
              <li>Certification Privacy Shield (si applicable)</li>
              <li>Codes de conduite approuvés</li>
            </ul>
          </section>

          {/* Article 11 - Modifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 11 - Modifications de la politique</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cette politique de confidentialité peut être modifiée pour refléter les changements 
              dans nos pratiques ou pour des raisons légales.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Toute modification importante vous sera notifiée par email ou via un avis sur notre site. 
              Nous vous encourageons à consulter régulièrement cette page.
            </p>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
}
