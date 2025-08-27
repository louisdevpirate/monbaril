"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { getUserRole, hasRole } from "@/lib/auth/rls-simple";

interface ProductStock {
  slug: string;
  title: string;
  stock_quantity: number;
  stock_reserved: number;
  min_stock_threshold: number;
  stock_updated_at: string;
  available: number;
  lowStock: boolean;
  criticalStock: boolean;
}

export default function AdminStocksPage() {
  const [products, setProducts] = useState<ProductStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [canManageStocks, setCanManageStocks] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ quantity: number; threshold: number }>({ quantity: 0, threshold: 5 });

  useEffect(() => {
    loadUserPermissions();
    loadProducts();
  }, []);

  const loadUserPermissions = async () => {
    try {
      const role = await getUserRole();
      setUserRole(role);
      
      if (role) {
        setCanManageStocks(await hasRole('moderator'));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des permissions:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('slug, title, stock_quantity, stock_reserved, min_stock_threshold, stock_updated_at')
        .order('title');

      if (error) {
        if (error.code === 'PGRST204') {
          setError("Accès refusé : Vous n'avez pas les permissions pour voir les stocks");
        } else {
          setError(`Erreur lors du chargement: ${error.message}`);
        }
        return;
      }

      if (data) {
        const productsWithStock = data.map(product => ({
          ...product,
          available: Math.max(0, (product.stock_quantity || 0) - (product.stock_reserved || 0)),
          lowStock: (product.stock_quantity || 0) - (product.stock_reserved || 0) <= (product.min_stock_threshold || 5),
          criticalStock: (product.stock_quantity || 0) - (product.stock_reserved || 0) <= 0
        }));
        setProducts(productsWithStock);
      }
    } catch (err) {
      setError('Erreur inattendue lors du chargement des stocks');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (slug: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: editValues.quantity,
          min_stock_threshold: editValues.threshold,
          stock_updated_at: new Date().toISOString()
        })
        .eq('slug', slug);

      if (error) {
        alert(`Erreur lors de la mise à jour: ${error.message}`);
        return;
      }

      alert('Stock mis à jour avec succès !');
      setEditingProduct(null);
      loadProducts(); // Recharger les données
    } catch (err) {
      alert('Erreur lors de la mise à jour du stock');
    }
  };

  const startEditing = (product: ProductStock) => {
    setEditingProduct(product.slug);
    setEditValues({
      quantity: product.stock_quantity || 0,
      threshold: product.min_stock_threshold || 5
    });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des stocks...</p>
        </div>
      </div>
    );
  }

  if (!canManageStocks) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h1>
          <p className="text-gray-600">Vous devez être modérateur ou admin pour gérer les stocks.</p>
          <p className="text-sm text-gray-500 mt-2">Votre rôle actuel : {userRole || 'Non connecté'}</p>
        </div>
      </div>
    );
  }

  const criticalProducts = products.filter(p => p.criticalStock);
  const lowStockProducts = products.filter(p => p.lowStock && !p.criticalStock);
  const normalStockProducts = products.filter(p => !p.lowStock && !p.criticalStock);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            📦 Gestion des Stocks
          </h1>
          <p className="mt-2 text-gray-600">
            Surveillance et gestion des stocks produits
          </p>
        </div>

        {/* Alertes de stock */}
        {(criticalProducts.length > 0 || lowStockProducts.length > 0) && (
          <div className="mb-6 space-y-3">
            {criticalProducts.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-sm font-medium text-red-800 mb-2">
                  🚨 Produits en rupture de stock ({criticalProducts.length})
                </h3>
                <div className="text-sm text-red-700">
                  {criticalProducts.map(p => p.title).join(', ')}
                </div>
              </div>
            )}
            
            {lowStockProducts.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  ⚠️ Stock faible ({lowStockProducts.length})
                </h3>
                <div className="text-sm text-yellow-700">
                  {lowStockProducts.map(p => p.title).join(', ')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Stocks des Produits ({products.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Réservé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disponible
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seuil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.slug} className={product.criticalStock ? 'bg-red-50' : product.lowStock ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.slug}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingProduct === product.slug ? (
                        <input
                          type="number"
                          value={editValues.quantity}
                          onChange={(e) => setEditValues(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                          className="w-20 border border-gray-300 rounded px-2 py-1"
                          min="0"
                        />
                      ) : (
                        product.stock_quantity || 0
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock_reserved || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`font-semibold ${
                        product.criticalStock ? 'text-red-600' : 
                        product.lowStock ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {product.available}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingProduct === product.slug ? (
                        <input
                          type="number"
                          value={editValues.threshold}
                          onChange={(e) => setEditValues(prev => ({ ...prev, threshold: parseInt(e.target.value) || 5 }))}
                          className="w-20 border border-gray-300 rounded px-2 py-1"
                          min="0"
                        />
                      ) : (
                        product.min_stock_threshold || 5
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.criticalStock ? 'bg-red-100 text-red-800' :
                        product.lowStock ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {product.criticalStock ? 'Rupture' : 
                         product.lowStock ? 'Faible' : 
                         'Normal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingProduct === product.slug ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateStock(product.slug)}
                            className="text-green-600 hover:text-green-900"
                          >
                            ✅ Sauvegarder
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            ❌ Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ✏️ Modifier
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RLS Info */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">ℹ️ Gestion des Stocks :</h3>
          <p className="text-sm text-yellow-700">
            Les stocks sont gérés avec des réservations automatiques lors de l'ajout au panier. 
            Le stock réel est déduit lors de la confirmation de commande.
          </p>
        </div>
      </div>
    </div>
  );
}
