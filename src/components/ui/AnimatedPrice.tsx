"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Prix qui "compte" vers sa nouvelle valeur quand elle change (quantité, variante).
 * 300ms, décélération cubique — le compteur mécanique qui se cale, pas le jackpot.
 * tabular-nums pour que les chiffres ne fassent pas trembler la mise en page.
 */
export default function AnimatedPrice({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;
    prevRef.current = to;

    const start = performance.now();
    const DURATION = 300;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <span className={`tabular-nums ${className}`}>
      {display.toFixed(2).replace(".", ",")} €
    </span>
  );
}
