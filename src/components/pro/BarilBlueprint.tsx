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
/**
 * « Votre logo » tracé à la main, lettres attachées : chaque trait est une
 * courbe de Bézier posée dans le repère du plan, pas un texte mis en forme.
 * C'est ce qui permet de l'écrire au stylo, lettre après lettre, comme le
 * « hello » de l'iPhone — un texte ne peut que s'estomper.
 * Il occupe le panneau central du fût, entre les deux roulures.
 */
const MANUSCRIT = [
  // V
  "M 262 558 C 268 600, 278 628, 292 645 C 302 622, 310 590, 318 558 C 320 585, 322 605, 330 618",
  // o
  "M 330 618 C 334 604, 344 597, 355 598 C 368 599, 376 610, 375 624 C 374 638, 364 646, 352 645 C 340 644, 331 634, 330 618 C 342 648, 360 644, 372 626",
  // t + barre
  "M 372 626 C 378 605, 382 580, 386 562 C 390 590, 391 615, 392 640 C 394 650, 404 650, 412 640",
  "M 374 590 L 404 586",
  // r
  "M 412 640 C 416 620, 419 606, 421 597 C 428 590, 440 593, 442 603 C 443 610, 438 614, 434 616 C 440 622, 444 632, 448 641",
  // e
  "M 448 641 C 452 634, 458 626, 466 620 C 476 612, 484 606, 480 600 C 476 594, 464 596, 460 606 C 455 618, 458 634, 470 641 C 480 646, 492 642, 498 632",
  // l
  "M 540 644 C 548 620, 556 590, 560 570 C 563 556, 556 550, 552 561 C 548 574, 549 602, 553 621 C 556 632, 564 626, 572 618",
  // o
  "M 572 618 C 576 604, 586 597, 597 598 C 610 599, 618 610, 617 624 C 616 638, 606 646, 594 645 C 582 644, 573 634, 572 618 C 584 648, 602 644, 614 626",
  // g
  "M 614 626 C 617 608, 628 598, 640 599 C 652 600, 659 611, 658 625 C 657 638, 648 646, 638 645 C 628 644, 620 636, 619 626 M 658 625 C 656 648, 652 672, 646 685 C 640 697, 628 696, 626 687 C 624 678, 636 672, 650 669 C 662 666, 674 654, 678 626",
  // o
  "M 678 626 C 682 610, 692 600, 704 601 C 717 602, 725 613, 724 627 C 723 641, 713 648, 701 647 C 689 646, 679 638, 678 626",
];

// L'écriture part une fois le fût tracé, plus lentement : une main qui écrit,
// pas une machine qui remplit.
const ecriture = {
  hidden: { pathLength: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    transition: {
      pathLength: { delay: 1.1 + i * 0.22, duration: 0.5, ease: "easeInOut" as const },
    },
  }),
};

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

        {/* « Votre logo » : la partie que le client remplace par la sienne. */}
        {MANUSCRIT.map((d, i) => (
          <motion.path
            key={`ecriture-${i}`}
            variants={ecriture}
            custom={i}
            d={d}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange-500"
            stroke="currentColor"
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
