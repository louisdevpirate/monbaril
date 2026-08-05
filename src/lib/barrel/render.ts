// ---------------------------------------------------------------------------
// Moteur de rendu du baril — partagé entre le studio admin et la boutique.
//
// Le studio y ajoute ses zones d'impression ; la page produit monochrome
// n'utilise que la recolorisation (couleur RAL + finition).
// ---------------------------------------------------------------------------

export type Finish = "brillant" | "mat" | "graine";

// Deux niveaux de résolution : copies 1600px pour l'aperçu interactif,
// fichiers 5000px chargés à la demande pour les exports et la publication.
// Moteur de rendu par finition :
// - "luminance" (brillant) : reflets blancs émergents — validé sur planche.
// - "multiply" (mat, grainé) : moteur historique, que ces finitions gardent
//   car leur rendu d'origine convenait déjà.
export type RenderEngine = "luminance" | "multiply";

export const FINISHES: {
  id: Finish;
  label: string;
  src: string;
  bgSrc: string;
  hdSrc: string;
  hdBgSrc: string;
  engine: RenderEngine;
  specStrength: number; // intensité des reflets extraits (moteur multiply uniquement)
  specBlur: number; // flou des reflets, fraction de la largeur (0 = net) — mat diffus
}[] = [
  {
    id: "brillant",
    label: "Brillant",
    src: "/customizer/base/preview/brillantnobg.png",
    bgSrc: "/customizer/base/preview/brillant.png",
    hdSrc: "/customizer/base/brillantnobg.png",
    hdBgSrc: "/customizer/base/brillant.png",
    engine: "luminance",
    specStrength: 1,
    specBlur: 0,
  },
  {
    id: "mat",
    label: "Mat",
    src: "/customizer/base/preview/matnobg.png",
    bgSrc: "/customizer/base/preview/mat.png",
    hdSrc: "/customizer/base/matnobg.png",
    hdBgSrc: "/customizer/base/mat.png",
    engine: "multiply",
    specStrength: 0.5,
    specBlur: 1 / 120,
  },
  {
    id: "graine",
    label: "Grainé",
    src: "/customizer/base/preview/grainynobg.png",
    bgSrc: "/customizer/base/preview/grainy.png",
    hdSrc: "/customizer/base/grainynobg.png",
    hdBgSrc: "/customizer/base/grainy.png",
    engine: "multiply",
    specStrength: 0.65,
    specBlur: 0,
  },
];

// Les courbures (px) de la calibration sont exprimées à cette échelle,
// puis converties proportionnellement pour le rendu 5000px
export const SAG_BASE_WIDTH = 1600;

export interface FinishAssets {
  width: number;
  height: number;
  mask: HTMLCanvasElement;
  bg: HTMLImageElement; // photo studio complète (fond gris clair + ombre portée)
  bbox: { x: number; y: number; w: number; h: number };
  engine: RenderEngine;
  // Moteur « luminance préservée » (brillant) : deux cartes indépendantes de
  // la couleur. up = reflets (blanc, alpha), dn = ombres (noir, alpha).
  // Rendu : aplat RAL → visuels → up → dn. Les reflets blancs naissent de la
  // photo elle-même — aucune extraction, identique sur les 213 teintes.
  up?: HTMLCanvasElement;
  dn?: HTMLCanvasElement;
  // Moteur multiply historique (mat, grainé) : couleur × ombrage, puis
  // hautes lumières extraites re-projetées en screen.
  shading?: HTMLCanvasElement;
  spec?: HTMLCanvasElement;
  specStrength?: number;
}

// Réglages de rendu exposés dans l'UI du studio (curseurs)
export interface RenderTuning {
  gloss: number; // intensité des reflets (défaut 0.95 — valeurs de la planche validée)
  shadow: number; // profondeur des ombres (défaut 1.0)
}

export const DEFAULT_TUNING: RenderTuning = { gloss: 0.95, shadow: 1.0 };

// ---------------------------------------------------------------------------
// Pré-traitement d'une photo de baril
// ---------------------------------------------------------------------------

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error(`Impossible de charger ${src}`));
    img.src = src;
  });
}

export async function buildFinishAssets(
  src: string,
  bgSrc: string,
  engine: RenderEngine,
  specStrength: number,
  specBlur: number
): Promise<FinishAssets> {
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
  const base = {
    width: W,
    height: H,
    mask,
    bg,
    bbox: { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 },
  };

  // --- Moteur multiply historique (mat, grainé) — inchangé depuis la prod ---
  if (engine === "multiply") {
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
    const spctx = spec.getContext("2d")!;
    const spdata = spctx.createImageData(W, H);
    const spp = spdata.data;

    const specRange = Math.max(1, 255 - p90);
    for (let i = 0, p = 0; i < W * H; i++, p += 4) {
      const a = px[p + 3];
      const norm = Math.min(255, Math.round((lums[i] / p99) * 255));
      sp[p] = sp[p + 1] = sp[p + 2] = norm;
      sp[p + 3] = a;
      let s = (lums[i] - p90) / specRange;
      s = s <= 0 ? 0 : Math.pow(s, 1.6);
      spp[p] = spp[p + 1] = spp[p + 2] = 255;
      spp[p + 3] = Math.round(Math.min(1, s) * (a / 255) * 255);
    }
    sctx.putImageData(sdata, 0, 0);
    spctx.putImageData(spdata, 0, 0);

    // Peinture mate : la lumière est diffusée — on étale la carte de reflets
    let specOut = spec;
    if (specBlur > 0) {
      const soft = document.createElement("canvas");
      soft.width = W;
      soft.height = H;
      const softCtx = soft.getContext("2d")!;
      softCtx.filter = `blur(${Math.max(2, W * specBlur)}px)`;
      softCtx.drawImage(spec, 0, 0);
      specOut = soft;
    }

    return { ...base, engine, shading, spec: specOut, specStrength };
  }

  // --- Moteur luminance (brillant) -----------------------------------------
  // Ancre : luminance médiane du fût — elle devient la couleur RAL pleine.
  // Au-dessus, la courbe gamma envoie les seuls vrais reflets vers le blanc ;
  // en dessous, les ombres descendent vers le noir.
  const anchor = Math.max(1, pct(0.5)) / 255;

  // Débruitage « coring » : luminance lissée + détail réinjecté seulement
  // au-dessus du bruit (garde le galbe et les arêtes, retire le grain photo)
  const lumC = document.createElement("canvas");
  lumC.width = W;
  lumC.height = H;
  const lctx = lumC.getContext("2d")!;
  const ldata = lctx.createImageData(W, H);
  const lp = ldata.data;
  for (let i = 0, p = 0; i < W * H; i++, p += 4) {
    lp[p] = lp[p + 1] = lp[p + 2] = lums[i];
    lp[p + 3] = 255;
  }
  lctx.putImageData(ldata, 0, 0);
  const blurC = document.createElement("canvas");
  blurC.width = W;
  blurC.height = H;
  const bctx2 = blurC.getContext("2d")!;
  bctx2.filter = `blur(${Math.max(2, W / 250)}px)`;
  bctx2.drawImage(lumC, 0, 0);
  const blurPx = bctx2.getImageData(0, 0, W, H).data;

  const up = document.createElement("canvas");
  up.width = W;
  up.height = H;
  const uctx = up.getContext("2d")!;
  const udata = uctx.createImageData(W, H);
  const upx = udata.data;
  const dn = document.createElement("canvas");
  dn.width = W;
  dn.height = H;
  const dctx = dn.getContext("2d")!;
  const ddata = dctx.createImageData(W, H);
  const dpx = ddata.data;

  const clip01 = (v: number) => (v <= 0 ? 0 : v >= 1 ? 1 : v);
  for (let i = 0, p = 0; i < W * H; i++, p += 4) {
    const a = px[p + 3];
    // Coring
    const detail = lums[i] - blurPx[p];
    const keep = clip01((Math.abs(detail) - 5) / 12);
    const L = Math.max(0, Math.min(255, blurPx[p] + detail * (0.15 + 0.85 * keep))) / 255;
    // Remap : anchor → 0.5
    const t = L < anchor ? (0.5 * L) / anchor : 0.5 + (0.5 * (L - anchor)) / Math.max(1e-3, 1 - anchor);
    const u = Math.pow(clip01((t - 0.5) * 2), 2.8);
    const d = Math.pow(clip01((0.5 - t) * 2), 1.3);
    upx[p] = upx[p + 1] = upx[p + 2] = 255;
    upx[p + 3] = Math.round(u * (a / 255) * 255);
    dpx[p] = dpx[p + 1] = dpx[p + 2] = 0;
    dpx[p + 3] = Math.round(d * (a / 255) * 255);
  }
  uctx.putImageData(udata, 0, 0);
  dctx.putImageData(ddata, 0, 0);

  return { ...base, engine, up, dn };
}

// ---------------------------------------------------------------------------
// Compositing du corps du baril
// ---------------------------------------------------------------------------

/**
 * Peint le fût recoloré sur `bctx` (canvas hors écran de la taille des assets).
 * `drawDesigns` est appelé au moment exact où les visuels doivent être posés
 * dans la pile de composition — le studio s'en sert pour ses zones
 * d'impression, la page produit monochrome ne le fournit pas.
 */
export function paintBarrel(
  bctx: CanvasRenderingContext2D,
  assets: FinishAssets,
  colorHex: string,
  tuning: RenderTuning,
  drawDesigns?: (ctx: CanvasRenderingContext2D) => void
) {
  const { width: W, height: H } = assets;

  if (assets.engine === "luminance" && assets.up && assets.dn) {
    // --- Moteur luminance (brillant) ---------------------------------------
    // 1. Aplat de la couleur RAL (la teinte du corps est la couleur exacte)
    bctx.fillStyle = colorHex;
    bctx.fillRect(0, 0, W, H);
    // 2. Visuels (baril entier + zones individuelles)
    drawDesigns?.(bctx);
    // 3. Reflets (blanc) puis ombres (noir), dosés par les curseurs
    bctx.globalAlpha = tuning.gloss;
    bctx.drawImage(assets.up, 0, 0);
    bctx.globalAlpha = tuning.shadow;
    bctx.drawImage(assets.dn, 0, 0);
    bctx.globalAlpha = 1;
    // 4. Découpe à la silhouette du baril
    bctx.globalCompositeOperation = "destination-in";
    bctx.drawImage(assets.mask, 0, 0);
    bctx.globalCompositeOperation = "source-over";
  } else if (assets.shading && assets.spec) {
    // --- Moteur multiply historique (mat, grainé) --------------------------
    bctx.drawImage(assets.shading, 0, 0);
    bctx.globalCompositeOperation = "multiply";
    bctx.fillStyle = colorHex;
    bctx.fillRect(0, 0, W, H);
    bctx.globalCompositeOperation = "destination-in";
    bctx.drawImage(assets.mask, 0, 0);
    bctx.globalCompositeOperation = "source-over";

    drawDesigns?.(bctx);
    bctx.globalCompositeOperation = "destination-in";
    bctx.drawImage(assets.mask, 0, 0);

    bctx.globalCompositeOperation = "screen";
    bctx.globalAlpha = assets.specStrength ?? 1;
    bctx.drawImage(assets.spec, 0, 0);
    bctx.globalAlpha = 1;
    bctx.globalCompositeOperation = "source-over";
  }
}

/**
 * Rendu complet d'un baril monochrome : photo studio (fond + ombre portée)
 * puis fût recoloré. Aucune zone d'impression — c'est le rendu de la boutique.
 */
export function renderMonochrome(
  canvas: HTMLCanvasElement,
  assets: FinishAssets,
  colorHex: string,
  tuning: RenderTuning = DEFAULT_TUNING,
  opts: { background?: boolean } = {}
) {
  const { width: W, height: H } = assets;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  const barrel = document.createElement("canvas");
  barrel.width = W;
  barrel.height = H;
  paintBarrel(barrel.getContext("2d")!, assets, colorHex, tuning);

  if (opts.background !== false) ctx.drawImage(assets.bg, 0, 0, W, H);
  ctx.drawImage(barrel, 0, 0);
}
