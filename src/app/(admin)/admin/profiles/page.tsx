"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { getUserRole, hasRole } from "@/lib/auth/rls-simple";

interface Profile {
  id: string;
  username: string;
  role: string;
  is_active: boolean;
  subscription_tier: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
  last_login: string;
}

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [canViewAll, setCanViewAll] = useState(false);
  const [canUpdateAll, setCanUpdateAll] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    loadUserPermissions();
    loadProfiles();
  }, []);

  const loadUserPermissions = async () => {
    try {
      const role = await getUserRole();
      setUserRole(role);
      
      if (role) {
        setCanViewAll(await hasRole('moderator'));
        setCanUpdateAll(await hasRole('moderator'));
        setCanDelete(await hasRole('admin'));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des permissions:', error);
    }
  };

  const loadProfiles = async () => {
    try {
      setLoading(true);
      
      // Cette requête sera bloquée par RLS si l'utilisateur n'a pas les permissions
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST204') {
          setError("Accès refusé : Vous n'avez pas les permissions pour voir tous les profils");
        } else {
          setError(`Erreur lors du chargement: ${error.message}`);
        }
        return;
      }

      setProfiles(data || []);
    } catch (err) {
      setError('Erreur inattendue lors du chargement des profils');
    } finally {
      setLoading(false);
    }
  };

  const updateProfileRole = async (profileId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profileId);

      if (error) {
        if (error.code === 'PGRST204') {
          alert("Accès refusé : Vous n'avez pas les permissions pour modifier ce profil");
        } else {
          alert(`Erreur lors de la modification: ${error.message}`);
        }
        return;
      }

      // Recharger les profils
      loadProfiles();
      alert('Rôle mis à jour avec succès !');
    } catch (err) {
      alert('Erreur lors de la modification du rôle');
    }
  };

  const toggleProfileStatus = async (profileId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', profileId);

      if (error) {
        if (error.code === 'PGRST204') {
          alert("Accès refusé : Vous n'avez pas les permissions pour modifier ce profil");
        } else {
          alert(`Erreur lors de la modification: ${error.message}`);
        }
        return;
      }

      loadProfiles();
      alert('Statut mis à jour avec succès !');
    } catch (err) {
      alert('Erreur lors de la modification du statut');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des profils...</p>
        </div>
      </div>
    );
  }

  // Vérifier les permissions
  if (!canViewAll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h1>
          <p className="text-gray-600">Vous devez être modérateur ou admin pour accéder à cette page.</p>
          <p className="text-sm text-gray-500 mt-2">Votre rôle actuel : {userRole || 'Non connecté'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🔐 Administration des Profils
          </h1>
          <p className="mt-2 text-gray-600">
            Gestion des utilisateurs et des rôles (RLS activé)
          </p>
        </div>

        {/* Permissions Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Vos Permissions :</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${canViewAll ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Voir tous les profils
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${canUpdateAll ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Modifier tous les profils
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${canDelete ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Supprimer des profils
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Profiles Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Liste des Profils ({profiles.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commandes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profiles.map((profile) => (
                  <tr key={profile.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {profile.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {profile.id.substring(0, 8)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {canUpdateAll ? (
                        <select
                          value={profile.role}
                          onChange={(e) => updateProfileRole(profile.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          profile.role === 'admin' ? 'bg-red-100 text-red-800' :
                          profile.role === 'moderator' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {profile.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {canUpdateAll ? (
                        <button
                          onClick={() => toggleProfileStatus(profile.id, profile.is_active)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                            profile.is_active 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {profile.is_active ? 'Actif' : 'Inactif'}
                        </button>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          profile.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {profile.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {profile.total_orders} commandes
                      <br />
                      <span className="text-gray-500">
                        {profile.total_spent.toFixed(2)} €
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {canDelete && (
                        <button
                          onClick={() => {
                            if (confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
                              // TODO: Implémenter la suppression
                              alert('Suppression non implémentée pour le moment');
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
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
          <h3 className="text-sm font-medium text-yellow-800 mb-2">ℹ️ Row Level Security (RLS) :</h3>
          <p className="text-sm text-yellow-700">
            Cette page teste les politiques RLS de Supabase. Si vous n'avez pas les bonnes permissions, 
            certaines actions seront automatiquement bloquées par la base de données.
          </p>
        </div>
      </div>
    </div>
  );
} 