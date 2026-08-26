import Image from "next/image";
import Link from "next/link";

/**
 * Dernier bloc de la page : c'est un appel à l'achat, pas un formulaire de
 * contact. Il ferme le parcours sur l'action qui compte — le contact reste
 * accessible depuis la navigation et en lien discret ici.
 *
 * Volontairement synchrone : le composant est aussi rendu depuis la page
 * « À propos », qui est un composant client et ne peut pas accueillir de
 * composant serveur asynchrone. D'où l'absence de prix, déjà affiché deux
 * fois plus haut.
 */
export default function ContactSection({
  /** Masqué sur la page contact elle-même, où le lien pointerait sur place. */
  showContactLink = true,
}: {
  showContactLink?: boolean;
}) {
  return (
    // `pt-20` comme les autres sections : sans lui, l'écart au-dessus de la
    // bannière valait la moitié de celui qui sépare les autres blocs.
    <section className="px-6 lg:px-8 pt-20 mb-16">
      <div className="max-w-[95%] mx-auto">
        <div
          className="relative bg-orange-500 px-8 md:px-16 py-16 md:py-20 overflow-hidden"
          style={{ borderRadius: "60px 60px 60px 10px" }}
        >
          {/* Étoile décorative */}
          <Image
            src="/images/star.svg"
            alt=""
            width={60}
            height={60}
            className="absolute top-8 left-8 opacity-50"
          />

          {/* Rond décoratif */}
          <div
            className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full hidden md:block"
            style={{ backgroundColor: "rgba(255, 161, 122, 0.5)" }}
          />

          {/* Contenu */}
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-bebas-neue uppercase tracking-wide text-white leading-[0.95]">
              Composez
              <br />
              le vôtre
            </h2>
            <p className="mt-4 text-white/80 text-base font-space-grotesk max-w-md">
              213 teintes RAL, trois finitions, thermolaqué à la commande dans
              notre atelier.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-4 mt-8">
              <Link
                href="/products/baril-monochrome"
                className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-sm font-space-grotesk hover:bg-black transition-colors text-center"
              >
                Composer mon baril →
              </Link>
              {showContactLink && (
                <Link
                  href="/contact"
                  className="text-sm font-space-grotesk text-white/80 hover:text-white transition-colors text-center sm:text-left underline underline-offset-4"
                >
                  Une question ? Écrivez-nous
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
