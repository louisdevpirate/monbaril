import Link from "next/link";
import BarrelGame from "@/components/game/BarrelGame";

export const metadata = {
  title: "404 — Page introuvable",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10 py-16 text-center">
        <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk font-medium">
          +&nbsp;&nbsp;ERREUR 404
        </p>
        <h1
          className="mt-4 font-bold text-gray-900 leading-[0.9] tracking-tight font-bebas-neue uppercase"
          style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}
        >
          Cette page est
          <br />
          tombée dans un <span className="text-orange-500">baril.</span>
        </h1>
        <p className="mt-6 text-gray-500 font-space-grotesk max-w-md mx-auto">
          On l&apos;a cherchée partout dans l&apos;atelier, sans succès.
          En attendant, les fûts dévalent les échafaudages — à vous de jouer.
        </p>

        <div className="mt-10">
          <BarrelGame />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-sm font-space-grotesk hover:bg-orange-600 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/categories"
            className="border border-gray-200 text-gray-900 px-8 py-4 rounded-lg font-semibold text-sm font-space-grotesk hover:bg-gray-50 transition-colors"
          >
            Explorer les collections
          </Link>
        </div>
      </div>
    </div>
  );
}
