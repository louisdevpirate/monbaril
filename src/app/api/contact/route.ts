import { NextRequest, NextResponse } from "next/server";

const SUBJECTS: Record<string, string> = {
  question: "Question générale",
  commande: "Problème de commande",
  livraison: "Question livraison",
  retour: "Retour / Échange",
  autre: "Autre",
};

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  const subjectLabel = SUBJECTS[subject] ?? subject;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:#f97316;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="margin:0;color:#fff;font-size:22px">Nouveau message — MonBaril™</h1>
      </div>
      <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <tr><td style="padding:8px 0;color:#6b7280;width:120px">Nom</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#f97316">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Sujet</td><td style="padding:8px 0">${subjectLabel}</td></tr>
        </table>
        <div style="background:#f9fafb;border-radius:8px;padding:20px;white-space:pre-wrap;font-size:15px;line-height:1.6">${message}</div>
        <p style="margin-top:24px;font-size:13px;color:#9ca3af">Répondre directement à cet email pour contacter ${name}.</p>
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
      from: "MonBaril Contact <noreply@monbaril.fr>",
      to: ["louisdole.pro@gmail.com"],
      reply_to: email,
      subject: `[Contact] ${subjectLabel} — ${name}`,
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
