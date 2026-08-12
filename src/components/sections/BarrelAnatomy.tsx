import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

/**
 * Anatomie du baril — le produit au centre, les arguments reliés par des
 * traits pointillés. Sur mobile, les traits disparaissent et les points
 * passent sous l'image : une ligne de rappel diagonale n'y serait pas lisible.
 */

interface Callout {
  title: string;
  text: string;
}

const LEFT: Callout[] = [
  {
    title: "Fût 200 L authentique",
    text: "Récupéré après sa vie industrielle, décapé puis traité antirouille dans notre atelier.",
  },
  {
    title: "Pièce unique",
    text: "Les marques de son passé restent visibles. Aucun baril ne ressemble exactement à un autre.",
  },
];

const RIGHT: Callout[] = [
  {
    title: "Thermolaquage au four",
    text: "Peinture poudre électrostatique cuite au four : une finition dure qui ne s'écaille pas.",
  },
  {
    title: "213 teintes RAL",
    text: "La teinte exacte de votre intérieur, en finition brillante, mate ou grainée.",
  },
];

function CalloutBlock({
  callout,
  side,
}: {
  callout: Callout;
  side: "left" | "right";
}) {
  const isLeft = side === "left";
  return (
    <div
      className={`flex items-center gap-4 ${
        isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      <div className={`flex-1 ${isLeft ? "lg:text-right" : "lg:text-left"}`}>
        <h3 className="text-lg font-bold text-gray-900 font-space-grotesk">
          {callout.title}
        </h3>
        <p className="mt-1.5 text-sm text-gray-500 leading-relaxed font-space-grotesk">
          {callout.text}
        </p>
      </div>
      {/* Trait de rappel — desktop uniquement */}
      <div
        aria-hidden
        className="hidden lg:block w-16 xl:w-24 shrink-0 border-t border-dashed border-gray-300"
      />
    </div>
  );
}

export default function BarrelAnatomy() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        <Reveal className="mb-14 max-w-2xl">
          <p className="text-orange-500 text-xs tracking-[0.3em] font-space-grotesk font-medium">
            +&nbsp;&nbsp;ANATOMIE
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold font-bebas-neue uppercase tracking-tight text-gray-900 leading-[0.9]">
            Ce qu&apos;il y a derrière un baril
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 lg:gap-6 items-center">
            {/* Colonne gauche */}
            <div className="order-2 lg:order-1 flex flex-col gap-12 lg:gap-24">
              {LEFT.map((c) => (
                <CalloutBlock key={c.title} callout={c} side="left" />
              ))}
            </div>

            {/* Le baril */}
            <div className="order-1 lg:order-2 relative w-full max-w-[260px] lg:max-w-none lg:w-[320px] xl:w-[380px] mx-auto aspect-[3/5]">
              <Image
                src="/customizer/base/preview/brillantnobg.png"
                alt="Fût métallique 200 L MonBaril"
                fill
                sizes="(max-width: 1024px) 260px, 380px"
                className="object-contain"
              />
            </div>

            {/* Colonne droite */}
            <div className="order-3 flex flex-col gap-12 lg:gap-24">
              {RIGHT.map((c) => (
                <CalloutBlock key={c.title} callout={c} side="right" />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
