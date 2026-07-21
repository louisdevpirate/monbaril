import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Carrières — MonBaril™",
  description: "Rejoindre l'atelier MonBaril. Nous construisons quelque chose de rare.",
};

export default function CareersPage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">

          <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 font-space-grotesk mb-6">
            Atelier · Carrières
          </p>

          <h1 className="text-5xl md:text-7xl text-gray-900 mb-8 leading-none">
            Atelier complet.
          </h1>

          <p className="text-lg text-gray-500 font-space-grotesk leading-relaxed mb-12 max-w-lg mx-auto">
            Nous construisons chaque pièce à la main, dans notre atelier de Messigny-et-Vantoux.
            Pour l&apos;instant, l&apos;équipe est au complet — et nous le faisons exprès.
          </p>

          <div className="w-12 h-px bg-orange-500 mx-auto mb-12" />

          <p className="text-sm text-gray-400 font-space-grotesk">
            Un profil qui sort de l&apos;ordinaire ?{" "}
            <Link
              href="/contact"
              className="text-gray-900 underline underline-offset-4 hover:text-orange-500 transition-colors"
            >
              Écrivez-nous quand même.
            </Link>
          </p>

        </div>
      </main>
      <Footer />
    </>
  );
}
