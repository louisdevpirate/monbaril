import { createSupabaseServerClient } from '@/lib/supabase/server';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface OrderEmailData {
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  totalPrice: number;
  status: string;
  orderDate: string;
  trackingNumber?: string;
}

export async function sendOrderConfirmationEmail(orderData: OrderEmailData) {
  const emailData: EmailData = {
    to: orderData.customerEmail,
    subject: `Confirmation de commande ${orderData.orderNumber} - MonBaril™`,
    html: generateOrderConfirmationHTML(orderData),
    text: generateOrderConfirmationText(orderData)
  };

  return await sendEmail(emailData);
}

export async function sendOrderStatusUpdateEmail(orderData: OrderEmailData) {
  const statusMessages = {
    processing: {
      subject: `Votre commande ${orderData.orderNumber} est en cours de préparation - MonBaril™`,
      message: 'Nous préparons votre commande avec soin.'
    },
    shipped: {
      subject: `Votre commande ${orderData.orderNumber} a été expédiée - MonBaril™`,
      message: 'Votre commande est en route vers vous !'
    },
    delivered: {
      subject: `Votre commande ${orderData.orderNumber} a été livrée - MonBaril™`,
      message: 'Votre commande a été livrée avec succès.'
    },
    cancelled: {
      subject: `Votre commande ${orderData.orderNumber} a été annulée - MonBaril™`,
      message: 'Votre commande a été annulée.'
    }
  };

  const statusInfo = statusMessages[orderData.status as keyof typeof statusMessages];
  
  if (!statusInfo) {
    console.error('Statut de commande non reconnu:', orderData.status);
    return false;
  }

  const emailData: EmailData = {
    to: orderData.customerEmail,
    subject: statusInfo.subject,
    html: generateOrderStatusUpdateHTML(orderData, statusInfo.message),
    text: generateOrderStatusUpdateText(orderData, statusInfo.message)
  };

  return await sendEmail(emailData);
}

async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // Utiliser Resend pour l'envoi d'emails
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'MonBaril <noreply@monbaril.fr>',
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur envoi email:', errorData);
      return false;
    }

    console.log('Email envoyé avec succès à:', emailData.to);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}

function generateOrderConfirmationHTML(orderData: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de commande</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e64800, #ff6b35); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
        .order-summary { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item { display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #e5e7eb; }
        .item:last-child { border-bottom: none; }
        .item-image { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px; }
        .item-details { flex: 1; }
        .item-name { font-weight: bold; margin-bottom: 5px; }
        .item-quantity { color: #6b7280; font-size: 14px; }
        .item-price { font-weight: bold; color: #e64800; }
        .total { font-size: 18px; font-weight: bold; color: #e64800; text-align: right; margin-top: 15px; }
        .cta-button { display: inline-block; background: #e64800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .status-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">MonBaril™</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Confirmation de commande</p>
        </div>
        
        <div class="content">
          <h2>Merci pour votre commande !</h2>
          <p>Bonjour,</p>
          <p>Nous avons bien reçu votre commande <strong>${orderData.orderNumber}</strong> et nous vous en remercions.</p>
          
          <div class="order-summary">
            <h3 style="margin-top: 0;">Résumé de votre commande</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              <span><strong>Numéro de commande:</strong> ${orderData.orderNumber}</span>
              <span class="status-badge">⏳ En attente</span>
            </div>
            <div style="margin-bottom: 20px;">
              <strong>Date de commande:</strong> ${new Date(orderData.orderDate).toLocaleDateString('fr-FR')}
            </div>
            
            <h4>Articles commandés:</h4>
            ${orderData.items.map(item => `
              <div class="item">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                  <div class="item-name">${item.name}</div>
                  <div class="item-quantity">Quantité: ${item.quantity}</div>
                </div>
                <div class="item-price">${(item.quantity * item.price).toLocaleString('fr-FR')}€</div>
              </div>
            `).join('')}
            
            <div class="total">
              Total: ${orderData.totalPrice.toLocaleString('fr-FR')}€
            </div>
          </div>
          
          <h3>Prochaines étapes</h3>
          <p>Nous allons maintenant préparer votre commande avec soin. Vous recevrez un email de confirmation dès que votre commande sera expédiée.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/orders" class="cta-button">
              Suivre ma commande
            </a>
          </div>
          
          <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          <p>L'équipe MonBaril™</p>
        </div>
        
        <div class="footer">
          <p>MonBaril™ - Votre spécialiste en barils de qualité</p>
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateOrderConfirmationText(orderData: OrderEmailData): string {
  return `
Confirmation de commande ${orderData.orderNumber} - MonBaril™

Bonjour,

Nous avons bien reçu votre commande ${orderData.orderNumber} et nous vous en remercions.

RÉSUMÉ DE VOTRE COMMANDE:
- Numéro: ${orderData.orderNumber}
- Date: ${new Date(orderData.orderDate).toLocaleDateString('fr-FR')}
- Statut: En attente

ARTICLES COMMANDÉS:
${orderData.items.map(item => 
  `- ${item.name} (Quantité: ${item.quantity}) - ${(item.quantity * item.price).toLocaleString('fr-FR')}€`
).join('\n')}

TOTAL: ${orderData.totalPrice.toLocaleString('fr-FR')}€

PROCHAINES ÉTAPES:
Nous allons maintenant préparer votre commande avec soin. Vous recevrez un email de confirmation dès que votre commande sera expédiée.

Suivre ma commande: ${process.env.NEXT_PUBLIC_BASE_URL}/orders

Si vous avez des questions, n'hésitez pas à nous contacter.

L'équipe MonBaril™
  `;
}

function generateOrderStatusUpdateHTML(orderData: OrderEmailData, message: string): string {
  const statusIcons = {
    processing: '🔄',
    shipped: '📦',
    delivered: '✅',
    cancelled: '❌'
  };

  const statusColors = {
    processing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444'
  };

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mise à jour de commande</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e64800, #ff6b35); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
        .status-update { background: #f0f9ff; border-left: 4px solid ${statusColors[orderData.status as keyof typeof statusColors]}; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .cta-button { display: inline-block; background: #e64800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">MonBaril™</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Mise à jour de commande</p>
        </div>
        
        <div class="content">
          <h2>Mise à jour de votre commande</h2>
          <p>Bonjour,</p>
          
          <div class="status-update">
            <h3 style="margin-top: 0; color: ${statusColors[orderData.status as keyof typeof statusColors]};">
              ${statusIcons[orderData.status as keyof typeof statusIcons]} Commande ${orderData.orderNumber}
            </h3>
            <p><strong>${message}</strong></p>
            <p>Statut actuel: <strong>${orderData.status}</strong></p>
            ${orderData.trackingNumber ? `<p>Numéro de suivi: <strong>${orderData.trackingNumber}</strong></p>` : ''}
          </div>
          
          <p>Nous vous tiendrons informé de l'évolution de votre commande.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/orders" class="cta-button">
              Suivre ma commande
            </a>
          </div>
          
          <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          <p>L'équipe MonBaril™</p>
        </div>
        
        <div class="footer">
          <p>MonBaril™ - Votre spécialiste en barils de qualité</p>
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateOrderStatusUpdateText(orderData: OrderEmailData, message: string): string {
  return `
Mise à jour de commande ${orderData.orderNumber} - MonBaril™

Bonjour,

${message}

Commande: ${orderData.orderNumber}
Statut: ${orderData.status}
${orderData.trackingNumber ? `Numéro de suivi: ${orderData.trackingNumber}` : ''}

Nous vous tiendrons informé de l'évolution de votre commande.

Suivre ma commande: ${process.env.NEXT_PUBLIC_BASE_URL}/orders

Si vous avez des questions, n'hésitez pas à nous contacter.

L'équipe MonBaril™
  `;
}
