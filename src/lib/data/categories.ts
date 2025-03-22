export type Category = {
    id: string;
    title: string;
    slug: string;
    image: string;
    description?: string;
  };
  
  export const categories: Category[] = [
    {
      id: "racing",
      title: "Racing Legends",
      slug: "racing",
      image: "/barils/baril1.jpg",
      description: "Inspiré des couleurs mythiques des courses automobiles.",
    },
    {
      id: "military",
      title: "Military & Cargo",
      slug: "military",
      image: "/barils/baril2.jpg",
      description: "Look robuste et brut, parfait pour les amateurs de style commando.",
    },
    {
      id: "vintage",
      title: "Vintage Oil Barrels",
      slug: "vintage",
      image: "/barils/baril3.jpg",
      description: "Esprit station-service rétro, usé et industriel.",
    },
  ];
  