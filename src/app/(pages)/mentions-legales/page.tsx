import Footer from "@/components/sections/Footer";

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mentions légales
          </h1>
          <p className="text-lg text-gray-600">
            MonBaril™ — Barils industriels transformés en objets d&apos;art
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          {/* Article 1 - Éditeur du site */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Éditeur du site
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg text-gray-700 space-y-2">
              <p>
                <strong>Nom commercial :</strong> MonBaril™
              </p>
              <p>
                <strong>Forme juridique :</strong> Entreprise individuelle
                (micro-entrepreneur)
              </p>
              <p>
                <strong>Exploitant :</strong> Louis Dole
              </p>
              <p>
                <strong>SIRET :</strong> 953 361 540 00016
              </p>
              <p>
                <strong>SIREN :</strong> 953 361 540
              </p>
              <p>
                <strong>Adresse du siège :</strong> 7 rue des Lavières, 21380
                Messigny-et-Vantoux, France
              </p>
              <p>
                <strong>Email :</strong> contact@monbaril.fr
              </p>
              <p>
                <strong>Directeur de la publication :</strong> Louis Dole
              </p>
            </div>
          </section>

          {/* Article 2 - Hébergement */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Hébergement
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg text-gray-700 space-y-2">
              <p>
                <strong>Hébergeur :</strong> Vercel Inc.
              </p>
              <p>
                <strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA
                91723, États-Unis
              </p>
              <p>
                <strong>Site web :</strong>{" "}
                <a
                  href="https://vercel.com"
                  className="text-orange-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  vercel.com
                </a>
              </p>
            </div>
          </section>

          {/* Article 3 - Activité */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Activité
            </h2>
            <p className="text-gray-700 leading-relaxed">
              MonBaril™ conçoit et vend des fûts métalliques industriels de
              200 litres, décapés, traités et thermolaqués à la commande, à
              destination des particuliers et professionnels souhaitant
              acquérir une pièce de décoration ou de mobilier unique.
            </p>
          </section>

          {/* Article 4 - Propriété intellectuelle */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Propriété intellectuelle
            </h2>
            <p className="text-gray-700 leading-relaxed">
              L&apos;ensemble des éléments du site monbaril.fr (textes, images,
              logos, mises en forme, code) est protégé par le droit
              d&apos;auteur et le droit des marques. Toute reproduction,
              représentation ou exploitation, totale ou partielle, sans
              autorisation écrite préalable de MonBaril™, est interdite et
              constitutive de contrefaçon.
            </p>
          </section>

          {/* Article 5 - Médiation de la consommation */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Médiation de la consommation
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Conformément aux articles L.616-1 et R.616-1 du Code de la
              consommation, tout consommateur a le droit de recourir
              gratuitement à un médiateur de la consommation en vue de la
              résolution amiable d&apos;un litige l&apos;opposant à MonBaril™,
              après démarche écrite préalable auprès de notre service
              client (contact@monbaril.fr).
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Médiateur désigné :</strong> [À COMPLÉTER — MonBaril™
              n&apos;a pas encore adhéré à un médiateur de la consommation ;
              cette information sera ajoutée dès l&apos;adhésion effective,
              obligatoire avant toute mise en avant].
            </p>
          </section>

          {/* Article 6 - Droit applicable */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Droit applicable
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Les présentes mentions légales sont soumises au droit français.
              Pour toute question relative au site ou à son contenu, contactez
              contact@monbaril.fr.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
