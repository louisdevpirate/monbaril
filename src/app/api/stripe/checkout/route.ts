import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendOrderConfirmation } from "@/lib/email/send-order-confirmation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { stripeCheckoutSchema } from "@/lib/validation/schemas";
import { validateData, sanitizeForLogging } from "@/lib/validation/validate";
import { getCurrentUserFromServer } from "@/lib/auth/server-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 🔍 DEBUG : Voir ce qui est reçu
    console.log("📥 Body reçu (brut) :", JSON.stringify(body, null, 2));
    
    // 🔧 CORRECTION : Ajouter les champs manquants
    const correctedBody = {
      ...body,
      items: body.items.map((item: any, index: number) => ({
        ...item,
        id: item.id || `item-${index}`, // Ajouter un ID si manquant
      })),
      total_price: body.total_price || body.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0), // Calculer le total
    };
    
    console.log("🔧 Body corrigé :", JSON.stringify(correctedBody, null, 2));
    
    // 🔒 VALIDATION DES DONNÉES avec Zod
    const validation = validateData(stripeCheckoutSchema, correctedBody);
    if (!validation.success) {
      console.error("❌ Validation échouée :", validation.errors);
      console.error("❌ Schéma attendu :", stripeCheckoutSchema.shape);
      return NextResponse.json(
        { 
          error: "Données invalides", 
          details: validation.errors 
        },
        { status: 400 }
      );
    }
    
    const validatedBody = validation.data!; // TypeScript sait maintenant que c'est défini
    console.log("📦 Stripe items reçus (validés) :", sanitizeForLogging(validatedBody.items));

    const line_items = validatedBody.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      customer_email: validatedBody.email,
      customer_creation: "always",
    });

    const supabase = await createSupabaseServerClient();

    // 🔐 AUTHENTIFICATION CÔTÉ SERVEUR
    const user = await getCurrentUserFromServer();
    console.log("👤 Utilisateur authentifié côté serveur:", user);

    // 1️⃣ Récupérer le dernier numéro de commande pour l'incrémenter
    const { data: lastOrder } = await supabase
      .from("orders")
      .select("order_number")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let nextOrderNumber;
    if (lastOrder && lastOrder.order_number) {
      // Extraire le numéro et l'incrémenter
      const lastNumber = parseInt(lastOrder.order_number.replace("CMD-", ""));
      nextOrderNumber = `CMD-${String(lastNumber + 1).padStart(5, "0")}`;
    } else {
      // Première commande
      nextOrderNumber = "CMD-00001";
    }
    
    // 2️⃣ Créer la commande avec le numéro séquentiel
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          order_number: nextOrderNumber,
          email: validatedBody.email,
          status: "pending",
          user_id: user?.id ?? null, // Utiliser l'ID de l'utilisateur authentifié
          total_price: validatedBody.total_price ?? null,
          stripe_session_id: session.id,
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      console.error("❌ Erreur création commande :", orderError);
      return NextResponse.json(
        { error: "Erreur création commande" },
        { status: 500 }
      );
    }

    // 3️⃣ Insertion des items
    for (const item of validatedBody.items) {
      // 🔍 Récupérer le vrai product_id depuis la table products
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id")
        .eq("title", item.name) // Chercher par title au lieu de name
        .single();

      if (productError || !product) {
        console.error("❌ Produit non trouvé :", item.name, productError);
        return NextResponse.json(
          { error: `Produit non trouvé: ${item.name}` },
          { status: 400 }
        );
      }

      const { error: itemError } = await supabase.from("order_items").insert([
        {
          order_id: order.id, // Utiliser l'id numérique de la commande créée
          product_id: product.id, // Utiliser le vrai product_id
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          user_id: user?.id ?? null, // Utiliser l'ID de l'utilisateur authentifié
        },
      ]);

      if (itemError) {
        console.error("❌ Erreur insertion item :", itemError);
        return NextResponse.json(
          { error: "Erreur ajout item", details: itemError.message },
          { status: 500 }
        );
      }
    }

    // 4️⃣ Mise à jour des statistiques du profil utilisateur
    if (user?.id) {
      console.log("🔄 Mise à jour profil pour user:", user.id);
      
      // D'abord récupérer les valeurs actuelles
      const { data: currentProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("total_orders, total_spent")
        .eq("id", user.id)
        .single();

      console.log("📊 Profil actuel:", currentProfile);
      console.log("❌ Erreur récupération:", fetchError);

      if (!fetchError && currentProfile) {
        const newTotalOrders = (currentProfile.total_orders || 0) + 1;
        const newTotalSpent = (parseFloat(currentProfile.total_spent || "0") + validatedBody.total_price).toFixed(2);
        
        console.log("🆕 Nouvelles valeurs:", { newTotalOrders, newTotalSpent });
        
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            total_orders: newTotalOrders,
            total_spent: newTotalSpent,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        console.log("❌ Erreur mise à jour:", profileError);

        if (profileError) {
          console.error("⚠️ Erreur mise à jour profil :", profileError);
          // Ne pas bloquer la commande pour cette erreur
        } else {
          console.log("✅ Statistiques profil mises à jour");
        }
      } else {
        console.error("❌ Impossible de récupérer le profil actuel");
      }
    } else {
      console.log("⚠️ Pas d'utilisateur connecté, pas de mise à jour profil");
    }

    // 5️⃣ Email confirmation avec le numéro de commande
    if (validatedBody.email) {
      await sendOrderConfirmation({
        to: validatedBody.email,
        orderNumber: order.order_number,
      });
    }

    console.log("✅ Commande enregistrée avec succès !");
    return NextResponse.json({
      url: session.url,
      orderNumber: order.order_number, // Utiliser order_number de la commande créée
    });
  } catch (err) {
    console.error("❌ Erreur Stripe Checkout :", err);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session Stripe" },
      { status: 500 }
    );
  }
}
