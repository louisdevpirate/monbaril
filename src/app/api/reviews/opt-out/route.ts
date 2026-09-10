import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { jetonValide } from "@/lib/email/review-emails";

/**
 * Désinscription des demandes d'avis, depuis le lien en pied d'email.
 *
 * Le jeton est une signature de l'identifiant de commande : sans lui, il
 * suffirait de deviner un identifiant pour désabonner le client d'un autre.
 */
export async function GET(req: NextRequest) {
  const commande = req.nextUrl.searchParams.get("commande");
  const jeton = req.nextUrl.searchParams.get("jeton");

  const page = (titre: string, texte: string) =>
    new NextResponse(
      `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
       <meta name="viewport" content="width=device-width,initial-scale=1">
       <title>${titre} — MonBaril™</title></head>
       <body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f7f8fb;font-family:Arial,Helvetica,sans-serif;color:#0a1a3c">
         <div style="max-width:460px;padding:40px;text-align:center">
           <h1 style="font-size:22px;margin:0 0 12px">${titre}</h1>
           <p style="color:#4b5563;line-height:1.6">${texte}</p>
           <p style="margin-top:28px"><a href="https://www.monbaril.fr" style="color:#e64800">Retour à la boutique</a></p>
         </div>
       </body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );

  if (!commande || !jeton || !jetonValide(commande, jeton)) {
    return page(
      "Lien invalide",
      "Ce lien de désinscription n'est plus valable. Écrivez-nous à contact@monbaril.fr et nous nous en occupons."
    );
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ review_opt_out: true })
    .eq("id", commande);

  if (error) {
    console.error("Désinscription avis:", error);
    return page(
      "Une erreur est survenue",
      "Nous n'avons pas pu enregistrer votre choix. Écrivez-nous à contact@monbaril.fr, nous le ferons manuellement."
    );
  }

  return page(
    "C'est noté",
    "Vous ne recevrez plus de demande d'avis. Les emails liés à vos commandes, eux, continueront de vous parvenir."
  );
}
