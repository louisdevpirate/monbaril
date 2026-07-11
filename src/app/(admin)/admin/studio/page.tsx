"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabaseClient";
import { RAL_CLASSIC, RAL_FAVORITES, findRal, RalColor } from "@/lib/ral";

// ---------------------------------------------------------------------------
// Finitions — photo détourée (recolorisation) + photo studio (fond + ombre)
// ---------------------------------------------------------------------------

type Finish = "brillant" | "mat" | "graine";

// Deux niveaux de résolution : copies 1600px pour l'aperçu interactif,
// fichiers 5000px chargés à la demande pour les exports et la publication.
const FINISHES: {
  id: Finish;
  label: string;
  src: string;
  bgSrc: string;
  hdSrc: string;
  hdBgSrc: string;
  specStrength: number;
}[] = [
  {
    id: "brillant",
    label: "Brillant",
    src: "/customizer/base/preview/brillantnobg.png",
    bgSrc: "/customizer/base/preview/brillant.png",
    hdSrc: "/customizer/base/brillantnobg.png",
    hdBgSrc: "/customizer/base/brillant.png",
    specStrength: 1,
  },
  {
    id: "mat",
    label: "Mat",
    src: "/customizer/base/preview/matnobg.png",
    bgSrc: "/customizer/base/preview/mat.png",
    hdSrc: "/customizer/base/matnobg.png",
    hdBgSrc: "/customizer/base/mat.png",
    specStrength: 0.5,
  },
  {
    id: "graine",
    label: "Grainé",
    src: "/customizer/base/preview/grainynobg.png",
    bgSrc: "/customizer/base/preview/grainy.png",
    hdSrc: "/customizer/base/grainynobg.png",
    hdBgSrc: "/customizer/base/grainy.png",
    specStrength: 0.65,
  },
];

// Les courbures (px) de la calibration sont exprimées à cette échelle,
// puis converties proportionnellement pour le rendu 5000px
const SAG_BASE_WIDTH = 1600;

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
  multiply: boolean; // rendu « imprimé »
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

interface Calibration {
  zones: Record<ZoneId, { y1: number; y2: number }>;
  sagTop: number; // courbure (px natifs) en haut du fût
  sagBottom: number; // courbure en bas du fût
  insetX: number; // marge latérale, fraction de la largeur du baril
}

const DEFAULT_CALIBRATION: Calibration = {
  zones: {
    haute: { y1: 0.045, y2: 0.3 },
    milieu: { y1: 0.375, y2: 0.615 },
    basse: { y1: 0.69, y2: 0.95 },
  },
  sagTop: 12,
  sagBottom: 34,
  insetX: 0.02,
};

interface StudioState {
  color: RalColor;
  finish: Finish;
  zones: Record<ZoneId, ZoneDesign>;
}

interface FinishAssets {
  width: number;
  height: number;
  mask: HTMLCanvasElement;
  shading: HTMLCanvasElement;
  spec: HTMLCanvasElement;
  bg: HTMLImageElement; // photo studio complète (fond gris clair + ombre portée)
  bbox: { x: number; y: number; w: number; h: number };
}

// ---------------------------------------------------------------------------
// Pré-traitement d'une photo de baril
// ---------------------------------------------------------------------------

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error(`Impossible de charger ${src}`));
    img.src = src;
  });
}

async function buildFinishAssets(src: string, bgSrc: string): Promise<FinishAssets> {
  const [img, bg] = await Promise.all([loadImage(src), loadImage(bgSrc)]);
  const W = img.naturalWidth;
  const H = img.naturalHeight;

  const mask = document.createElement("canvas");
  mask.width = W;
  mask.height = H;
  const mctx = mask.getContext("2d")!;
  mctx.drawImage(img, 0, 0);
  const data = mctx.getImageData(0, 0, W, H);
  const px = data.data;

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
  const pct = (q: number) => {
    let acc = 0;
    const target = count * q;
    for (let l = 0; l < 256; l++) {
      acc += hist[l];
      if (acc >= target) return l;
    }
    return 255;
  };
  const p99 = Math.max(1, pct(0.99));
  const p90 = pct(0.9);

  const shading = document.createElement("canvas");
  shading.width = W;
  shading.height = H;
  const sctx = shading.getContext("2d")!;
  const sdata = sctx.createImageData(W, H);
  const sp = sdata.data;
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
    bg,
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
  sag1: number; // courbure du bord haut
  sag2: number; // courbure du bord bas
}

function zoneRect(assets: FinishAssets, calib: Calibration, id: ZoneId): ZoneRect {
  const { bbox } = assets;
  const inset = bbox.w * calib.insetX;
  const z = calib.zones[id];
  // Les px de courbure sont calibrés sur l'aperçu 1600 ; on les met à
  // l'échelle de la résolution rendue (×3,125 pour le 5000px)
  const sagScale = assets.width / SAG_BASE_WIDTH;
  const sagAt = (f: number) =>
    (calib.sagTop + (calib.sagBottom - calib.sagTop) * f) * sagScale;
  return {
    x: bbox.x + inset,
    y: bbox.y + z.y1 * bbox.h,
    w: bbox.w - 2 * inset,
    h: (z.y2 - z.y1) * bbox.h,
    sag1: sagAt(z.y1),
    sag2: sagAt(z.y2),
  };
}

function traceZonePath(ctx: CanvasRenderingContext2D, r: ZoneRect) {
  ctx.beginPath();
  ctx.moveTo(r.x, r.y);
  ctx.quadraticCurveTo(r.x + r.w / 2, r.y + 2 * r.sag1, r.x + r.w, r.y);
  ctx.lineTo(r.x + r.w, r.y + r.h);
  ctx.quadraticCurveTo(r.x + r.w / 2, r.y + r.h + 2 * r.sag2, r.x, r.y + r.h);
  ctx.closePath();
}

function drawZoneDesign(
  ctx: CanvasRenderingContext2D,
  r: ZoneRect,
  design: ZoneDesign,
  imgEl: HTMLImageElement
) {
  const panel = document.createElement("canvas");
  panel.width = Math.max(1, Math.round(r.w));
  panel.height = Math.max(1, Math.round(r.h));
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
  // Cintrage : chaque tranche verticale suit la courbure haute et basse
  const N = 64;
  const sw = panel.width / N;
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N;
    const arc = 4 * t * (1 - t); // 0 aux bords, 1 au centre
    const yTop = r.y + arc * r.sag1;
    const height = r.h + arc * (r.sag2 - r.sag1);
    ctx.drawImage(panel, i * sw, 0, sw, panel.height, r.x + i * sw, yTop, sw + 1, height);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

// ---------------------------------------------------------------------------
// Rendu de la scène
// ---------------------------------------------------------------------------

function renderScene(
  canvas: HTMLCanvasElement,
  assets: FinishAssets,
  state: StudioState,
  calib: Calibration,
  specStrength: number,
  designImages: Partial<Record<ZoneId, HTMLImageElement>>,
  opts: { background: boolean; guides: { active: ZoneId } | null }
) {
  const { width: W, height: H } = assets;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  // Le baril recoloré est composé à part, puis posé sur la photo studio
  const barrel = document.createElement("canvas");
  barrel.width = W;
  barrel.height = H;
  const bctx = barrel.getContext("2d")!;

  bctx.drawImage(assets.shading, 0, 0);
  bctx.globalCompositeOperation = "multiply";
  bctx.fillStyle = state.color.hex;
  bctx.fillRect(0, 0, W, H);
  bctx.globalCompositeOperation = "destination-in";
  bctx.drawImage(assets.mask, 0, 0);
  bctx.globalCompositeOperation = "source-over";

  for (const id of ZONE_IDS) {
    const d = state.zones[id];
    const img = designImages[id];
    if (d.image && img) drawZoneDesign(bctx, zoneRect(assets, calib, id), d, img);
  }
  bctx.globalCompositeOperation = "destination-in";
  bctx.drawImage(assets.mask, 0, 0);

  bctx.globalCompositeOperation = "screen";
  bctx.globalAlpha = specStrength;
  bctx.drawImage(assets.spec, 0, 0);
  bctx.globalAlpha = 1;
  bctx.globalCompositeOperation = "source-over";

  // Assemblage : photo studio (fond + ombre portée) puis baril recoloré
  if (opts.background) ctx.drawImage(assets.bg, 0, 0, W, H);
  ctx.drawImage(barrel, 0, 0);

  if (opts.guides) {
    for (const id of ZONE_IDS) {
      const r = zoneRect(assets, calib, id);
      traceZonePath(ctx, r);
      ctx.lineWidth = id === opts.guides.active ? 5 : 2.5;
      ctx.strokeStyle = id === opts.guides.active ? "#3b82f6" : "rgba(100,116,139,0.8)";
      ctx.setLineDash([16, 12]);
      ctx.stroke();
      ctx.setLineDash([]);
      if (id === opts.guides.active) {
        ctx.fillStyle = "rgba(59,130,246,0.07)";
        ctx.fill();
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

interface Category {
  id: string;
  title: string;
  slug: string;
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export default function AdminStudioPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const assetsRef = useRef<Partial<Record<Finish, FinishAssets>>>({});
  // Cache HD à un seul emplacement : les cartes 5000px pèsent ~300 Mo par
  // finition, on ne garde donc que la dernière finition rendue
  const hdAssetsRef = useRef<{ finish: Finish; assets: FinishAssets } | null>(null);
  const designImagesRef = useRef<Partial<Record<ZoneId, HTMLImageElement>>>({});

  const [state, setState] = useState<StudioState>({
    color: findRal("RAL 5010")!,
    finish: "brillant",
    zones: { haute: emptyZone(), milieu: emptyZone(), basse: emptyZone() },
  });
  const [calib, setCalib] = useState<Calibration>(DEFAULT_CALIBRATION);
  const [activeZone, setActiveZone] = useState<ZoneId>("milieu");
  const [showZoneGuides, setShowZoneGuides] = useState(true);
  const [showCalibration, setShowCalibration] = useState(false);
  const [assetsVersion, setAssetsVersion] = useState(0);

  // Sauvegarde produit
  const [saveOpen, setSaveOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    slugTouched: false,
    categoryid: "",
    description: "",
    price: 249,
    stock: 10,
    isLimited: false,
  });

  const zone = state.zones[activeZone];
  const ralIndex = useMemo(
    () => Math.max(0, RAL_CLASSIC.findIndex((c) => c.code === state.color.code)),
    [state.color.code]
  );
  const ralGradient = useMemo(
    () => `linear-gradient(to right, ${RAL_CLASSIC.map((c) => c.hex).join(",")})`,
    []
  );

  // Calibration persistée en local (migration de l'ancien champ `sag`)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("studio-calibration");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sag != null && parsed.sagTop == null) {
          parsed.sagTop = parsed.sag;
          parsed.sagBottom = parsed.sag;
          delete parsed.sag;
        }
        setCalib({ ...DEFAULT_CALIBRATION, ...parsed });
      }
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("studio-calibration", JSON.stringify(calib));
  }, [calib]);

  // Chargement des photos de finition
  useEffect(() => {
    let cancelled = false;
    for (const f of FINISHES) {
      if (assetsRef.current[f.id]) continue;
      buildFinishAssets(f.src, f.bgSrc)
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

  // Collections depuis Supabase
  useEffect(() => {
    supabase
      .from("categories")
      .select("id,title,slug")
      .then(({ data }) => {
        if (data?.length) {
          setCategories(data);
          setForm((f) => (f.categoryid ? f : { ...f, categoryid: data[0].id }));
        }
      });
  }, []);

  // Images de design → éléments <img>
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
      background: true,
      guides: showZoneGuides ? { active: activeZone } : null,
    });
  }, [state, calib, activeZone, showZoneGuides, assetsVersion]);

  const updateZone = useCallback((id: ZoneId, patch: Partial<ZoneDesign>) => {
    setState((s) => ({
      ...s,
      zones: { ...s.zones, [id]: { ...s.zones[id], ...patch } },
    }));
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const assets = assetsRef.current[state.finish];
    if (!canvas || !assets) return;
    const rect = canvas.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * assets.height;
    for (const id of ZONE_IDS) {
      const r = zoneRect(assets, calib, id);
      if (y >= r.y && y <= r.y + r.h + r.sag2) {
        setActiveZone(id);
        return;
      }
    }
  };

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

  const exportName = () =>
    slugify(`baril-${state.color.code}-${state.finish}`) || "baril";

  // Construit (et met en cache) les cartes pleine résolution de la finition
  const getHdAssets = async (finish: Finish): Promise<FinishAssets> => {
    if (hdAssetsRef.current?.finish === finish) return hdAssetsRef.current.assets;
    const f = FINISHES.find((x) => x.id === finish)!;
    const assets = await buildFinishAssets(f.hdSrc, f.hdBgSrc);
    hdAssetsRef.current = { finish, assets };
    return assets;
  };

  const renderForExport = async (background: boolean): Promise<HTMLCanvasElement | null> => {
    try {
      const assets = await getHdAssets(state.finish);
      const canvas = document.createElement("canvas");
      const specStrength = FINISHES.find((f) => f.id === state.finish)!.specStrength;
      renderScene(canvas, assets, state, calib, specStrength, designImagesRef.current, {
        background,
        guides: null,
      });
      return canvas;
    } catch {
      return null;
    }
  };

  const exportRaster = async (format: "png" | "jpeg") => {
    // Un seul toast, mis à jour via son id (dismiss laisse des fantômes avec sonner)
    const tid = toast.loading("Rendu haute définition (5000 px) en cours…");
    const scene = await renderForExport(format === "jpeg");
    if (!scene) {
      toast.error("Impossible de charger les photos haute définition", { id: tid });
      return;
    }
    if (format === "png") {
      download(scene.toDataURL("image/png"), `${exportName()}.png`);
      toast.success("PNG 5000px exporté (baril détouré, fond transparent)", { id: tid });
    } else {
      download(scene.toDataURL("image/jpeg", 0.92), `${exportName()}.jpg`);
      toast.success("JPEG studio 5000px exporté (fond + ombre portée)", { id: tid });
    }
  };

  const exportPng = () => exportRaster("png");
  const exportJpeg = () => exportRaster("jpeg");

  const exportJson = () => {
    const blob = new Blob(
      [JSON.stringify({ name: exportName(), ...state, calibration: calib }, null, 2)],
      { type: "application/json" }
    );
    download(URL.createObjectURL(blob), `${exportName()}.json`);
    toast.success("JSON exporté (rechargeable dans le studio)");
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data.color || !data.zones) throw new Error("format invalide");
        setState({ color: data.color, finish: data.finish ?? "brillant", zones: data.zones });
        if (data.calibration) {
          const c = data.calibration;
          if (c.sag != null && c.sagTop == null) {
            c.sagTop = c.sag;
            c.sagBottom = c.sag;
          }
          setCalib({ ...DEFAULT_CALIBRATION, ...c });
        }
        toast.success("Design rechargé");
      } catch {
        toast.error("Fichier JSON invalide");
      }
    };
    reader.readAsText(file);
  };

  // --- Sauvegarde produit ----------------------------------------------------
  const openSave = () => {
    const defaultTitle = `Baril ${state.color.name}`;
    setForm((f) => ({
      ...f,
      title: f.title || defaultTitle,
      slug: f.slugTouched ? f.slug : slugify(f.title || defaultTitle),
    }));
    setSaveOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Le titre est requis");
    if (!form.categoryid) return toast.error("Choisissez une collection");
    if (form.price <= 0) return toast.error("Le prix doit être positif");

    setSaving(true);
    const tid = toast.loading("Rendu haute définition (5000 px) en cours…");
    try {
      const scene = await renderForExport(true);
      if (!scene) throw new Error("Rendu HD impossible");
      toast.loading("Publication en cours…", { id: tid });
      const slug = form.slug || slugify(form.title);
      const ts = Date.now();
      const imagePath = `studio/${slug}-${ts}.jpg`;
      const designPath = `studio/${slug}-${ts}.json`;

      // 1. Image produit HD (photo studio : fond gris clair + ombre portée)
      const blob: Blob = await new Promise((res, rej) =>
        scene.toBlob((b) => (b ? res(b) : rej(new Error("rendu impossible"))), "image/jpeg", 0.92)
      );
      const { error: upErr } = await supabase.storage
        .from("barils")
        .upload(imagePath, blob, { contentType: "image/jpeg" });
      if (upErr) throw new Error(`Upload image : ${upErr.message}`);
      const { data: pub } = supabase.storage.from("barils").getPublicUrl(imagePath);

      // 2. Design JSON à côté (permet de rouvrir le produit dans le studio)
      const designBlob = new Blob(
        [JSON.stringify({ name: slug, ...state, calibration: calib }, null, 2)],
        { type: "application/json" }
      );
      await supabase.storage
        .from("barils")
        .upload(designPath, designBlob, { contentType: "application/json" });

      // 3. Création du produit (mêmes valeurs par défaut que l'admin produits)
      const row: Record<string, unknown> = {
        id: `product-${slug}-${ts}`,
        title: form.title.trim(),
        slug,
        price: form.price,
        image: pub.publicUrl,
        description: form.description.trim(),
        categoryid: form.categoryid,
        stock_quantity: form.stock,
        min_stock_threshold: 5,
        stock_reserved: 0,
        stock_updated_at: new Date().toISOString(),
        is_active: true,
        is_featured: false,
        is_on_sale: false,
        is_limited: form.isLimited,
      };
      let { error: insErr } = await supabase.from("products").insert([row]);
      if (insErr && /is_limited/i.test(insErr.message)) {
        // Colonne pas encore créée en base : on insère sans, en prévenant
        delete row.is_limited;
        ({ error: insErr } = await supabase.from("products").insert([row]));
        if (!insErr)
          toast.warning(
            "Produit créé SANS le flag édition limitée : la colonne is_limited manque en base (SQL fourni)."
          );
      }
      if (insErr) throw new Error(`Création produit : ${insErr.message}`);

      toast.success(`« ${form.title} » créé et publié sur la boutique 🎉`, { id: tid });
      setSaveOpen(false);
      setForm((f) => ({ ...f, title: "", slug: "", slugTouched: false, description: "" }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors de la sauvegarde", { id: tid });
    } finally {
      setSaving(false);
    }
  };

  const assetsReady = !!assetsRef.current[state.finish];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🎨 Studio de création</h1>
            <p className="text-gray-500 text-sm">
              Composez un baril, puis publiez-le directement sur la boutique.
            </p>
          </div>
          <button
            onClick={openSave}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm"
          >
            💾 Sauvegarder sur la boutique
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
          {/* ---------------- Aperçu (sticky) ---------------- */}
          <div className="lg:sticky lg:top-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
            {!assetsReady && (
              <div className="w-full max-w-lg aspect-square flex items-center justify-center text-gray-400 text-sm animate-pulse">
                Chargement du mockup…
              </div>
            )}
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className={`w-full max-w-lg cursor-pointer rounded-lg ${assetsReady ? "" : "hidden"}`}
            />
            <div className="mt-3 text-sm text-gray-500">
              {state.color.code} · {state.color.name} ·{" "}
              {FINISHES.find((f) => f.id === state.finish)?.label}
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

            {/* Couleur RAL */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Couleur RAL</h2>
              <div className="grid grid-cols-8 gap-2 mb-4">
                {RAL_FAVORITES.map((code) => {
                  const c = findRal(code)!;
                  return (
                    <button
                      key={c.code}
                      title={`${c.code} — ${c.name}`}
                      onClick={() => setState((s) => ({ ...s, color: c }))}
                      className={`aspect-square rounded-full border-2 transition ${
                        state.color.code === c.code
                          ? "border-gray-900 scale-110"
                          : "border-gray-200 hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  );
                })}
              </div>
              {/* Nuancier complet : le curseur s'aimante toujours sur un RAL exact */}
              <input
                type="range"
                min={0}
                max={RAL_CLASSIC.length - 1}
                step={1}
                value={ralIndex}
                onChange={(e) =>
                  setState((s) => ({ ...s, color: RAL_CLASSIC[Number(e.target.value)] }))
                }
                className="w-full h-6 rounded-full appearance-none cursor-pointer border border-gray-200"
                style={{ background: ralGradient }}
              />
              <div className="flex items-center gap-2 mt-2 text-sm">
                <span
                  className="w-5 h-5 rounded-full border border-gray-300 shrink-0"
                  style={{ backgroundColor: state.color.hex }}
                />
                <span className="font-medium text-gray-800">{state.color.code}</span>
                <span className="text-gray-500">· {state.color.name}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {RAL_CLASSIC.length} teintes
                </span>
              </div>
            </section>

            {/* Zones : affichage + calibration */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Zones d'impression</h2>
              <label className="flex items-center justify-between text-sm text-gray-600 cursor-pointer">
                Afficher les zones sur le baril
                <input
                  type="checkbox"
                  checked={showZoneGuides}
                  onChange={(e) => setShowZoneGuides(e.target.checked)}
                />
              </label>
              <button
                onClick={() => setShowCalibration((v) => !v)}
                className="w-full flex justify-between items-center text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100"
              >
                Calibration fine
                <span className="text-gray-400">{showCalibration ? "▲" : "▼"}</span>
              </button>
              {showCalibration && (
                <div className="mt-3 space-y-4 text-sm">
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
                  {(
                    [
                      { key: "sagTop", label: "Courbure haute", min: 0, max: 60, step: 1, unit: "px" },
                      { key: "sagBottom", label: "Courbure basse", min: 0, max: 60, step: 1, unit: "px" },
                    ] as const
                  ).map((s) => (
                    <label key={s.key} className="block">
                      <span className="flex justify-between text-gray-500">
                        {s.label}
                        <span>
                          {calib[s.key]}
                          {s.unit}
                        </span>
                      </span>
                      <input
                        type="range"
                        min={s.min}
                        max={s.max}
                        step={s.step}
                        value={calib[s.key]}
                        onChange={(e) =>
                          setCalib((c) => ({ ...c, [s.key]: Number(e.target.value) }))
                        }
                        className="w-full"
                      />
                    </label>
                  ))}
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

            {/* Visuel par zone */}
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

            {/* Export */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Exporter</h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={exportJpeg}
                  className="py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700"
                >
                  JPEG studio (HD)
                </button>
                <button
                  onClick={exportPng}
                  className="py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700"
                >
                  PNG détouré
                </button>
                <button
                  onClick={exportJson}
                  className="py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 col-span-2"
                >
                  JSON (design rechargeable)
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

      {/* ---------------- Overlay de sauvegarde ---------------- */}
      {saveOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => !saving && setSaveOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-1">Publier sur la boutique</h2>
            <p className="text-sm text-gray-500 mb-4">
              {state.color.code} · {state.color.name} ·{" "}
              {FINISHES.find((f) => f.id === state.finish)?.label}
            </p>

            <div className="space-y-3 text-sm">
              <label className="block">
                <span className="text-gray-700 font-medium">Titre</span>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      title: e.target.value,
                      slug: f.slugTouched ? f.slug : slugify(e.target.value),
                    }))
                  }
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Baril Bleu Gentiane Racing"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">Slug</span>
                <input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: slugify(e.target.value), slugTouched: true }))
                  }
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-xs text-gray-600"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">Collection</span>
                <select
                  value={form.categoryid}
                  onChange={(e) => setForm((f) => ({ ...f, categoryid: e.target.value }))}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Fût 200 L recyclé, peinture RAL cuite au four…"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-gray-700 font-medium">Prix (€)</span>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700 font-medium">Stock initial</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </label>
              </div>
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.isLimited}
                  onChange={(e) => setForm((f) => ({ ...f, isLimited: e.target.checked }))}
                />
                Édition limitée
              </label>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setSaveOpen(false)}
                disabled={saving}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Publication…" : "Publier le baril"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
