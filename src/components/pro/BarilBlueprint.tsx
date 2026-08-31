"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Élévation cotée du fût 200 L, dessinée en SVG plutôt qu'exportée en image :
 * net à toutes les tailles, quelques kilo-octets, et les cotes restent du texte
 * — donc lisibles par un lecteur d'écran comme par un moteur de recherche.
 *
 * Les dimensions du dessin sont celles du fût réel (Ø 590, H 910), à l'échelle
 * 1:1 dans le repère SVG : une unité = un millimètre.
 */

const X1 = 200; // flanc gauche du corps
const X2 = 790; // flanc droit  (590 mm de diamètre)
const XC = (X1 + X2) / 2;
const Y1 = 160; // haut du fût
const Y2 = 1070; // bas du fût  (910 mm de hauteur)
const DEB = 6; // débord des bourrelets et des roulures
const H1 = Y1 + (Y2 - Y1) / 3; // première roulure
const H2 = Y1 + (2 * (Y2 - Y1)) / 3; // seconde roulure

// Un tracé de longueur nulle est déjà invisible : animer l'opacité en plus
// écraserait les opacités fines posées sur l'axe et les bondes, que framer
// réécrirait à 1 en fin d'animation.
const trace = {
  hidden: { pathLength: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    transition: {
      pathLength: { delay: 0.15 + i * 0.09, duration: 0.9, ease: "easeInOut" as const },
    },
  }),
};

function Fleche({ x, y, dir }: { x: number; y: number; dir: "l" | "r" | "u" | "d" }) {
  const p = {
    l: `${x},${y} ${x + 14},${y - 5} ${x + 14},${y + 5}`,
    r: `${x},${y} ${x - 14},${y - 5} ${x - 14},${y + 5}`,
    u: `${x},${y} ${x - 5},${y + 14} ${x + 5},${y + 14}`,
    d: `${x},${y} ${x - 5},${y - 14} ${x + 5},${y - 14}`,
  }[dir];
  return <polygon points={p} fill="currentColor" opacity={0.75} />;
}

export default function BarilBlueprint({ className = "" }: { className?: string }) {
  // Le tracé n'existe que par l'animation : sans elle, le dessin resterait
  // invisible. Qui demande moins de mouvement reçoit donc le plan déjà tracé,
  // pas une planche vide.
  const sansMouvement = useReducedMotion();
  const animation = sansMouvement
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.2 },
      };

  return (
    <svg
      viewBox="0 0 900 1230"
      className={className}
      fill="none"
      role="img"
      aria-label="Élévation technique cotée du fût métallique 200 litres : diamètre 590 millimètres, hauteur 910 millimètres, tôle d'acier de 1 millimètre."
    >
      <motion.g {...animation} stroke="currentColor" strokeLinecap="square">
        {/* Axe de symétrie : trait d'axe mixte, comme sur un plan. */}
        <motion.line
          custom={0}
          variants={trace}
          x1={XC}
          y1={110}
          x2={XC}
          y2={1120}
          strokeWidth={1}
          strokeDasharray="26 7 4 7"
          opacity={0.4}
        />

        {/* Corps du fût */}
        <motion.path
          custom={1}
          variants={trace}
          d={`M ${X1} ${Y1} L ${X1} ${Y2} M ${X2} ${Y1} L ${X2} ${Y2}`}
          strokeWidth={2.5}
        />

        {/* Bourrelets haut et bas, légèrement plus larges que le corps */}
        {[Y1, Y2 - 20].map((y, i) => (
          <motion.rect
            key={`chime-${i}`}
            custom={2 + i}
            variants={trace}
            x={X1 - DEB}
            y={y}
            width={X2 - X1 + DEB * 2}
            height={20}
            strokeWidth={2.5}
          />
        ))}

        {/* Roulures de roulage */}
        {[H1, H2].map((y, i) => (
          <motion.rect
            key={`hoop-${i}`}
            custom={4 + i}
            variants={trace}
            x={X1 - DEB}
            y={y - 11}
            width={X2 - X1 + DEB * 2}
            height={22}
            strokeWidth={2}
          />
        ))}

      </motion.g>

      {/* ── Cotation ────────────────────────────────────────────── */}
      <g stroke="currentColor" fill="none" opacity={0.85}>
        {/* Diamètre : ligne de cote horizontale au-dessus */}
        <line x1={X1} y1={Y1 - 12} x2={X1} y2={78} strokeWidth={1} opacity={0.5} />
        <line x1={X2} y1={Y1 - 12} x2={X2} y2={78} strokeWidth={1} opacity={0.5} />
        <line x1={X1} y1={92} x2={X2} y2={92} strokeWidth={1} />
        <Fleche x={X1} y={92} dir="l" />
        <Fleche x={X2} y={92} dir="r" />

        {/* Hauteur : ligne de cote verticale à gauche */}
        <line x1={X1 - 12} y1={Y1} x2={126} y2={Y1} strokeWidth={1} opacity={0.5} />
        <line x1={X1 - 12} y1={Y2} x2={126} y2={Y2} strokeWidth={1} opacity={0.5} />
        <line x1={140} y1={Y1} x2={140} y2={Y2} strokeWidth={1} />
        <Fleche x={140} y={Y1} dir="u" />
        <Fleche x={140} y={Y2} dir="d" />

        {/* Renvoi de détail sur la roulure haute */}
        <circle cx={X2} cy={H1} r={38} strokeWidth={1} opacity={0.55} />
        <line x1={X2 + 27} y1={H1 - 27} x2={846} y2={H1 - 78} strokeWidth={1} opacity={0.55} />
      </g>

      <g className="font-mono" fill="currentColor" opacity={0.9}>
        <text x={XC} y={74} textAnchor="middle" fontSize={34} letterSpacing="1">
          Ø 590
        </text>
        <text
          x={116}
          y={(Y1 + Y2) / 2}
          textAnchor="middle"
          fontSize={34}
          letterSpacing="1"
          transform={`rotate(-90 116 ${(Y1 + Y2) / 2})`}
        >
          910
        </text>
        <text x={856} y={H1 - 86} fontSize={30} letterSpacing="1" opacity={0.75}>
          A
        </text>
        {/* La surface que le client achète : on la nomme. */}
        <text
          x={XC}
          y={(H1 + H2) / 2 + 12}
          textAnchor="middle"
          fontSize={44}
          letterSpacing="6"
          className="text-orange-500"
          fill="currentColor"
        >
          VOTRE LOGO
        </text>
        <text x={X1} y={Y2 + 62} fontSize={26} letterSpacing="2" opacity={0.6}>
          ACIER — TÔLE 1.0 mm
        </text>
        <text x={X1} y={Y2 + 100} fontSize={26} letterSpacing="2" opacity={0.6}>
          THERMOLAQUAGE RAL AU CHOIX
        </text>
      </g>
    </svg>
  );
}
