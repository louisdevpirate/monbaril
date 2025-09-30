"use client";

import { useEffect, useState } from "react";
import { useCartContext } from "@/context/CartContext";
import { supabase } from "@/lib/supabase/supabaseClient";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { CheckCircleIcon, ArrowRightIcon } from "@/components/icons/icons";
import Footer from "@/components/sections/Footer";

export default function SuccessPage() {
  const { cart, clearCart } = useCartContext();
  const [cartCleared, setCartCleared] = useState(false);
  const [stockDeducted, setStockDeducted] = useState(false);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderId, setOrderId] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.order_number) {
            setOrderId(data.order_number);
            setOrderDetails(data);
            setIsLoading(false);
            console.log("📦 Données de commande reçues:", data);
          } else {
            console.error("❌ Pas de numéro de commande dans la réponse:", data);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération de la commande:", error);
          setIsLoading(false);
        });
    }
  }, [sessionId]);

  // Envoyer l'email de confirmation après paiement (pour le développement)
  useEffect(() => {
    if (orderId && !emailSent) {
      const sendConfirmationEmail = async () => {
        try {
          console.log("📧 Envoi de l'email de confirmation pour la commande:", orderId);
          
          const response = await fetch("/api/email/send-confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderNumber: orderId }),
          });

          if (response.ok) {
            console.log("✅ Email de confirmation envoyé");
            setEmailSent(true);
          } else {
            console.error("❌ Erreur envoi email:", await response.text());
          }
        } catch (error) {
          console.error("❌ Erreur envoi email:", error);
        }
      };

      sendConfirmationEmail();
    }
  }, [orderId, emailSent]);

  // Déduire le stock réel après confirmation de commande
  useEffect(() => {
    if (!stockDeducted && cart.length > 0 && orderId) {
      const deductStock = async () => {
        try {
          console.log("🔄 Déduction du stock pour la commande:", orderId);
          console.log("📦 Produits dans le panier:", cart.length);
          console.log("📋 Détail du panier:", cart);
          
          let successCount = 0;
          let errorCount = 0;
          
          // Déduire le stock pour chaque produit de la commande
          for (const item of cart) {
            console.log(`\n📦 Traitement de ${item.name} (${item.quantity} unités) - ID: ${item.id}`);
            
            try {
              // 1. Récupérer le stock actuel
              const { data: productData, error: fetchError } = await supabase
                .from('products')
                .select('stock_quantity, stock_reserved')
                .eq('slug', item.id)
                .single();
              
              if (fetchError) {
                console.error(`❌ Erreur récupération stock pour ${item.name}:`, fetchError);
                errorCount++;
                continue;
              }
              
              const currentStock = productData.stock_quantity || 0;
              const currentReserved = productData.stock_reserved || 0;
              const newStock = Math.max(0, currentStock - item.quantity);
              const newReserved = Math.max(0, currentReserved - item.quantity);
              
              console.log(`📊 Stock ${item.name}: ${currentStock} → ${newStock} (réservé: ${currentReserved} → ${newReserved})`);
              
              // 2. Mettre à jour le stock
              const { error: updateError } = await supabase
                .from('products')
                .update({
                  stock_quantity: newStock,
                  stock_reserved: newReserved,
                  stock_updated_at: new Date().toISOString()
                })
                .eq('slug', item.id);
              
              if (updateError) {
                console.error(`❌ Erreur mise à jour stock pour ${item.name}:`, updateError);
                errorCount++;
              } else {
                console.log(`✅ Stock mis à jour pour ${item.name}`);
                successCount++;
              }
              
              // 3. Supprimer les réservations de type 'cart' pour ce produit
              const { error: deleteError } = await supabase
                .from('stock_reservations')
                .delete()
                .eq('product_id', item.id)
                .eq('reservation_type', 'cart');
              
              if (deleteError) {
                console.error(`❌ Erreur suppression réservations pour ${item.name}:`, deleteError);
              } else {
                console.log(`✅ Réservations supprimées pour ${item.name}`);
              }
              
            } catch (itemError) {
              console.error(`❌ Erreur inattendue pour ${item.name}:`, itemError);
              errorCount++;
            }
          }
          
          console.log(`\n📊 RÉSUMÉ: ${successCount} succès, ${errorCount} erreurs sur ${cart.length} produits`);
          
          setStockDeducted(true);
          
          if (successCount > 0) {
            toast.success(`✅ Stock mis à jour pour ${successCount} produit(s)`);
          }
          if (errorCount > 0) {
            toast.error(`❌ Erreurs sur ${errorCount} produit(s)`);
          }
          
          console.log("✅ Déduction du stock terminée");
        } catch (error) {
          console.error("❌ Erreur lors de la déduction du stock:", error);
          toast.error("❌ Erreur lors de la mise à jour du stock");
        }
      };

      deductStock();
    }
  }, [cart, orderId, stockDeducted]);

  // Vider le panier APRÈS avoir déduit le stock
  useEffect(() => {
    if (stockDeducted && !cartCleared && cart.length > 0) {
      clearCart();
      setCartCleared(true);
      console.log("✅ Panier vidé après déduction du stock.");
    }
  }, [stockDeducted, cart, clearCart, cartCleared]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Commande introuvable
          </h1>
          <p className="text-gray-600 mb-6">
            Nous n'avons pas pu récupérer les détails de votre commande.
          </p>
          <Link
            href="/categories"
            className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de succès */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Commande confirmée !
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Merci pour votre achat{orderDetails?.email ? `, ${orderDetails.email}` : ''}
            </p>
            <p className="text-gray-500">
              Votre baril personnalisable est en cours de préparation
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Détails de la commande */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 animate-slide-in-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Détails de votre commande
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Numéro de commande</span>
                  <span className="font-semibold text-gray-900">{orderDetails.order_number}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Date de commande</span>
                  <span className="font-semibold text-gray-900">
                    {orderDetails?.created_at ? new Date(orderDetails.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Date non disponible'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Email</span>
                  <span className="font-semibold text-gray-900">{orderDetails?.email || 'Email non disponible'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Statut</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    En préparation
                  </span>
                </div>
              </div>
            </div>

            {/* Produits commandés */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mt-6 animate-slide-in-left">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Produits commandés
              </h3>
              
              <div className="space-y-4">
                {orderDetails?.order_items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || '/images/products/image.png'}
                        alt={item.product_name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                      <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.price.toFixed(2)} € / unité
                      </p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucun produit trouvé</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Résumé et actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8 animate-slide-in-right">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Résumé
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold">
                    {orderDetails?.order_items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toFixed(2) || '0.00'} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-semibold text-green-600">Gratuite</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      {orderDetails?.total_price ? (orderDetails.total_price / 100).toFixed(2) : '0.00'} €
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `/api/invoice/download/${orderId}`;
                    link.download = `facture-${orderId}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>📄 Télécharger la facture</span>
                </button>
                
                <Link
                  href="/categories"
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Continuer mes achats</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">
                  📧 Email de confirmation
                </h4>
                <p className="text-sm text-blue-700">
                  Un email de confirmation a été envoyé à {orderDetails?.email || 'votre adresse email'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}