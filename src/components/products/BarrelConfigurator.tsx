"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RAL_CLASSIC, RAL_FAVORITES, findRal, RalColor } from "@/lib/ral";
import {
  FINISHES,
  DEFAULT_TUNING,
  buildFinishAssets,
  renderMonochrome,
  type Finish,
  type FinishAssets,
} from "@/lib/barrel/render";

export const DEFAULT_COLOR = findRal("RAL 3020")!;
export const DEFAULT_FINISH: Finish = "brillant";

export const finishLabel = (f: Finish) =>
  FINISHES.find((x) => x.id === f)?.label ?? f;

/** Libellé de la configuration, réutilisé dans le panier et la commande. */
export const configLabel = (color: RalColor, finish: Finish) =>
  `${color.code} ${color.name} · ${finishLabel(finish)}`;

// ---------------------------------------------------------------------------
// Aperçu — canvas recoloré en direct (colonne gauche de la page produit)
// ---------------------------------------------------------------------------

export function BarrelPreview({
  color,
  finish,
  canvasRef,
}: {
  color: RalColor;
  finish: Finish;
  /** Exposé au parent pour produire la vignette envoyée au panier. */
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}) {
  const localRef = useRef<HTMLCanvasElement>(null);
  const ref = canvasRef ?? localRef;
  const assetsRef = useRef<Partial<Record<Finish, FinishAssets>>>({});
  const [ready, setReady] = useState(false);

  // Construit les cartes de la finition demandée (puis précharge les autres
  // en tâche de fond, pour que le changement de finition soit instantané)
  useEffect(() => {
    let cancelled = false;

    const ensure = async (id: Finish) => {
      if (assetsRef.current[id]) return assetsRef.current[id]!;
      const f = FINISHES.find((x) => x.id === id)!;
      const assets = await buildFinishAssets(
        f.src,
        f.bgSrc,
        f.engine,
        f.specStrength,
        f.specBlur
      );
      assetsRef.current[id] = assets;
      return assets;
    };

    setReady(!!assetsRef.current[finish]);

    ensure(finish)
      .then(() => {
        if (cancelled) return;
        setReady(true);
        // Préchauffage des finitions restantes, une fois l'aperçu affiché
        const idle =
          typeof window !== "undefined" && "requestIdleCallback" in window
            ? window.requestIdleCallback
            : (cb: () => void) => setTimeout(cb, 400);
        idle(() => {
          for (const f of FINISHES) {
            if (!cancelled && f.id !== finish) void ensure(f.id).catch(() => {});
          }
        });
      })
      .catch(() => {
        /* asset manquant : l'aperçu reste sur son état de chargement */
      });

    return () => {
      cancelled = true;
    };
  }, [finish]);

  // Rendu à chaque changement de couleur / finition
  useEffect(() => {
    const canvas = ref.current;
    const assets = assetsRef.current[finish];
    if (!canvas || !assets || !ready) return;
    renderMonochrome(canvas, assets, color.hex, DEFAULT_TUNING);
  }, [color, finish, ready, ref]);

  return (
    <div className="relative aspect-square bg-[#f5f0ea] rounded-2xl overflow-hidden">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-gray-400 font-space-grotesk animate-pulse">
            Préparation de l&apos;aperçu…
          </span>
        </div>
      )}
      <canvas
        ref={ref}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] tracking-wide text-gray-400 font-space-grotesk">
        Aperçu indicatif — la teinte réelle suit la référence RAL
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sélecteurs — finition + nuancier RAL (colonne droite de la page produit)
// ---------------------------------------------------------------------------

export function BarrelColorPicker({
  color,
  finish,
  onColorChange,
  onFinishChange,
}: {
  color: RalColor;
  finish: Finish;
  onColorChange: (c: RalColor) => void;
  onFinishChange: (f: Finish) => void;
}) {
  const ralIndex = useMemo(
    () => Math.max(0, RAL_CLASSIC.findIndex((c) => c.code === color.code)),
    [color.code]
  );
  const ralGradient = useMemo(
    () => `linear-gradient(to right, ${RAL_CLASSIC.map((c) => c.hex).join(",")})`,
    []
  );

  return (
    <div className="space-y-6">
      {/* Finition */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 font-space-grotesk">
          Finition — <span className="text-orange-500">{finishLabel(finish)}</span>
        </label>
        <div className="grid grid-cols-3 gap-2 max-w-sm">
          {FINISHES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFinishChange(f.id)}
              className={`py-2.5 rounded-lg text-sm font-medium border transition font-space-grotesk ${
                finish === f.id
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Couleur RAL */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 font-space-grotesk">
          Couleur —{" "}
          <span className="text-orange-500">
            {color.code} {color.name}
          </span>
        </label>

        <div className="grid grid-cols-8 gap-2 max-w-sm">
          {RAL_FAVORITES.map((code) => {
            const c = findRal(code)!;
            return (
              <button
                key={c.code}
                type="button"
                title={`${c.code} — ${c.name}`}
                aria-label={`${c.code} ${c.name}`}
                onClick={() => onColorChange(c)}
                className={`aspect-square rounded-full border-2 transition ${
                  color.code === c.code
                    ? "border-gray-900 scale-110"
                    : "border-gray-200 hover:scale-105"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
        </div>

        {/* Nuancier complet : le curseur s'aimante toujours sur un RAL exact */}
        <div className="max-w-sm space-y-2">
          <input
            type="range"
            min={0}
            max={RAL_CLASSIC.length - 1}
            step={1}
            value={ralIndex}
            aria-label="Nuancier RAL complet"
            onChange={(e) => onColorChange(RAL_CLASSIC[Number(e.target.value)])}
            className="w-full h-6 rounded-full appearance-none cursor-pointer border border-gray-200"
            style={{ background: ralGradient }}
          />
          <div className="flex items-center gap-2 text-sm font-space-grotesk">
            <span
              className="w-5 h-5 rounded-full border border-gray-300 shrink-0"
              style={{ backgroundColor: color.hex }}
            />
            <span className="font-medium text-gray-800">{color.code}</span>
            <span className="text-gray-500">· {color.name}</span>
            <span className="ml-auto text-xs text-gray-400">
              {RAL_CLASSIC.length} teintes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
