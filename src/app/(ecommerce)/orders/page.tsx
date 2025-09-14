"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import CTAButton from "@/components/ui/CTAButton";

interface Order {
  id: string;
  order_number: string;
  email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_price: number;
  created_at: string;
  updated_at: string;
  stripe_session_id: string | null;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_slug: string;
  quantity: number;
  price: number;
  product_name: string;
  product_image: string;
}

const statusConfig = {
  pending: { 
    label: 'En attente', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: '⏳',
    description: 'Votre commande est en cours de traitement'
  },
  processing: { 
    label: 'En cours', 
    color: 'bg-blue-100 text-blue-800', 
    icon: '🔄',
    description: 'Nous préparons votre commande'
  },
  shipped: { 
    label: 'Expédié', 
    color: 'bg-purple-100 text-purple-800', 
    icon: '📦',
    description: 'Votre commande a été expédiée'
  },
  delivered: { 
    label: 'Livré', 
    color: 'bg-green-100 text-green-800', 
    icon: '✅',
    description: 'Votre commande a été livrée'
  },
  cancelled: { 
    label: 'Annulé', 
    color: 'bg-red-100 text-red-800', 
    icon: '❌',
    description: 'Votre commande a été annulée'
  }
};

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Vous devez être connecté pour voir vos commandes');
        return;
      }

      // Récupérer les commandes de l'utilisateur avec les items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_slug,
            quantity,
            price,
            product_name,
            product_image
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Erreur récupération commandes:', ordersError);
        toast.error('Erreur lors du chargement de vos commandes');
        return;
      }

      // Transformer les données pour inclure les items
      const transformedOrders = ordersData?.map(order => ({
        ...order,
        items: order.order_items || []
      })) || [];

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement de vos commandes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusProgress = (status: string) => {
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return currentIndex >= 0 ? currentIndex + 1 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Commandes
          </h1>
          <p className="text-gray-600">
            Suivez l'état de vos commandes MonBaril™
          </p>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            className="text-center py-12 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune commande trouvée
            </h3>
            <p className="text-gray-500 mb-6">
              Vous n'avez pas encore passé de commande.
            </p>
            <CTAButton href="/collections" variant="primary" className="mx-auto mt-6">Découvrir nos produits</CTAButton>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Header de la commande */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Commande {order.order_number}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Passée le {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusConfig[order.status].color}`}>
                        {statusConfig[order.status].icon} {statusConfig[order.status].label}
                      </span>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {order.total_price?.toLocaleString('fr-FR')}€
                      </p>
                    </div>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    {['pending', 'processing', 'shipped', 'delivered'].map((status, statusIndex) => {
                      const isActive = getStatusProgress(order.status) > statusIndex;
                      const isCurrent = order.status === status;
                      
                      return (
                        <div key={status} className="flex items-center">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                            isActive 
                              ? 'bg-orange-500 text-white' 
                              : isCurrent 
                                ? 'bg-orange-200 text-orange-800' 
                                : 'bg-gray-200 text-gray-500'
                          }`}>
                            {statusIndex + 1}
                          </div>
                          <div className="ml-2">
                            <p className={`text-sm font-medium ${
                              isActive ? 'text-orange-600' : 'text-gray-500'
                            }`}>
                              {statusConfig[status as keyof typeof statusConfig].label}
                            </p>
                          </div>
                          {statusIndex < 3 && (
                            <div className={`ml-4 w-16 h-0.5 ${
                              isActive ? 'bg-orange-500' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Description du statut */}
                <div className="px-6 py-3 bg-white">
                  <p className="text-sm text-gray-600">
                    {statusConfig[order.status].description}
                  </p>
                </div>

                {/* Articles de la commande */}
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      Articles ({order.items.length})
                    </h4>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Voir les détails
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantité: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        +{order.items.length - 3} autres articles
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Voir la commande complète
                      </button>
                      {order.status === 'delivered' && (
                        <Link
                          href={`/api/invoice/download/${order.order_number}`}
                          className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                        >
                          Télécharger la facture
                        </Link>
                      )}
                    </div>
                    <Link
                      href={`/collections/${order.items[0]?.product_slug}`}
                      className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                    >
                      Commander à nouveau
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal Détails Commande */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Commande {selectedOrder.order_number}
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Fermer</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Statut</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[selectedOrder.status].color}`}>
                        {statusConfig[selectedOrder.status].icon} {statusConfig[selectedOrder.status].label}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Montant Total</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedOrder.total_price?.toLocaleString('fr-FR')}€
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Articles</label>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantité: {item.quantity} × {item.price.toLocaleString('fr-FR')}€
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {(item.quantity * item.price).toLocaleString('fr-FR')}€
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
