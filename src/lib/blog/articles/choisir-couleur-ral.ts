import type { Article } from "../types";

const article: Article = {
  slug: "choisir-couleur-ral",
  titre: "Comment choisir sa couleur RAL sans se tromper",
  titreSeo: "Choisir une couleur RAL : le guide pratique",
  description:
    "Lire un code RAL, comprendre pourquoi l'écran trompe, éviter les pièges de la lumière et de la finition : la méthode pour choisir la bonne teinte pour du métal.",
  extrait:
    "RAL 7016, RAL 9005, RAL 2008… Comment lire un code RAL, pourquoi une couleur n'a jamais le même rendu à l'écran et en vrai, et la méthode pour choisir la bonne teinte pour un meuble en métal.",
  rubrique: "Couleur",
  publieLe: "2026-07-21",
  image: {
    src: "/images/thermolaquage/blue-swedish.png",
    alt: "Baril thermolaqué bleu nuit brillant dans un séjour aux tons bois, cuir noir et vert",
  },
  motsCles: [
    "couleur RAL",
    "nuancier RAL",
    "choisir couleur RAL",
    "code RAL signification",
    "RAL 7016",
    "RAL 9005",
  ],
  corps: [
    {
      type: "p",
      texte:
        "Choisir une couleur sur un écran est trompeur. La choisir pour un objet qui va trôner au milieu du salon pendant des années l'est encore plus. Le nuancier RAL simplifie beaucoup les choses, à condition de savoir comment il fonctionne et de connaître ses pièges. Ce guide reprend les conseils que nous donnons aux clients qui hésitent entre deux teintes.",
    },
    { type: "h2", texte: "Qu'est-ce que le nuancier RAL ?" },
    {
      type: "p",
      texte:
        "RAL est un système de référence des couleurs né en Allemagne. Son premier registre, publié en 1927, ne comptait qu'une quarantaine de teintes. L'idée était simple : remplacer les descriptions approximatives (« vert foncé », « gris clair ») et les échantillons échangés entre fournisseurs par un code unique, que tout le monde peut commander et reproduire à l'identique.",
    },
    {
      type: "p",
      texte:
        "La collection la plus utilisée aujourd'hui, **RAL Classic**, compte un peu plus de deux cents teintes. C'est la référence de l'industrie du métal, de la menuiserie et du thermolaquage : un fabricant de poudre en Italie et un atelier en Bourgogne parlent exactement de la même couleur quand ils écrivent « RAL 3020 ». D'autres collections existent, comme RAL Design, beaucoup plus nuancée, mais elles restent peu employées en peinture poudre.",
    },
    { type: "h2", texte: "Comment lire un code RAL" },
    {
      type: "p",
      texte:
        "Un code RAL Classic se compose de quatre chiffres. Le premier indique la famille de couleur ; les trois suivants identifient la teinte au sein de cette famille.",
    },
    {
      type: "tableau",
      entetes: ["Premier chiffre", "Famille", "Exemples"],
      lignes: [
        ["1", "Jaunes et beiges", "RAL 1013 Blanc perlé, RAL 1023 Jaune signalisation"],
        ["2", "Oranges", "RAL 2004 Orangé pur, RAL 2008 Orangé rouge clair"],
        ["3", "Rouges et roses", "RAL 3020 Rouge signalisation, RAL 3015 Rose clair"],
        ["4", "Violets", "RAL 4006 Pourpre signalisation"],
        ["5", "Bleus", "RAL 5010 Bleu gentiane, RAL 5024 Bleu pastel"],
        ["6", "Verts", "RAL 6005 Vert mousse, RAL 6027 Vert clair"],
        ["7", "Gris", "RAL 7016 Gris anthracite, RAL 7035 Gris clair"],
        ["8", "Bruns", "RAL 8017 Brun chocolat"],
        ["9", "Blancs et noirs", "RAL 9005 Noir foncé, RAL 9010 Blanc pur"],
      ],
    },
    {
      type: "p",
      texte:
        "Les noms (« Gris anthracite », « Bleu gentiane ») aident à se repérer, mais **seul le code fait foi**. Deux fournisseurs peuvent traduire un nom différemment ; aucun ne se trompe sur un code.",
    },
    {
      type: "p",
      texte:
        "Certaines teintes portent la mention **nacré** — RAL 1036 Or nacré, RAL 5026 Bleu nuit nacré, RAL 9023 Gris foncé nacré. Elles contiennent des pigments à effet qui font varier la couleur selon l'angle de vue, et leur rendu est encore plus difficile à juger sur un écran.",
    },
    { type: "h2", texte: "Pourquoi l'écran ne montre jamais la couleur réelle" },
    {
      type: "p",
      texte:
        "C'est la première source de déception, et elle n'a rien à voir avec la qualité de la peinture. Un écran fabrique une couleur en émettant de la lumière rouge, verte et bleue ; une surface peinte, elle, renvoie une partie de la lumière qui l'éclaire. Les deux systèmes ne se superposent jamais parfaitement. S'y ajoutent le réglage de votre écran, sa luminosité, le filtre de lumière bleue activé le soir sur le téléphone.",
    },
    {
      type: "p",
      texte:
        "Sur notre [configurateur](/products/baril-monochrome), l'aperçu de chaque teinte est une approximation aussi fidèle que possible, mais c'est le code RAL qui sert à la fabrication. Si vous hésitez vraiment, le seul arbitre fiable reste un nuancier physique, consulté à la lumière du jour.",
    },
    { type: "h2", texte: "Quatre effets qui changent la perception d'une couleur" },
    { type: "h3", texte: "L'effet de surface" },
    {
      type: "p",
      texte:
        "Une couleur appliquée sur une grande surface paraît plus claire et plus intense que sur une petite pastille. Un fût offre près de deux mètres carrés de tôle visible : rien à voir avec un échantillon de quelques centimètres. Entre deux teintes proches, la plus sobre est souvent la bonne.",
    },
    { type: "h3", texte: "La lumière de la pièce" },
    {
      type: "p",
      texte:
        "Une lumière venue du nord, froide et diffuse, tire les couleurs vers le bleu et les assombrit. Une pièce orientée au sud, ou éclairée le soir par des ampoules chaudes, les réchauffe. Un gris neutre peut ainsi paraître légèrement bleuté le matin et presque beige le soir.",
    },
    { type: "h3", texte: "La finition" },
    {
      type: "p",
      texte:
        "À teinte égale, une finition brillante paraît plus profonde et plus saturée, une finition mate plus douce et légèrement plus claire, une finition grainée plus nuancée, car sa texture crée de minuscules ombres. Nous détaillons ces trois aspects dans notre article sur [le thermolaquage](/blog/thermolaquage-definition-etapes-avantages).",
    },
    { type: "h3", texte: "Les couleurs voisines" },
    {
      type: "p",
      texte:
        "Une couleur ne se voit jamais seule. Devant un mur blanc, un orange paraît éclatant ; devant un mur vert sauge, il tire presque vers le rouge. Le sol, le canapé et les rideaux influencent tous la perception.",
    },
    { type: "h2", texte: "La méthode en cinq étapes" },
    {
      type: "liste",
      ordonnee: true,
      items: [
        "**Décidez du rôle de l'objet.** Doit-il se fondre dans le décor ou attirer le regard ? Une pièce discrète reprend une couleur déjà présente ; une pièce forte prend le contre-pied.",
        "**Partez de ce qui ne bougera pas.** Sol, murs, grand canapé : ce sont eux qui dictent la palette, pas l'inverse.",
        "**Réduisez à trois teintes candidates**, en notant leurs codes RAL.",
        "**Comparez en situation**, pastilles posées à l'endroit exact où ira l'objet, le matin puis le soir.",
        "**Choisissez la finition en dernier** : brillant pour le caractère, mat pour la sobriété, grainé pour la matière.",
      ],
    },
    { type: "h2", texte: "Les teintes RAL qui réussissent le mieux à un baril" },
    {
      type: "p",
      texte:
        "Toutes les couleurs peuvent fonctionner, mais certaines tirent particulièrement parti de la forme d'un fût et de ses cerclages. Pour ses mesures exactes, voir notre fiche sur [le fût métallique de 200 litres](/blog/fut-metallique-200-litres-dimensions-poids).",
    },
    {
      type: "liste",
      items: [
        "**RAL 9005 Noir foncé** : le plus polyvalent. En mat, une allure de mobilier contemporain ; en brillant, un rendu très carrosserie.",
        "**RAL 7016 Gris anthracite** : la teinte des menuiseries modernes, qui s'accorde naturellement avec des fenêtres anthracite ou une cuisine sombre.",
        "**RAL 2008 Orangé rouge clair** : l'orange industriel, qui évoque les engins et les machines. À réserver aux intérieurs qui assument une pièce forte.",
        "**RAL 5024 Bleu pastel** et **RAL 6027 Vert clair** : des teintes douces qui font basculer le baril du côté vintage plutôt qu'atelier.",
        "**RAL 8017 Brun chocolat** : chaud et discret, parfait avec le bois et le cuir.",
        "**RAL 3020 Rouge signalisation** : l'accent racing, spectaculaire en brillant.",
      ],
    },
    {
      type: "p",
      texte:
        "Toutes figurent parmi les favoris affichés sur notre configurateur, qui donne accès à 213 teintes RAL au total.",
    },
    {
      type: "encadre",
      titre: "Un doute entre deux teintes ?",
      texte:
        "Écrivez-nous en indiquant les deux codes RAL et, si possible, une photo de la pièce où ira le baril. Nous vous répondons personnellement.",
      lien: { libelle: "Nous écrire →", href: "/contact" },
    },
  ],
  faq: [
    {
      question: "Combien y a-t-il de couleurs RAL ?",
      reponse:
        "La collection RAL Classic, la plus utilisée pour le métal et le thermolaquage, compte un peu plus de deux cents teintes. Notre configurateur en propose 213. D'autres collections, comme RAL Design, en comptent bien davantage mais sont peu employées en peinture poudre.",
    },
    {
      question: "Quelle est la couleur RAL la plus utilisée ?",
      reponse:
        "Il n'existe pas de classement officiel. Le RAL 7016 Gris anthracite est toutefois omniprésent en menuiserie et en façade, tout comme les blancs RAL 9010 et RAL 9016 et le noir RAL 9005.",
    },
    {
      question: "Pourquoi la couleur reçue diffère-t-elle de l'écran ?",
      reponse:
        "Parce qu'un écran émet de la lumière alors qu'une surface peinte la réfléchit : les deux ne coïncident jamais parfaitement, et chaque écran est réglé différemment. Le code RAL, lui, est normalisé : c'est lui qui garantit la teinte, pas l'aperçu.",
    },
    {
      question: "Mat ou brillant : lequel choisir ?",
      reponse:
        "Le brillant intensifie la couleur et souligne les volumes ; le mat apaise et modernise. Pour une teinte vive, le brillant accentue l'effet ; pour une teinte sombre dans un intérieur sobre, le mat est souvent le plus élégant.",
    },
  ],
};

export default article;
