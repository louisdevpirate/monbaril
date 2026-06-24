"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { motion } from "framer-motion";
import Link from "next/link";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Récupérer les statistiques
      const [ordersResult, productsResult, usersResult] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('products').select('*'),
        supabase.from('profiles').select('*')
      ]);

      const orders = ordersResult.data || [];
      const products = productsResult.data || [];
      const users = usersResult.data || [];

      // Calculer les statistiques
      const totalRevenue = orders
        .filter(order => ['processing', 'shipped', 'delivered'].includes(order.status))
        .reduce((sum, order) => sum + (order.total_price || 0), 0);

      const pendingOrders = orders.filter(order => ['pending', 'processing'].includes(order.status)).length;
      
      const lowStockProducts = products.filter(
        product => product.stock_quantity <= product.min_stock_threshold
      ).length;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        totalUsers: users.length,
        pendingOrders,
        lowStockProducts
      });
    } catch (error) {
      console.error('Erreur récupération stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Commandes',
      value: stats.totalOrders,
      icon: '📦',
      color: 'bg-blue-500',
      link: '/admin/orders'
    },
    {
      title: 'Chiffre d\'Affaires',
      value: `${stats.totalRevenue.toLocaleString('fr-FR')}€`,
      icon: '💰',
      color: 'bg-green-500',
      link: '/admin/orders'
    },
    {
      title: 'Produits',
      value: stats.totalProducts,
      icon: '🛍️',
      color: 'bg-purple-500',
      link: '/admin/products'
    },
    {
      title: 'Utilisateurs',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-orange-500',
      link: '/admin/profiles'
    },
    {
      title: 'Commandes en Attente',
      value: stats.pendingOrders,
      icon: '⏳',
      color: 'bg-yellow-500',
      link: '/admin/orders?status=pending'
    },
    {
      title: 'Stock Faible',
      value: stats.lowStockProducts,
      icon: '⚠️',
      color: 'bg-red-500',
      link: '/admin/stocks'
    }
  ];

  const quickActions = [
    {
      title: 'Gérer les Commandes',
      description: 'Suivre et mettre à jour le statut des commandes',
      icon: '📦',
      link: '/admin/orders',
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      title: 'Gérer les Produits',
      description: 'Créer, modifier et supprimer des produits',
      icon: '🛍️',
      link: '/admin/products',
      color: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      title: 'Gérer les Stocks',
      description: 'Surveiller et ajuster les niveaux de stock',
      icon: '📊',
      link: '/admin/stocks',
      color: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Gérer les Utilisateurs',
      description: 'Voir et gérer les comptes utilisateurs',
      icon: '👥',
      link: '/admin/profiles',
      color: 'bg-orange-50 hover:bg-orange-100'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-95/100 mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-95/100 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de Bord Admin
          </h1>
          <p className="text-gray-600">
            Gérez votre boutique MonBaril™
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={card.link}>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${card.color} text-white`}>
                      <span className="text-2xl">{card.icon}</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Actions Rapides */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Actions Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                className={`rounded-lg border border-gray-200 p-6 transition-colors ${action.color}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={action.link}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-3xl">{action.icon}</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {action.title}
                      </h3>
                      <p className="text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Alertes */}
        {(stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Alertes
            </h2>
            <div className="space-y-3">
              {stats.pendingOrders > 0 && (
                <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-yellow-600 text-xl mr-3">⏳</span>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      {stats.pendingOrders} commande(s) en attente de traitement
                    </p>
                    <Link 
                      href="/admin/orders?status=pending"
                      className="text-sm text-yellow-600 hover:text-yellow-700"
                    >
                      Voir les commandes →
                    </Link>
                  </div>
                </div>
              )}
              
              {stats.lowStockProducts > 0 && (
                <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-red-600 text-xl mr-3">⚠️</span>
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      {stats.lowStockProducts} produit(s) avec un stock faible
                    </p>
                    <Link 
                      href="/admin/stocks"
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Gérer les stocks →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
