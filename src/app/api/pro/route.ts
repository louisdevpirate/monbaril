import { NextRequest, NextResponse } from "next/server";

const SECTORS: Record<string, string> = {
  concession: "Concession auto / moto",
  restauration: "Bar · Restaurant · Hôtel",
  retail: "Retail · Showroom",
  evenementiel: "Événementiel · Salon · PLV",
  bureau: "Bureau · Entreprise",
  autre: "Autre",
};

const QUANTITIES: Record<string, string> = {
  "1-4": "1 à 4 barils",
  "5-9": "5 à 9 barils",
  "10-24": "10 à 24 barils",
  "25-49": "25 à 49 barils",
  "50+": "50 barils et plus",
};

/**
 * Une demande de devis pro n'est pas un message de contact : elle porte une
 * société, un volume et une teinte, et c'est sur ces trois champs que l'atelier
 * décide quoi répondre. On les remonte en tête du mail plutôt que noyés dans un
 * paragraphe libre.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    company,
    name,
    email,
    phone,
    sector,
    quantity,
    ral,
    logo,
    deadline,
    message,
  } = body ?? {};

  if (!company || !name || !email || !sector || !quantity) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email))) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const esc = (v: unknown) =>
    String(v ?? "")
      .slice(0, 4000)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const sectorLabel = SECTORS[sector] ?? sector;
  const quantityLabel = QUANTITIES[quantity] ?? quantity;

  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:8px 0;color:#6b7280;width:150px">${label}</td><td style="padding:8px 0">${value}</td></tr>`
      : "";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:#111827;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="margin:0;color:#fff;font-size:22px">Demande de devis PRO — MonBaril™</h1>
        <p style="margin:6px 0 0;color:#f97316;font-size:14px;font-weight:600">${esc(quantityLabel)} · ${esc(sectorLabel)}</p>
      </div>
      <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${row("Société", `<strong>${esc(company)}</strong>`)}
          ${row("Contact", esc(name))}
          ${row("Email", `<a href="mailto:${esc(email)}" style="color:#f97316">${esc(email)}</a>`)}
          ${row("Téléphone", phone ? `<a href="tel:${esc(phone)}" style="color:#f97316">${esc(phone)}</a>` : "")}
          ${row("Secteur", esc(sectorLabel))}
          ${row("Volume", `<strong>${esc(quantityLabel)}</strong>`)}
          ${row("Teinte RAL", esc(ral))}
          ${row("Marquage logo", logo ? "Oui — logo à récupérer auprès du client" : "Non")}
          ${row("Échéance", esc(deadline))}
        </table>
        ${
          message
            ? `<div style="background:#f9fafb;border-radius:8px;padding:20px;white-space:pre-wrap;font-size:15px;line-height:1.6">${esc(message)}</div>`
            : ""
        }
        <p style="margin-top:24px;font-size:13px;color:#9ca3af">Répondre directement à cet email pour joindre ${esc(name)} (${esc(company)}).</p>
      </div>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "MonBaril Pro <noreply@monbaril.fr>",
      to: ["louisdole.pro@gmail.com"],
      reply_to: email,
      subject: `[PRO] ${quantityLabel} — ${company} (${sectorLabel})`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
