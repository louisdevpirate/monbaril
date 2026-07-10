"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Données
// ---------------------------------------------------------------------------

const RAL_COLORS = [
  { code: "RAL 1023", name: "Jaune signalisation", hex: "#F7B500" },
  { code: "RAL 2004", name: "Orange pur", hex: "#F44611" },
  { code: "RAL 3020", name: "Rouge signalisation", hex: "#C1121C" },
  { code: "RAL 4006", name: "Pourpre signalisation", hex: "#A03472" },
  { code: "RAL 5010", name: "Bleu gentiane", hex: "#0E518D" },
  { code: "RAL 5015", name: "Bleu ciel", hex: "#2271B3" },
  { code: "RAL 5024", name: "Bleu pastel", hex: "#6093AC" },
  { code: "RAL 6005", name: "Vert mousse", hex: "#084A27" },
  { code: "RAL 6018", name: "Vert jaune", hex: "#57A639" },
  { code: "RAL 6027", name: "Vert clair", hex: "#84C3BE" },
  { code: "RAL 7016", name: "Gris anthracite", hex: "#383E42" },
  { code: "RAL 7035", name: "Gris clair", hex: "#C5C7C4" },
  { code: "RAL 8017", name: "Brun chocolat", hex: "#442F29" },
  { code: "RAL 9005", name: "Noir foncé", hex: "#0A0A0D" },
  { code: "RAL 9010", name: "Blanc pur", hex: "#F6F6F6" },
  { code: "RAL 3015", name: "Rose clair", hex: "#D8A0A6" },
] as const;

type Finish = "brillant" | "mat" | "graine";

const FINISHES: { id: Finish; label: string; src: string; specStrength: number }[] = [
  { id: "brillant", label: "Brillant", src: "/customizer/base/brillantnobg.png", specStrength: 1 },
  { id: "mat", label: "Mat", src: "/customizer/base/matnobg.png", specStrength: 0.5 },
  { id: "graine", label: "Grainé", src: "/customizer/base/grainynobg.png", specStrength: 0.65 },
];

type ZoneId = "haute" | "milieu" | "basse";
const ZONE_IDS: ZoneId[] = ["haute", "milieu", "basse"];
const ZONE_LABELS: Record<ZoneId, string> = {
  haute: "Portion haute",
  milieu: "Portion milieu",
  basse: "Portion basse",
};

interface ZoneDesign {
  image: string | null; // dataURL
  fileName: string | null;
  scale: number;
  dx: number; // décalage en fraction de la largeur de zone
  dy: number;
  opacity: number;
  multiply: boolean; // rendu « imprimé » (fusionne avec la couleur)
}

const emptyZone = (): ZoneDesign => ({
  image: null,
  fileName: null,
  scale: 1,
  dx: 0,
  dy: 0,
  opacity: 1,
  multiply: false,
});

// Zones exprimées en fractions de la hauteur du baril (calibrables)
interface Calibration {
  zones: Record<ZoneId, { y1: number; y2: number }>;
  sag: number; // courbure verticale (px à l'échelle native) des lignes horizontales
  insetX: number; // marge latérale des zones, fraction de la largeur du baril
}

const DEFAULT_CALIBRATION: Calibration = {
  zones: {
    haute: { y1: 0.045, y2: 0.3 },
    milieu: { y1: 0.375, y2: 0.615 },
    basse: { y1: 0.69, y2: 0.95 },
  },
  sag: 18,
  insetX: 0.02,
};

interface StudioState {
  color: { code: string; name: string; hex: string };
  finish: Finish;
  zones: Record<ZoneId, ZoneDesign>;
}

// Assets pré-calculés pour une finition
interface FinishAssets {
  width: number;
  height: number;
  mask: HTMLCanvasElement; // photo d'origine (porte le canal alpha)
  shading: HTMLCanvasElement; // carte d'ombrage (luminance normalisée)
  spec: HTMLCanvasElement; // hautes lumières uniquement
  bbox: { x: number; y: number; w: number; h: number }; // silhouette du baril
}

// ---------------------------------------------------------------------------
// Pré-traitement d'une photo de baril → cartes d'ombrage et de reflets
// ---------------------------------------------------------------------------

async function buildFinishAssets(src: string): Promise<FinishAssets> {
  const img = new Image();
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error(`Impossible de charger ${src}`));
    img.src = src;
  });
  const W = img.naturalWidth;
  const H = img.naturalHeight;

  const mask = document.createElement("canvas");
  mask.width = W;
  mask.height = H;
  const mctx = mask.getContext("2d")!;
  mctx.drawImage(img, 0, 0);
  const data = mctx.getImageData(0, 0, W, H);
  const px = data.data;

  // Luminance + bbox + histogramme (sur pixels opaques)
  const lums = new Uint8Array(W * H);
  const hist = new Uint32Array(256);
  let minX = W, minY = H, maxX = 0, maxY = 0, count = 0;
  for (let i = 0, p = 0; i < W * H; i++, p += 4) {
    const a = px[p + 3];
    const l = Math.round(0.299 * px[p] + 0.587 * px[p + 1] + 0.114 * px[p + 2]);
    lums[i] = l;
    if (a > 24) {
      hist[l]++;
      count++;
      const x = i % W, y = (i / W) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  // Percentiles de luminance du baril
  const pct = (q: number) => {
    let acc = 0;
    const target = count * q;
    for (let l = 0; l < 256; l++) {
      acc += hist[l];
      if (acc >= target) return l;
    }
    return 255;
  };
  const p99 = Math.max(1, pct(0.99)); // référence « blanc » de la photo
  const p90 = pct(0.9); // seuil des hautes lumières

  // Carte d'ombrage : luminance normalisée (p99 → blanc pur)
  const shading = document.createElement("canvas");
  shading.width = W;
  shading.height = H;
  const sctx = shading.getContext("2d")!;
  const sdata = sctx.createImageData(W, H);
  const sp = sdata.data;
  // Carte des reflets : ne garde que ce qui dépasse p90
  const spec = document.createElement("canvas");
  spec.width = W;
  spec.height = H;
  const pctx = spec.getContext("2d")!;
  const pdata = pctx.createImageData(W, H);
  const pp = pdata.data;

  const specRange = Math.max(1, 255 - p90);
  for (let i = 0, p = 0; i < W * H; i++, p += 4) {
    const a = px[p + 3];
    const norm = Math.min(255, Math.round((lums[i] / p99) * 255));
    sp[p] = sp[p + 1] = sp[p + 2] = norm;
    sp[p + 3] = a;
    let s = (lums[i] - p90) / specRange;
    s = s <= 0 ? 0 : Math.pow(s, 1.6);
    pp[p] = pp[p + 1] = pp[p + 2] = 255;
    pp[p + 3] = Math.round(Math.min(1, s) * (a / 255) * 255);
  }
  sctx.putImageData(sdata, 0, 0);
  pctx.putImageData(pdata, 0, 0);

  return {
    width: W,
    height: H,
    mask,
    shading,
    spec,
    bbox: { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 },
  };
}

// ---------------------------------------------------------------------------
// Géométrie des zones
// ---------------------------------------------------------------------------

interface ZoneRect {
  x: number;
  y: number;
  w: number;
  h: number;
  sag: number;
}

function zoneRect(assets: FinishAssets, calib: Calibration, id: ZoneId): ZoneRect {
  const { bbox } = assets;
  const inset = bbox.w * calib.insetX;
  const z = calib.zones[id];
  return {
    x: bbox.x + inset,
    y: bbox.y + z.y1 * bbox.h,
    w: bbox.w - 2 * inset,
    h: (z.y2 - z.y1) * bbox.h,
    sag: calib.sag,
  };
}

// Trace le contour d'une zone : bords haut/bas incurvés (courbure du fût)
function traceZonePath(ctx: CanvasRenderingContext2D, r: ZoneRect) {
  ctx.beginPath();
  ctx.moveTo(r.x, r.y);
  ctx.quadraticCurveTo(r.x + r.w / 2, r.y + 2 * r.sag, r.x + r.w, r.y);
  ctx.lineTo(r.x + r.w, r.y + r.h);
  ctx.quadraticCurveTo(r.x + r.w / 2, r.y + r.h + 2 * r.sag, r.x, r.y + r.h);
  ctx.closePath();
}

// Dessine le visuel d'une zone, cintré verticalement pour suivre le fût
function drawZoneDesign(
  ctx: CanvasRenderingContext2D,
  r: ZoneRect,
  design: ZoneDesign,
  imgEl: HTMLImageElement
) {
  // Panneau « à plat » : image en cover × échelle, décalages en fraction de zone
  const panel = document.createElement("canvas");
  panel.width = Math.max(1, Math.round(r.w));
  panel.height = Math.max(1, Math.round(r.h + r.sag));
  const pctx = panel.getContext("2d")!;
  const cover = Math.max(panel.width / imgEl.naturalWidth, panel.height / imgEl.naturalHeight);
  const dw = imgEl.naturalWidth * cover * design.scale;
  const dh = imgEl.naturalHeight * cover * design.scale;
  pctx.drawImage(
    imgEl,
    panel.width / 2 - dw / 2 + design.dx * r.w,
    panel.height / 2 - dh / 2 + design.dy * r.h,
    dw,
    dh
  );

  ctx.save();
  traceZonePath(ctx, r);
  ctx.clip();
  ctx.globalAlpha = design.opacity;
  ctx.globalCompositeOperation = design.multiply ? "multiply" : "source-over";
  // Cintrage : tranches verticales décalées selon la courbure
  const N = 64;
  const sw = panel.width / N;
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N; // 0..1
    const arc = 4 * t * (1 - t); // 0 aux bords, 1 au centre
    const dy = r.sag * arc;
    ctx.drawImage(
      panel,
      i * sw, 0, sw, panel.height,
      r.x + i * sw, r.y + dy, sw + 1, panel.height
    );
  }
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

// ---------------------------------------------------------------------------
// Rendu complet de la scène
// ---------------------------------------------------------------------------

function renderScene(
  canvas: HTMLCanvasElement,
  assets: FinishAssets,
  state: StudioState,
  calib: Calibration,
  specStrength: number,
  designImages: Partial<Record<ZoneId, HTMLImageElement>>,
  guides: { show: boolean; active: ZoneId } | null
) {
  const { width: W, height: H } = assets;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  // 1. Carte d'ombrage de la photo
  ctx.drawImage(assets.shading, 0, 0);
  // 2. Couleur RAL en multiply (le relief de la photo teinte la couleur)
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = state.color.hex;
  ctx.fillRect(0, 0, W, H);
  // 3. Redécoupe à la silhouette du baril
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(assets.mask, 0, 0);
  ctx.globalCompositeOperation = "source-over";

  // 4. Visuels par zone
  for (const id of ZONE_IDS) {
    const d = state.zones[id];
    const img = designImages[id];
    if (d.image && img) drawZoneDesign(ctx, zoneRect(assets, calib, id), d, img);
  }
  // Recadre les éventuels débords sur la silhouette
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(assets.mask, 0, 0);

  // 5. Hautes lumières de la photo par-dessus (rendu « peint / imprimé »)
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = specStrength;
  ctx.drawImage(assets.spec, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";

  // 6. Guides de zones (jamais dans les exports)
  if (guides?.show) {
    for (const id of ZONE_IDS) {
      const r = zoneRect(assets, calib, id);
      traceZonePath(ctx, r);
      ctx.lineWidth = id === guides.active ? 5 : 2.5;
      ctx.strokeStyle = id === guides.active ? "#3b82f6" : "rgba(100,116,139,0.8)";
      ctx.setLineDash([16, 12]);
      ctx.stroke();
      ctx.setLineDash([]);
      if (id === guides.active) {
        ctx.fillStyle = "rgba(59,130,246,0.07)";
        ctx.fill();
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export default function AdminStudioPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const assetsRef = useRef<Partial<Record<Finish, FinishAssets>>>({});
  const designImagesRef = useRef<Partial<Record<ZoneId, HTMLImageElement>>>({});

  const [state, setState] = useState<StudioState>({
    color: { ...RAL_COLORS[4] },
    finish: "brillant",
    zones: { haute: emptyZone(), milieu: emptyZone(), basse: emptyZone() },
  });
  const [calib, setCalib] = useState<Calibration>(DEFAULT_CALIBRATION);
  const [activeZone, setActiveZone] = useState<ZoneId>("milieu");
  const [showZoneGuides, setShowZoneGuides] = useState(true);
  const [showCalibration, setShowCalibration] = useState(false);
  const [designName, setDesignName] = useState("mon-baril");
  const [customHex, setCustomHex] = useState("");
  const [assetsVersion, setAssetsVersion] = useState(0); // déclenche un re-rendu quand un asset finit de charger

  const zone = state.zones[activeZone];

  // Calibration persistée en local
  useEffect(() => {
    try {
      const saved = localStorage.getItem("studio-calibration");
      if (saved) setCalib({ ...DEFAULT_CALIBRATION, ...JSON.parse(saved) });
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("studio-calibration", JSON.stringify(calib));
  }, [calib]);

  // Chargement + pré-traitement des photos de finition
  useEffect(() => {
    let cancelled = false;
    for (const f of FINISHES) {
      if (assetsRef.current[f.id]) continue;
      buildFinishAssets(f.src)
        .then((assets) => {
          if (cancelled) return;
          assetsRef.current[f.id] = assets;
          setAssetsVersion((v) => v + 1);
        })
        .catch(() => toast.error(`Photo introuvable : ${f.src}`));
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // (Re)chargement des images de design en éléments <img>
  useEffect(() => {
    for (const id of ZONE_IDS) {
      const d = state.zones[id];
      const cached = designImagesRef.current[id];
      if (!d.image) {
        delete designImagesRef.current[id];
        continue;
      }
      if (cached?.src === d.image) continue;
      const img = new Image();
      img.onload = () => {
        designImagesRef.current[id] = img;
        setAssetsVersion((v) => v + 1);
      };
      img.src = d.image;
    }
  }, [state.zones]);

  // Rendu principal
  useEffect(() => {
    const canvas = canvasRef.current;
    const assets = assetsRef.current[state.finish];
    if (!canvas || !assets) return;
    const specStrength = FINISHES.find((f) => f.id === state.finish)!.specStrength;
    renderScene(canvas, assets, state, calib, specStrength, designImagesRef.current, {
      show: showZoneGuides,
      active: activeZone,
    });
  }, [state, calib, activeZone, showZoneGuides, assetsVersion]);

  const updateZone = useCallback((id: ZoneId, patch: Partial<ZoneDesign>) => {
    setState((s) => ({
      ...s,
      zones: { ...s.zones, [id]: { ...s.zones[id], ...patch } },
    }));
  }, []);

  // Clic sur l'aperçu → sélection de la zone
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const assets = assetsRef.current[state.finish];
    if (!canvas || !assets) return;
    const rect = canvas.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * assets.height;
    for (const id of ZONE_IDS) {
      const r = zoneRect(assets, calib, id);
      if (y >= r.y && y <= r.y + r.h + r.sag) {
        setActiveZone(id);
        return;
      }
    }
  };

  // Upload d'un visuel
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Fichier non supporté : choisissez une image (PNG, JPEG, SVG…)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateZone(activeZone, {
        image: reader.result as string,
        fileName: file.name,
        scale: 1,
        dx: 0,
        dy: 0,
      });
      toast.success(`Visuel ajouté sur la ${ZONE_LABELS[activeZone].toLowerCase()}`);
    };
    reader.readAsDataURL(file);
  };

  // --- Exports -------------------------------------------------------------
  const download = (href: string, filename: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    a.click();
  };

  // Rendu propre (sans guides) à la résolution native de la photo
  const renderForExport = (): HTMLCanvasElement | null => {
    const assets = assetsRef.current[state.finish];
    if (!assets) return null;
    const canvas = document.createElement("canvas");
    const specStrength = FINISHES.find((f) => f.id === state.finish)!.specStrength;
    renderScene(canvas, assets, state, calib, specStrength, designImagesRef.current, null);
    return canvas;
  };

  const exportRaster = (format: "png" | "jpeg") => {
    const scene = renderForExport();
    if (!scene) return toast.error("Photos de base pas encore chargées");
    let out = scene;
    if (format === "jpeg") {
      out = document.createElement("canvas");
      out.width = scene.width;
      out.height = scene.height;
      const ctx = out.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, out.width, out.height);
      ctx.drawImage(scene, 0, 0);
    }
    download(
      out.toDataURL(`image/${format}`, 0.92),
      `${designName}.${format === "jpeg" ? "jpg" : "png"}`
    );
    toast.success(`${format.toUpperCase()} exporté`);
  };

  const exportSvg = () => {
    const scene = renderForExport();
    if (!scene) return toast.error("Photos de base pas encore chargées");
    const png = scene.toDataURL("image/png");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${scene.width}" height="${scene.height}" viewBox="0 0 ${scene.width} ${scene.height}"><image href="${png}" width="${scene.width}" height="${scene.height}"/></svg>`;
    download(
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg),
      `${designName}.svg`
    );
    toast.success("SVG exporté");
  };

  const exportJson = () => {
    const blob = new Blob(
      [JSON.stringify({ name: designName, ...state, calibration: calib }, null, 2)],
      { type: "application/json" }
    );
    download(URL.createObjectURL(blob), `${designName}.json`);
    toast.success("JSON exporté (rechargeable dans le studio)");
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data.color || !data.zones) throw new Error("format invalide");
        setState({ color: data.color, finish: data.finish ?? "brillant", zones: data.zones });
        if (data.calibration) setCalib(data.calibration);
        if (data.name) setDesignName(data.name);
        toast.success("Design rechargé");
      } catch {
        toast.error("Fichier JSON invalide");
      }
    };
    reader.readAsText(file);
  };

  const assetsReady = !!assetsRef.current[state.finish];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🎨 Studio de création</h1>
            <p className="text-gray-500 text-sm">
              Mockup photo : couleur RAL, finition, visuels par zone, exports HD.
            </p>
          </div>
          <input
            value={designName}
            onChange={(e) => setDesignName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, "-"))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            placeholder="nom-du-design"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* ---------------- Aperçu ---------------- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
            {!assetsReady && (
              <div className="w-full max-w-lg aspect-square flex items-center justify-center text-gray-400 text-sm animate-pulse">
                Chargement du mockup…
              </div>
            )}
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className={`w-full max-w-lg cursor-pointer ${assetsReady ? "" : "hidden"}`}
            />
            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showZoneGuides}
                  onChange={(e) => setShowZoneGuides(e.target.checked)}
                />
                Afficher les zones
              </label>
              <span>
                {state.color.code} · {state.color.name} ·{" "}
                {FINISHES.find((f) => f.id === state.finish)?.label}
              </span>
            </div>
          </div>

          {/* ---------------- Panneau de contrôle ---------------- */}
          <div className="space-y-5">
            {/* Finition */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Finition</h2>
              <div className="grid grid-cols-3 gap-2">
                {FINISHES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setState((s) => ({ ...s, finish: f.id }))}
                    className={`py-2 rounded-lg text-sm font-medium border transition ${
                      state.finish === f.id
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Couleur */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Couleur RAL</h2>
              <div className="grid grid-cols-8 gap-2">
                {RAL_COLORS.map((c) => (
                  <button
                    key={c.code}
                    title={`${c.code} — ${c.name}`}
                    onClick={() => setState((s) => ({ ...s, color: { ...c } }))}
                    className={`aspect-square rounded-full border-2 transition ${
                      state.color.code === c.code
                        ? "border-gray-900 scale-110"
                        : "border-gray-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  value={customHex}
                  onChange={(e) => setCustomHex(e.target.value)}
                  placeholder="#0E518D (hex libre)"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                />
                <button
                  onClick={() => {
                    if (/^#[0-9a-fA-F]{6}$/.test(customHex)) {
                      setState((s) => ({
                        ...s,
                        color: { code: "Custom", name: customHex, hex: customHex },
                      }));
                    } else {
                      toast.error("Hex invalide — format attendu : #RRGGBB");
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                >
                  OK
                </button>
              </div>
            </section>

            {/* Zones + visuel */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Visuel par zone</h2>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {ZONE_IDS.map((id) => (
                  <button
                    key={id}
                    onClick={() => setActiveZone(id)}
                    className={`py-2 rounded-lg text-xs font-medium border transition ${
                      activeZone === id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {ZONE_LABELS[id]}
                    {state.zones[id].image && " ●"}
                  </button>
                ))}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = "";
                }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleFile(f);
                }}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
              >
                {zone.image ? (
                  <span className="text-gray-700 font-medium">{zone.fileName}</span>
                ) : (
                  <>
                    Cliquez ou glissez une image ici
                    <br />
                    <span className="text-xs">
                      (appliquée sur : {ZONE_LABELS[activeZone].toLowerCase()})
                    </span>
                  </>
                )}
              </div>

              {zone.image && (
                <div className="mt-4 space-y-3 text-sm">
                  {(
                    [
                      { key: "scale", label: "Échelle", min: 0.2, max: 3, step: 0.02 },
                      { key: "dx", label: "Décalage X", min: -0.5, max: 0.5, step: 0.005 },
                      { key: "dy", label: "Décalage Y", min: -0.5, max: 0.5, step: 0.005 },
                      { key: "opacity", label: "Opacité", min: 0.1, max: 1, step: 0.05 },
                    ] as const
                  ).map((s) => (
                    <label key={s.key} className="block">
                      <span className="flex justify-between text-gray-600">
                        {s.label}
                        <span>{zone[s.key]}</span>
                      </span>
                      <input
                        type="range"
                        min={s.min}
                        max={s.max}
                        step={s.step}
                        value={zone[s.key]}
                        onChange={(e) =>
                          updateZone(activeZone, { [s.key]: Number(e.target.value) })
                        }
                        className="w-full"
                      />
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={zone.multiply}
                      onChange={(e) => updateZone(activeZone, { multiply: e.target.checked })}
                    />
                    Mode imprimé (le blanc du visuel laisse voir la couleur)
                  </label>
                  <button
                    onClick={() => updateZone(activeZone, emptyZone())}
                    className="w-full py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 text-sm"
                  >
                    Retirer le visuel de cette zone
                  </button>
                </div>
              )}
            </section>

            {/* Calibration */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <button
                onClick={() => setShowCalibration((v) => !v)}
                className="w-full flex justify-between items-center font-semibold text-gray-900"
              >
                Calibration des zones
                <span className="text-gray-400">{showCalibration ? "▲" : "▼"}</span>
              </button>
              {showCalibration && (
                <div className="mt-4 space-y-4 text-sm">
                  {ZONE_IDS.map((id) => (
                    <div key={id}>
                      <p className="text-gray-700 font-medium mb-1">{ZONE_LABELS[id]}</p>
                      {(["y1", "y2"] as const).map((k) => (
                        <label key={k} className="block">
                          <span className="flex justify-between text-gray-500">
                            {k === "y1" ? "Bord haut" : "Bord bas"}
                            <span>{Math.round(calib.zones[id][k] * 100)}%</span>
                          </span>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.005}
                            value={calib.zones[id][k]}
                            onChange={(e) =>
                              setCalib((c) => ({
                                ...c,
                                zones: {
                                  ...c.zones,
                                  [id]: { ...c.zones[id], [k]: Number(e.target.value) },
                                },
                              }))
                            }
                            className="w-full"
                          />
                        </label>
                      ))}
                    </div>
                  ))}
                  <label className="block">
                    <span className="flex justify-between text-gray-500">
                      Courbure du fût
                      <span>{calib.sag}px</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      step={1}
                      value={calib.sag}
                      onChange={(e) => setCalib((c) => ({ ...c, sag: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </label>
                  <label className="block">
                    <span className="flex justify-between text-gray-500">
                      Marge latérale
                      <span>{Math.round(calib.insetX * 100)}%</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={0.15}
                      step={0.005}
                      value={calib.insetX}
                      onChange={(e) =>
                        setCalib((c) => ({ ...c, insetX: Number(e.target.value) }))
                      }
                      className="w-full"
                    />
                  </label>
                  <button
                    onClick={() => setCalib(DEFAULT_CALIBRATION)}
                    className="w-full py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >
                    Réinitialiser la calibration
                  </button>
                </div>
              )}
            </section>

            {/* Export */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Exporter</h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => exportRaster("png")}
                  className="py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700"
                >
                  PNG (fond transparent)
                </button>
                <button
                  onClick={() => exportRaster("jpeg")}
                  className="py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700"
                >
                  JPEG (fond blanc)
                </button>
                <button
                  onClick={exportSvg}
                  className="py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200"
                >
                  SVG
                </button>
                <button
                  onClick={exportJson}
                  className="py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200"
                >
                  JSON
                </button>
              </div>
              <input
                ref={jsonInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importJson(f);
                  e.target.value = "";
                }}
              />
              <button
                onClick={() => jsonInputRef.current?.click()}
                className="w-full mt-2 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
              >
                Recharger un design (.json)
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
