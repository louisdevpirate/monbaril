"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabaseClient";

interface Category {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  video?: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number | null;
}

interface FormState {
  title: string;
  slug: string;
  description: string;
  image: string;
  video: string;
  is_active: boolean;
  sort_order: number;
}

const emptyForm = (nextOrder: number): FormState => ({
  title: "",
  slug: "",
  description: "",
  image: "",
  video: "",
  is_active: true,
  sort_order: nextOrder,
});

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ---------------------------------------------------------------------------
// Carte d'aperçu — la vidéo (si présente) se lance au survol, façon Disney+
// ---------------------------------------------------------------------------

function CollectionCover({ category }: { category: Category }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      className="relative aspect-[16/10] bg-gray-100 overflow-hidden group/cover"
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        const v = videoRef.current;
        if (v) {
          v.pause();
          v.currentTime = 0;
        }
      }}
    >
      {category.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={category.image}
          alt={category.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/cover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
          Aucune image
        </div>
      )}
      {category.video && (
        <video
          ref={videoRef}
          src={category.video}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300"
        />
      )}
      {!category.is_active && (
        <span className="absolute top-3 left-3 bg-gray-900/80 text-white text-xs px-2.5 py-1 rounded-full">
          Inactive
        </span>
      )}
      {category.video && (
        <span className="absolute top-3 right-3 bg-white/85 text-gray-700 text-xs px-2.5 py-1 rounded-full">
          ▶ vidéo
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm(1));
  const [uploading, setUploading] = useState<"image" | "video" | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const fetchAll = async () => {
    try {
      const [{ data: cats, error }, { data: prods }] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order", { ascending: true }),
        supabase.from("products").select("categoryid"),
      ]);
      if (error) throw error;
      setCategories(cats || []);
      const counts: Record<string, number> = {};
      (prods || []).forEach((p) => {
        counts[p.categoryid] = (counts[p.categoryid] || 0) + 1;
      });
      setProductCounts(counts);
    } catch (e) {
      console.error("Erreur chargement collections:", e);
      toast.error("Erreur lors du chargement des collections");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // --- Upload d'un média de cover vers le bucket ---------------------------
  const uploadMedia = async (file: File, kind: "image" | "video") => {
    const maxMo = kind === "image" ? 8 : 50;
    if (file.size > maxMo * 1024 * 1024) {
      toast.error(`Fichier trop lourd (max ${maxMo} Mo)`);
      return;
    }
    setUploading(kind);
    try {
      const ext = file.name.split(".").pop() || (kind === "image" ? "jpg" : "mp4");
      const path = `collections/${form.slug || "collection"}-${kind}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("barils")
        .upload(path, file, { contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("barils").getPublicUrl(path);
      setForm((f) => ({ ...f, [kind]: data.publicUrl }));
      toast.success(kind === "image" ? "Image uploadée" : "Vidéo uploadée");
    } catch (e) {
      toast.error(e instanceof Error ? `Upload : ${e.message}` : "Erreur d'upload");
    } finally {
      setUploading(null);
    }
  };

  // --- Création / édition ---------------------------------------------------
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(categories.length + 1));
    setShowForm(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({
      title: c.title,
      slug: c.slug,
      description: c.description || "",
      image: c.image || "",
      video: c.video || "",
      is_active: c.is_active,
      sort_order: c.sort_order ?? 1,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Le titre est requis");
    const slug = editing ? editing.slug : form.slug || slugify(form.title);
    if (!slug) return toast.error("Slug invalide");

    setIsSaving(true);
    try {
      const row: Record<string, unknown> = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        image: form.image || null,
        video: form.video || null,
        is_active: form.is_active,
        sort_order: form.sort_order,
      };
      let error;
      if (editing) {
        ({ error } = await supabase.from("categories").update(row).eq("id", editing.id));
      } else {
        ({ error } = await supabase
          .from("categories")
          .insert({ id: slug, slug, ...row }));
      }
      if (error && /video/i.test(error.message)) {
        // Colonne video absente : on sauvegarde sans, en prévenant
        delete row.video;
        if (editing) {
          ({ error } = await supabase.from("categories").update(row).eq("id", editing.id));
        } else {
          ({ error } = await supabase.from("categories").insert({ id: slug, slug, ...row }));
        }
        if (!error)
          toast.warning(
            "Sauvegardé SANS la vidéo : la colonne `video` manque en base (SQL fourni)."
          );
      }
      if (error) throw new Error(error.message);
      toast.success(editing ? "Collection mise à jour" : `Collection « ${form.title} » créée`);
      setShowForm(false);
      await fetchAll();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Suppression (bloquée si des produits l'utilisent) --------------------
  const handleDelete = async (c: Category) => {
    const count = productCounts[c.id] || 0;
    if (count > 0) {
      toast.error(
        `Impossible : ${count} produit${count > 1 ? "s" : ""} utilise${count > 1 ? "nt" : ""} cette collection. Réassignez-les d'abord dans Produits.`
      );
      return;
    }
    if (!confirm(`Supprimer définitivement la collection « ${c.title} » ?`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", c.id);
    if (error) {
      toast.error(`Suppression impossible : ${error.message}`);
      return;
    }
    toast.success("Collection supprimée");
    await fetchAll();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🗂️ Collections</h1>
            <p className="text-gray-500 text-sm">
              Créez, modifiez ou supprimez les collections de la boutique. La vidéo de
              cover se lance au survol (façon Disney+).
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm"
          >
            + Nouvelle collection
          </button>
        </div>

        {/* Grille des collections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
              <CollectionCover category={c} />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-gray-900">{c.title}</h2>
                    <p className="text-xs text-gray-400 font-mono">/{c.slug}</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {productCounts[c.id] || 0} produit{(productCounts[c.id] || 0) > 1 ? "s" : ""}
                  </span>
                </div>
                {c.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{c.description}</p>
                )}
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openEdit(c)}
                    className="flex-1 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    className="flex-1 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-sm text-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            Aucune collection — créez la première !
          </div>
        )}
      </div>

      {/* ---------------- Modal création / édition ---------------- */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => !isSaving && setShowForm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editing ? `Modifier « ${editing.title} »` : "Nouvelle collection"}
            </h2>

            <div className="space-y-4 text-sm">
              <label className="block">
                <span className="text-gray-700 font-medium">Titre</span>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      title: e.target.value,
                      slug: editing ? f.slug : slugify(e.target.value),
                    }))
                  }
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Street Art"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium">
                  Slug {editing && <em className="text-gray-400">(non modifiable)</em>}
                </span>
                <input
                  value={form.slug}
                  disabled={!!editing}
                  onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-xs text-gray-600 disabled:bg-gray-50"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="L'esprit du bitume, en 200 litres."
                />
              </label>

              {/* Cover image */}
              <div>
                <span className="text-gray-700 font-medium">Image de cover</span>
                {form.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.image}
                    alt=""
                    className="mt-2 w-full aspect-[16/10] object-cover rounded-lg border border-gray-200"
                  />
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadMedia(f, "image");
                    e.target.value = "";
                  }}
                />
                <button
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploading !== null}
                  className="mt-2 w-full py-2 rounded-lg border border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50"
                >
                  {uploading === "image"
                    ? "Upload en cours…"
                    : form.image
                      ? "Remplacer l'image"
                      : "Uploader une image"}
                </button>
              </div>

              {/* Cover vidéo */}
              <div>
                <span className="text-gray-700 font-medium">
                  Vidéo de cover <em className="text-gray-400">(optionnelle — jouée au survol)</em>
                </span>
                {form.video && (
                  <video
                    src={form.video}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="mt-2 w-full aspect-[16/10] object-cover rounded-lg border border-gray-200"
                  />
                )}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadMedia(f, "video");
                    e.target.value = "";
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    disabled={uploading !== null}
                    className="flex-1 py-2 rounded-lg border border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50"
                  >
                    {uploading === "video"
                      ? "Upload en cours…"
                      : form.video
                        ? "Remplacer la vidéo"
                        : "Uploader une vidéo (mp4/webm)"}
                  </button>
                  {form.video && (
                    <button
                      onClick={() => setForm((f) => ({ ...f, video: "" }))}
                      className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      Retirer
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  />
                  Collection active
                </label>
                <label className="flex items-center gap-2 text-gray-700">
                  Ordre
                  <input
                    type="number"
                    min={1}
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
                    }
                    className="w-16 border border-gray-300 rounded-lg px-2 py-1"
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowForm(false)}
                disabled={isSaving}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || uploading !== null}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
              >
                {isSaving ? "Sauvegarde…" : editing ? "Enregistrer" : "Créer la collection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
