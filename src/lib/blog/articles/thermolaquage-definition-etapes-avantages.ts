import type { Article } from "../types";

const article: Article = {
  slug: "thermolaquage-definition-etapes-avantages",
  titre: "Thermolaquage : comment ça marche, et pourquoi ça tient mieux qu'une peinture",
  titreSeo: "Thermolaquage : définition, étapes et avantages",
  description:
    "Poudre électrostatique, cuisson au four, finitions mat, brillant ou grainé : le thermolaquage expliqué étape par étape, avantages et vraies limites.",
  extrait:
    "Poudre, charge électrostatique, four à 200 °C : le thermolaquage est la finition des jantes, des menuiseries et du mobilier urbain. Voici comment il fonctionne, ce qu'il apporte face à une peinture liquide — et ses vraies limites.",
  rubrique: "Savoir-faire",
  publieLe: "2026-06-09",
  image: {
    src: "/images/collections/closeup.jpg",
    alt: "Gros plan sur le cerclage d'un fût thermolaqué orange en finition brillante",
  },
  motsCles: [
    "thermolaquage",
    "thermolaquage définition",
    "peinture poudre",
    "peinture époxy",
    "thermolaquage ou peinture",
    "finition métal",
  ],
  corps: [
    {
      type: "p",
      texte:
        "Le mot revient dès qu'on cherche une finition solide pour du métal : portail, jantes, garde-corps, mobilier de jardin. Pourtant, peu de gens savent ce qu'il recouvre vraiment. Le thermolaquage — on parle aussi de **peinture poudre** ou de **peinture époxy**, même si l'époxy n'est qu'une des familles de poudre — est un procédé industriel qui n'a presque rien à voir avec un pot de peinture et un pinceau. C'est celui que nous utilisons pour chaque baril qui sort de notre atelier de Longvic, et c'est pour cette raison que nous prenons le temps de l'expliquer en détail.",
    },
    { type: "h2", texte: "Le thermolaquage, en une phrase" },
    {
      type: "p",
      texte:
        "Thermolaquer, c'est déposer une peinture sous forme de poudre sèche sur une pièce métallique grâce à l'électricité statique, puis la faire cuire au four pour qu'elle fonde, s'étale et durcisse en un film continu.",
    },
    {
      type: "p",
      texte:
        "Trois différences fondamentales avec une peinture classique en découlent. La poudre ne contient **pas de solvant** : il n'y a rien à évaporer, donc pas de séchage à l'air. Elle ne tient sur la pièce que par **attraction électrostatique** jusqu'à la cuisson, ce qui permet d'en déposer une couche régulière, y compris dans les creux. Et c'est **la chaleur**, pas l'air, qui fixe la finition : une fois sortie du four et refroidie, la pièce est manipulable.",
    },
    { type: "h2", texte: "Les étapes du thermolaquage, de la tôle brute à la pièce finie" },
    {
      type: "p",
      texte:
        "Un thermolaquage réussi se joue avant même que la poudre ne touche le métal. Sur un fût qui a déjà servi, la préparation représente l'essentiel du travail.",
    },
    { type: "h3", texte: "1. Le décapage" },
    {
      type: "p",
      texte:
        "La pièce est débarrassée de tout ce qui pourrait empêcher la poudre d'adhérer : ancienne peinture, rouille, calamine, résidus gras. Selon les ateliers, on procède par sablage ou grenaillage (projection d'un abrasif), par voie chimique, ou en combinant les deux. Le but est d'obtenir un métal nu, propre et légèrement rugueux, sur lequel la couche viendra s'accrocher.",
    },
    { type: "h3", texte: "2. Le traitement de surface" },
    {
      type: "p",
      texte:
        "Un acier mis à nu s'oxyde vite, parfois en quelques heures dans un local humide. Avant la mise en peinture, la surface reçoit donc un traitement de conversion ou un traitement antirouille, qui améliore l'adhérence et freine la corrosion si la finition venait un jour à être entamée. C'est l'étape la moins visible, et l'une des plus déterminantes pour la tenue dans le temps.",
    },
    { type: "h3", texte: "3. La projection électrostatique" },
    {
      type: "p",
      texte:
        "La pièce est reliée à la terre et placée en cabine. Le pistolet charge électriquement les grains de poudre, qui sont attirés par le métal et s'y collent. Cette attraction a un effet précieux : la poudre a tendance à envelopper la pièce et à venir se loger sur les arêtes et dans les nervures, là où une peinture au pistolet s'amincit. Dans la plupart des installations, la poudre qui ne se dépose pas est récupérée et réutilisée.",
    },
    { type: "h3", texte: "4. La cuisson" },
    {
      type: "p",
      texte:
        "La pièce part ensuite au four, en général autour de 180 à 200 °C pendant dix à vingt minutes, selon la poudre et l'épaisseur du métal. La poudre fond, se nappe, puis polymérise : ses molécules se lient entre elles et forment un film dur. Ce passage au four n'est pas un séchage accéléré, c'est lui qui crée la finition.",
    },
    { type: "h3", texte: "5. Le refroidissement et le contrôle" },
    {
      type: "p",
      texte:
        "Une fois refroidie, la pièce est contrôlée : uniformité de la teinte, absence de manques, régularité de l'aspect. Sur un baril, c'est aussi le moment de vérifier que les cerclages et le rebord supérieur sont couverts aussi bien que les grandes surfaces.",
    },
    { type: "h2", texte: "Thermolaquage ou peinture liquide : le comparatif" },
    {
      type: "p",
      texte:
        "Une peinture liquide, qu'elle soit appliquée au pinceau, au rouleau ou à la bombe, n'est pas une mauvaise solution en soi. Elle ne répond simplement pas au même besoin.",
    },
    {
      type: "tableau",
      entetes: ["Critère", "Peinture liquide ou aérosol", "Thermolaquage"],
      lignes: [
        ["Application", "Pinceau, rouleau, pistolet ou bombe", "Poudre projetée par charge électrostatique"],
        ["Fixation", "Séchage à l'air, évaporation des solvants", "Cuisson au four, polymérisation"],
        ["Épaisseur", "Film de quelques dizaines de microns par couche", "Couche plus épaisse, souvent 60 à 100 microns en une passe"],
        ["Arêtes et reliefs", "Le film s'y amincit et s'écaille en premier", "Bien couverts grâce à l'attraction électrostatique"],
        ["Solvants", "Présents dans la plupart des formules", "Aucun"],
        ["Retouche", "Facile", "Délicate : la pièce doit repasser au four"],
        ["Pour quoi", "Bricolage, supports qui ne supportent pas la chaleur", "Pièces métalliques soumises à l'usage"],
      ],
    },
    {
      type: "p",
      texte:
        "Au quotidien, la différence se joue surtout sur la résistance mécanique. Un meuble se cogne, se frotte, se déplace. Sur un baril, les cerclages et le rebord sont les premières zones à encaisser les chocs : c'est précisément là qu'une peinture mince cède d'abord. C'est aussi pour cela que le thermolaquage est retenu pour les jantes automobiles, le mobilier urbain ou les menuiseries en aluminium.",
    },
    { type: "h2", texte: "Mat, brillant ou grainé : les finitions possibles" },
    {
      type: "p",
      texte:
        "La poudre détermine la teinte, mais aussi l'aspect de surface. Les trois finitions les plus courantes sont celles que nous proposons sur le [Baril Monochrome](/products/baril-monochrome) :",
    },
    {
      type: "liste",
      items: [
        "**Brillant** : la teinte paraît plus profonde et plus saturée, les reflets soulignent les volumes. C'est l'aspect carrosserie, qui met en valeur les nervures d'un fût.",
        "**Mat** : aucun reflet, un rendu plus doux et plus contemporain. Les couleurs sombres y gagnent une élégance feutrée ; les traces de doigts s'y remarquent un peu plus sur les teintes foncées.",
        "**Grainé** (ou texturé) : une surface légèrement granuleuse au toucher, qui accroche la lumière et dissimule bien les petites marques d'usage. C'est la finition la plus « matière ».",
      ],
    },
    {
      type: "p",
      texte:
        "Côté couleur, le thermolaquage s'appuie presque toujours sur le nuancier **RAL**, un système de référence qui compte un peu plus de deux cents teintes normalisées. Un code RAL désigne la même couleur chez tous les fabricants de poudre : c'est ce qui permet de reproduire une teinte à l'identique d'une commande à l'autre.",
    },
    { type: "h2", texte: "Les limites du thermolaquage" },
    {
      type: "p",
      texte:
        "Aucun procédé n'est parfait, et il serait malhonnête de présenter celui-ci comme tel.",
    },
    {
      type: "liste",
      items: [
        "**Il faut du métal.** La pièce doit supporter la cuisson et conduire l'électricité : le bois, la plupart des plastiques et le verre sont exclus du procédé classique.",
        "**La retouche est délicate.** Un éclat profond ne se corrige pas d'un coup de pinceau invisible : pour une réparation parfaite, la pièce doit être reprise et recuite.",
        "**La taille est limitée par le four.** Un fût de 200 litres entre sans difficulté dans un four d'atelier ; un portail de six mètres demande une installation spécifique.",
        "**Ce n'est pas un procédé de bricolage.** Cabine, pistolet électrostatique, four : l'équipement est indispensable. C'est aussi ce qui explique l'écart de prix avec une pièce peinte à la bombe.",
      ],
    },
    { type: "h2", texte: "Entretenir une pièce thermolaquée" },
    {
      type: "p",
      texte:
        "C'est l'un des avantages les plus appréciés : l'entretien est minimal. Un chiffon doux légèrement humide suffit pour la poussière et les traces du quotidien. Évitez en revanche les produits abrasifs, l'acétone et les éponges grattantes, qui peuvent ternir la finition — c'est la recommandation que nous donnons aussi dans notre [FAQ](/faq).",
    },
    {
      type: "p",
      texte:
        "En extérieur, le thermolaquage est largement employé pour le mobilier et les équipements exposés aux intempéries. Nous conseillons néanmoins d'éviter une exposition prolongée à des conditions extrêmes, comme le gel intense ou l'air salin, et de nous contacter avant de commander pour un usage extérieur régulier.",
    },
    {
      type: "encadre",
      titre: "Chez MonBaril",
      texte:
        "Chaque fût est décapé, traité contre la rouille puis thermolaqué au four dans notre atelier de Longvic, près de Dijon, dans la teinte RAL et la finition choisies à la commande. Comptez 7 à 10 jours ouvrés de fabrication.",
      lien: { libelle: "Composer mon baril →", href: "/products/baril-monochrome" },
    },
  ],
  faq: [
    {
      question: "Thermolaquage et peinture époxy, est-ce la même chose ?",
      reponse:
        "Pas exactement. « Peinture époxy » est souvent employé comme synonyme, mais l'époxy n'est qu'une famille de poudre, surtout utilisée en intérieur. Les poudres polyester, plus résistantes aux UV, sont courantes en extérieur. Dans les deux cas, le principe — poudre électrostatique puis cuisson — est le même.",
    },
    {
      question: "Peut-on thermolaquer une pièce déjà peinte ?",
      reponse:
        "Oui, à condition de la décaper entièrement au préalable. La poudre doit être déposée sur un métal nu et propre : appliquée sur une ancienne peinture, elle adhérerait mal et la cuisson pourrait la faire cloquer.",
    },
    {
      question: "Combien de temps dure un thermolaquage ?",
      reponse:
        "Cela dépend de la poudre, de la qualité de la préparation et des conditions d'usage : une pièce d'intérieur n'a rien à voir avec une pièce exposée aux embruns. C'est pourquoi nous n'avançons pas de durée chiffrée. Ce qui est établi, c'est que l'industrie retient le thermolaquage précisément quand une finition doit durer.",
    },
    {
      question: "Peut-on thermolaquer soi-même ?",
      reponse:
        "Des kits existent, mais ils demandent un pistolet électrostatique et un four capable de monter à environ 200 °C avec la pièce entière à l'intérieur. Pour un objet de la taille d'un fût, cela reste l'affaire d'un atelier équipé.",
    },
  ],
};

export default article;
