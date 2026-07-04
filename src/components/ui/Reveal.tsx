"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

/**
 * Révélation au scroll : le contenu se pose (10px de levée, 400ms, arrêt net)
 * quand il entre dans le viewport. Une seule fois — pas de re-jeu au remontage
 * de la page, l'effet doit rester un événement, pas un tic.
 *
 * `delay` (ms) permet le stagger entre éléments voisins : l'œil suit une
 * chaîne de montage, pas une explosion simultanée.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // Déclenche quand l'élément a vraiment commencé à entrer (‑60px du bas),
      // pour que l'animation soit visible et pas déjà finie hors champ.
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(10px)",
        transition: `opacity 400ms var(--ease-machined) ${delay}ms, transform 400ms var(--ease-machined) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
