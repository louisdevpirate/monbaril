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
        <h1>Merci pour votre commande !</h1>
        <p>Votre numéro de commande est : <strong>${orderNumber}</strong></p>
        <p>Nous vous tiendrons informé dès que votre baril sera prêt à l'envoi.</p>
        <a href="https://monbaril.fr">Retourner sur le site</a>
      `,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Erreur envoi email :", err);
    return null;
  }
}