export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conditions Générales de Vente
          </h1>
          <p className="text-lg text-gray-600">
            MonBaril™ - Barils industriels transformés en objets d'art
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Contenu */}
        <div className="prose prose-lg max-w-none">
          
          {/* Article 1 - Objet */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 1 - Objet</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre MonBaril™, 
              société spécialisée dans la transformation de barils industriels en objets d'art décoratifs, et ses clients.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Toute commande passée sur notre site web <strong>monbaril.fr</strong> implique l'acceptation sans réserve 
              des présentes conditions générales de vente.
            </p>
          </section>

          {/* Article 2 - Produits */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 2 - Produits</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              MonBaril™ propose des barils industriels authentiques transformés en objets d'art décoratifs uniques. 
              Chaque pièce est soigneusement sélectionnée et transformée par nos artisans.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Tous les produits sont des pièces uniques ou en série limitée</li>
              <li>Les caractéristiques techniques sont communiquées lors de la commande</li>
              <li>Les photographies sont indicatives et peuvent présenter des variations</li>
              <li>MonBaril™ se réserve le droit de modifier ses produits sans préavis</li>
            </ul>
          </section>

          {/* Article 3 - Commandes */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 3 - Commandes</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Les commandes sont passées via notre site web. Le processus de commande comprend :
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
              <li>Sélection des produits dans le panier</li>
              <li>Validation du panier et saisie des informations de livraison</li>
              <li>Paiement sécurisé via Stripe</li>
              <li>Confirmation de commande par email</li>
            </ol>
            <p className="text-gray-700 leading-relaxed">
              MonBaril™ se réserve le droit d'annuler toute commande en cas de non-paiement, 
              de stock insuffisant ou de problème technique.
            </p>
          </section>

          {/* Article 4 - Prix et Paiement */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 4 - Prix et Paiement</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Les prix sont indiqués en euros TTC (Toutes Taxes Comprises) sur le site web. 
              Ils comprennent la TVA française au taux en vigueur.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Modes de paiement acceptés :</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Carte bancaire (Visa, Mastercard, American Express)</li>
                <li>Paiement sécurisé via Stripe</li>
                <li>PayPal (selon disponibilité)</li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Le paiement est exigible à la commande. En cas de paiement par carte bancaire, 
              les données sont cryptées et transmises de manière sécurisée.
            </p>
          </section>

          {/* Article 5 - Livraison */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 5 - Livraison</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Les produits sont livrés à l'adresse indiquée lors de la commande. 
              Les délais de livraison sont communiqués lors de la validation de commande.
            </p>
            <div className="bg-orange-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Délais de livraison :</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>France métropolitaine : 3-5 jours ouvrés</li>
                <li>Europe : 5-10 jours ouvrés</li>
                <li>Produits sur mesure : délai spécifique communiqué</li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Les frais de livraison sont calculés automatiquement selon la destination et le poids. 
              La livraison est effectuée par des transporteurs professionnels.
            </p>
          </section>

          {/* Article 6 - Droit de rétractation */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 6 - Droit de rétractation</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Conformément à la réglementation européenne, vous disposez d'un délai de 14 jours 
              pour exercer votre droit de rétractation à compter de la réception des produits.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Conditions de retour :</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Produits retournés dans leur emballage d'origine</li>
                <li>Produits non endommagés et non utilisés</li>
                <li>Frais de retour à la charge du client</li>
                <li>Remboursement sous 14 jours après réception</li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Pour exercer votre droit de rétractation, contactez-nous à : 
              <strong> contact@monbaril.fr</strong>
            </p>
          </section>

          {/* Article 7 - Garanties */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 7 - Garanties</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              MonBaril™ garantit la conformité de ses produits aux descriptions fournies. 
              En cas de défaut de conformité, nous nous engageons à :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Remplacer le produit défectueux</li>
              <li>Rembourser le prix d'achat</li>
              <li>Prendre en charge les frais de retour</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              La garantie légale de conformité s'applique conformément aux articles L.217-4 et suivants du Code de la consommation.
            </p>
          </section>

          {/* Article 8 - Responsabilité */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 8 - Responsabilité</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              MonBaril™ ne saurait être tenu responsable des dommages indirects résultant de l'utilisation 
              de ses produits ou de l'impossibilité de les utiliser.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Notre responsabilité est limitée au montant de la commande concernée.
            </p>
          </section>

          {/* Article 9 - Propriété intellectuelle */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 9 - Propriété intellectuelle</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Tous les éléments du site MonBaril™ (textes, images, logos, design) sont protégés par le droit d'auteur 
              et appartiennent à MonBaril™ ou à ses partenaires.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
            </p>
          </section>

          {/* Article 10 - Données personnelles */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 10 - Données personnelles</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              MonBaril™ s'engage à protéger vos données personnelles conformément au RGPD. 
              Les données collectées sont utilisées uniquement pour :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Le traitement de votre commande</li>
              <li>La livraison des produits</li>
              <li>L'envoi d'informations commerciales (avec votre accord)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. 
              Pour plus d'informations, consultez notre <a href="/privacy" className="text-orange-500 hover:underline">Politique de confidentialité</a>.
            </p>
          </section>

          {/* Article 11 - Droit applicable */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article 11 - Droit applicable et juridiction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Les présentes CGV sont soumises au droit français. 
              En cas de litige, les tribunaux français seront seuls compétents.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Avant tout recours judiciaire, nous privilégions la résolution amiable des différends.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
