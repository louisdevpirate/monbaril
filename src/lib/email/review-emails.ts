import crypto from "crypto";

/**
 * Séquence de demande d'avis après livraison.
 *
 * Deux envois, jamais plus : une demande dix jours après la livraison — le
 * temps que le baril ait trouvé sa place — puis une relance unique dix jours
 * plus tard. Un client qui n'a pas répondu à la seconde n'est plus sollicité.
 */

export const DELAI_DEMANDE_JOURS = 10;
export const DELAI_RELANCE_JOURS = 10;

const SITE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.monbaril.fr";

/** Lien public où déposer l'avis (fiche Google, de préférence). */
export function lienAvis(): string | null {
  return process.env.NEXT_PUBLIC_REVIEW_URL || null;
}

/**
 * Le lien de désinscription est signé : sans signature, n'importe qui pourrait
 * désabonner n'importe quelle commande en devinant un identifiant.
 */
export function jetonOptOut(orderId: string): string {
  return crypto
    .createHmac("sha256", process.env.JWT_SECRET ?? "")
    .update(`review-opt-out:${orderId}`)
    .digest("base64url");
}

export function jetonValide(orderId: string, jeton: string): boolean {
  const attendu = jetonOptOut(orderId);
  const a = Buffer.from(attendu);
  const b = Buffer.from(jeton);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function lienDesinscription(orderId: string): string {
  return `${SITE}/api/reviews/opt-out?commande=${encodeURIComponent(
    orderId
  )}&jeton=${jetonOptOut(orderId)}`;
}

const echapper = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Rangée d'étoiles cliquables : chacune mène au même formulaire. */
function etoiles(lien: string) {
  return `<p style="text-align:center;margin:28px 0 4px;font-size:34px;letter-spacing:6px">${[
    1, 2, 3, 4, 5,
  ]
    .map(
      (n) =>
        `<a href="${lien}" style="text-decoration:none;color:#e64800" aria-label="${n} sur 5">&#9733;</a>`
    )
    .join("")}</p>`;
}

function gabarit({
  titre,
  corps,
  lien,
  libelleBouton,
  optOutUrl,
}: {
  titre: string;
  corps: string;
  lien: string;
  libelleBouton: string;
  optOutUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${echapper(
      titre
    )}</title></head>
    <body style="margin:0;background:#f7f8fb;font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#333">
      <div style="max-width:600px;margin:0 auto;padding:20px">
        <div style="background:linear-gradient(135deg,#e64800,#ff6b35);color:#fff;padding:30px;text-align:center;border-radius:10px 10px 0 0">
          <h1 style="margin:0;font-size:28px">MonBaril™</h1>
        </div>
        <div style="background:#fff;padding:30px;border:1px solid #e5e7eb">
          ${corps}
          ${etoiles(lien)}
          <p style="text-align:center;margin:12px 0 32px">
            <a href="${lien}" style="display:inline-block;background:#e64800;color:#fff;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:bold">${echapper(
              libelleBouton
            )}</a>
          </p>
        </div>
        <div style="background:#f9fafb;padding:20px;text-align:center;border-radius:0 0 10px 10px;font-size:13px;color:#6b7280">
          <p style="margin:0 0 8px">MonBaril™ — atelier de Longvic (21), Bourgogne-Franche-Comté</p>
          <p style="margin:0"><a href="${optOutUrl}" style="color:#9ca3af">Ne plus recevoir de demande d'avis</a></p>
        </div>
      </div>
    </body>
    </html>`;
}

export interface CommandeAvis {
  orderId: string;
  orderNumber: string;
  email: string;
  prenom?: string | null;
  livreLe?: string | null;
}

const dateFr = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

/** Premier envoi, dix jours après la livraison. */
export function emailDemandeAvis(c: CommandeAvis, lien: string) {
  const bonjour = c.prenom ? `Bonjour ${echapper(c.prenom)},` : "Bonjour,";
  const livraison = dateFr(c.livreLe);
  return {
    subject: `Votre avis sur la commande ${c.orderNumber}`,
    html: gabarit({
      titre: "Votre avis compte",
      libelleBouton: "Donner mon avis",
      lien,
      optOutUrl: lienDesinscription(c.orderId),
      corps: `
        <h2 style="margin:0 0 20px;font-size:22px;color:#0a1a3c">Votre avis compte</h2>
        <p>${bonjour}</p>
        <p>Votre commande <strong>${echapper(c.orderNumber)}</strong> vous a été
        livrée${livraison ? ` le ${echapper(livraison)}` : ""}. Nous espérons
        qu'elle vous donne entière satisfaction.</p>
        <p>Prenez un instant pour évaluer votre expérience : votre avis nous
        permet d'améliorer nos produits et notre service, et aide les futurs
        clients dans leur choix.</p>
        <p style="color:#6b7280;font-size:14px">L'opération ne prend qu'une
        minute.</p>`,
    }),
  };
}

/** Relance unique, dix jours après la demande restée sans réponse. */
export function emailRelanceAvis(c: CommandeAvis, lien: string) {
  const bonjour = c.prenom ? `Bonjour ${echapper(c.prenom)},` : "Bonjour,";
  return {
    subject: "Il vous reste un instant pour donner votre avis ?",
    html: gabarit({
      titre: "Votre avis compte",
      libelleBouton: "Donner mon avis",
      lien,
      optOutUrl: lienDesinscription(c.orderId),
      corps: `
        <h2 style="margin:0 0 20px;font-size:22px;color:#0a1a3c">Il vous reste un instant&nbsp;?</h2>
        <p>${bonjour}</p>
        <p>Vous n'avez pas encore évalué votre commande
        <strong>${echapper(c.orderNumber)}</strong>. Votre retour compte pour
        nous&nbsp;: une minute suffit.</p>
        <p>Une question ou un problème sur votre commande&nbsp;? Notre service
        client vous répond à
        <a href="mailto:contact@monbaril.fr" style="color:#e64800">contact@monbaril.fr</a>.</p>
        <p style="color:#6b7280;font-size:14px">Ceci est notre dernier message
        au sujet de cet avis.</p>`,
    }),
  };
}

export async function envoyer(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "MonBaril <noreply@monbaril.fr>",
      to: [to],
      reply_to: "contact@monbaril.fr",
      subject,
      html,
    }),
  });
  if (!res.ok) {
    console.error("Resend error:", await res.text());
    return false;
  }
  return true;
}
