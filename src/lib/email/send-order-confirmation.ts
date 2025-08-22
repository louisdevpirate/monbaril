import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation({
  to,
  orderNumber,
}: {
  to: string;
  orderNumber: string;
}) {

  console.log("📤 Envoi de l'email à :", to);
  try {
    const { data, error } = await resend.emails.send({
      from: "MONBARIL <contact@monbaril.fr>",
      to: [to],
      subject: "Confirmation de votre commande Mon Baril",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">🎉 Merci pour votre commande !</h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">
              <strong>Numéro de commande :</strong> <span style="color: #3b82f6; font-weight: bold;">${orderNumber}</span>
            </p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            Votre baril personnalisable est en cours de préparation. Nous vous tiendrons informé dès qu'il sera prêt à l'envoi.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a 
              href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/invoice/download/${orderNumber}"
              style="
                display: inline-block;
                background-color: #3b82f6;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
                margin: 10px;
              "
            >
              📄 Télécharger votre facture
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <a 
              href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}"
              style="color: #3b82f6; text-decoration: none;"
            >
              Retourner sur le site
            </a>
          </div>
        </div>
      `,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Erreur envoi email :", err);
    return null;
  }
}