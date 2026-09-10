import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import {
  DELAI_DEMANDE_JOURS,
  DELAI_RELANCE_JOURS,
  emailDemandeAvis,
  emailRelanceAvis,
  envoyer,
  lienAvis,
  type CommandeAvis,
} from "@/lib/email/review-emails";

/**
 * Balayage quotidien des commandes livrées, appelé par Vercel Cron.
 *
 * Rien n'est envoyé à l'instant de la livraison : la séquence est différée, et
 * c'est ce passage quotidien qui décide qui a atteint son échéance. Chaque
 * envoi est horodaté dans la commande, de sorte qu'un second passage le même
 * jour — ou un redéploiement — ne réexpédie rien.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LOT_MAX = 50; // borne la durée d'exécution sur un rattrapage

const ilYAJours = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

function autorise(req: NextRequest) {
  const attendu = process.env.CRON_SECRET;
  if (!attendu) return false;
  return req.headers.get("authorization") === `Bearer ${attendu}`;
}

export async function GET(req: NextRequest) {
  if (!autorise(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const lien = lienAvis();
  if (!lien) {
    // Mieux vaut ne rien envoyer qu'un email dont le bouton ne mène nulle part.
    return NextResponse.json(
      { error: "NEXT_PUBLIC_REVIEW_URL n'est pas configurée : aucun envoi." },
      { status: 500 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const bilan = { demandes: 0, relances: 0, echecs: 0 };

  const champs = "id, order_number, email, shipping_name, delivered_at";

  // La table ne garde pas le prénom séparément : Stripe renvoie un nom complet.
  const prenomDe = (nom: string | null) =>
    nom ? nom.trim().split(/\s+/)[0] || null : null;

  // 1. Première demande : livrée il y a assez longtemps, jamais sollicitée.
  const { data: aDemander, error: e1 } = await supabase
    .from("orders")
    .select(champs)
    .eq("status", "delivered")
    .eq("review_opt_out", false)
    .is("review_request_sent_at", null)
    .not("delivered_at", "is", null)
    .lte("delivered_at", ilYAJours(DELAI_DEMANDE_JOURS))
    .limit(LOT_MAX);

  if (e1) {
    console.error("Lecture des commandes à solliciter:", e1);
    return NextResponse.json({ error: "Lecture impossible." }, { status: 500 });
  }

  for (const o of (aDemander ?? []) as unknown as Array<
    Record<string, string | null>
  >) {
    const c: CommandeAvis = {
      orderId: String(o.id),
      orderNumber: String(o.order_number ?? ""),
      email: String(o.email ?? ""),
      prenom: prenomDe(o.shipping_name),
      livreLe: o.delivered_at,
    };
    if (!c.email) continue;

    const { subject, html } = emailDemandeAvis(c, lien);
    if (await envoyer(c.email, subject, html)) {
      await supabase
        .from("orders")
        .update({ review_request_sent_at: new Date().toISOString() })
        .eq("id", o.id as string);
      bilan.demandes++;
    } else {
      bilan.echecs++;
    }
  }

  // 2. Relance unique : sollicitée, sans nouvelle depuis, jamais relancée.
  const { data: aRelancer, error: e2 } = await supabase
    .from("orders")
    .select(champs)
    .eq("review_opt_out", false)
    .is("review_reminder_sent_at", null)
    .not("review_request_sent_at", "is", null)
    .lte("review_request_sent_at", ilYAJours(DELAI_RELANCE_JOURS))
    .limit(LOT_MAX);

  if (e2) {
    console.error("Lecture des commandes à relancer:", e2);
    return NextResponse.json({ ...bilan, error: "Relances ignorées." });
  }

  for (const o of (aRelancer ?? []) as unknown as Array<
    Record<string, string | null>
  >) {
    const c: CommandeAvis = {
      orderId: String(o.id),
      orderNumber: String(o.order_number ?? ""),
      email: String(o.email ?? ""),
      prenom: prenomDe(o.shipping_name),
      livreLe: o.delivered_at,
    };
    if (!c.email) continue;

    const { subject, html } = emailRelanceAvis(c, lien);
    if (await envoyer(c.email, subject, html)) {
      await supabase
        .from("orders")
        .update({ review_reminder_sent_at: new Date().toISOString() })
        .eq("id", o.id as string);
      bilan.relances++;
    } else {
      bilan.echecs++;
    }
  }

  console.log("Séquence avis:", bilan);
  return NextResponse.json({ ok: true, ...bilan });
}
