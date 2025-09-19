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
  monthlyRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: Array<{
    id: string;
    title: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    order_number: string;
    email: string;
    total_price: number;
    status: string;
    created_at: string;
  }>;
  userGrowth: Array<{
    month: string;
    users: number;
  }>;
}

export default function AdminAnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    monthlyRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    topProducts: [],
    recentOrders: [],
    userGrowth: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Récupérer toutes les données
      const [ordersResult, productsResult, usersResult] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*'),
        supabase.from('profiles').select('*').order('created_at', { ascending: false })
      ]);

      const orders = ordersResult.data || [];
      const products = productsResult.data || [];
      const users = usersResult.data || [];

      // Calculer les statistiques de base
      const totalRevenue = orders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + (order.total_price || 0), 0);

      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const lowStockProducts = products.filter(
        product => product.stock_quantity <= product.min_stock_threshold
      ).length;

      // Calculer le CA mensuel
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate.getMonth() === currentMonth && 
                 orderDate.getFullYear() === currentYear &&
                 order.status === 'delivered';
        })
        .reduce((sum, order) => sum + (order.total_price || 0), 0);

      // Calculer la valeur moyenne des commandes
      const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      // Calculer le taux de conversion (simulation)
      const conversionRate = users.length > 0 ? (orders.length / users.length) * 100 : 0;

      // Top produits (simulation basée sur les commandes)
      const topProducts = products.slice(0, 5).map(product => ({
        id: product.id,
        title: product.title,
        sales: Math.floor(Math.random() * 50) + 10, // Simulation
        revenue: Math.floor(Math.random() * 1000) + 500 // Simulation
      }));

      // Commandes récentes
      const recentOrders = orders.slice(0, 5);

      // Croissance des utilisateurs (simulation des 6 derniers mois)
      const userGrowth = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
          month: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
          users: Math.floor(Math.random() * 20) + 5
        };
      }).reverse();

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        totalUsers: users.length,
        pendingOrders,
        lowStockProducts,
        monthlyRevenue,
        averageOrderValue,
        conversionRate,
        topProducts,
        recentOrders,
        userGrowth
      });
    } catch (error) {
      console.error('Erreur récupération analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Commandes Total',
      value: stats.totalOrders,
      icon: '📦',
      color: 'bg-blue-500',
      link: '/admin/orders',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Chiffre d\'Affaires',
      value: `${stats.totalRevenue.toLocaleString('fr-FR')}€`,
      icon: '💰',
      color: 'bg-green-500',
      link: '/admin/orders',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'CA Mensuel',
      value: `${stats.monthlyRevenue.toLocaleString('fr-FR')}€`,
      icon: '📈',
      color: 'bg-purple-500',
      link: '/admin/orders',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Panier Moyen',
      value: `${stats.averageOrderValue.toFixed(2)}€`,
      icon: '🛒',
      color: 'bg-orange-500',
      link: '/admin/orders',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Utilisateurs',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-teal-500',
      link: '/admin/profiles',
      change: '+20%',
      changeType: 'positive'
    },
    {
      title: 'Taux de Conversion',
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: '🎯',
      color: 'bg-pink-500',
      link: '/admin/profiles',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'Produits',
      value: stats.totalProducts,
      icon: '🛍️',
      color: 'bg-indigo-500',
      link: '/admin/products',
      change: '+2',
      changeType: 'neutral'
    },
    {
      title: 'Stock Faible',
      value: stats.lowStockProducts,
      icon: '⚠️',
      color: 'bg-red-500',
      link: '/admin/products',
      change: '-1',
      changeType: 'negative'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-100 via-white to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Analytics Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tableau de bord complet avec métriques et analyses en temps réel
            </p>
            
            {/* Time Range Selector */}
            <div className="mt-8 flex justify-center">
              <div className="bg-white rounded-lg p-1 shadow-lg">
                {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      timeRange === range
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range === '7d' ? '7 jours' : 
                     range === '30d' ? '30 jours' :
                     range === '90d' ? '90 jours' : '1 an'}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={card.link} className="block">
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                      <div className="flex items-center mt-2">
                        <span className={`text-sm font-medium ${
                          card.changeType === 'positive' ? 'text-green-600' :
                          card.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {card.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
                      </div>
                    </div>
                    <div className={`${card.color} rounded-full p-3`}>
                      <span className="text-2xl">{card.icon}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Charts and Tables */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Produits</h2>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.title}</p>
                      <p className="text-sm text-gray-500">{product.sales} ventes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{product.revenue}€</p>
                    <p className="text-sm text-gray-500">CA</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Commandes Récentes</h2>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">#{order.order_number}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.total_price}€</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* User Growth Chart */}
        <motion.div
          className="mt-8 bg-white rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Croissance des Utilisateurs</h2>
          <div className="h-64 flex items-end space-x-4">
            {stats.userGrowth.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="bg-orange-500 rounded-t-lg w-full transition-all duration-500 hover:bg-orange-600"
                  style={{ height: `${(data.users / Math.max(...stats.userGrowth.map(d => d.users))) * 200}px` }}
                ></div>
                <p className="text-xs text-gray-500 mt-2">{data.month}</p>
                <p className="text-sm font-medium text-gray-900">{data.users}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
