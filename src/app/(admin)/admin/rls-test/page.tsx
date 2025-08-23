"use client";

import { useState, useEffect } from "react";
import { testRLSAccess, getUserRole } from "@/lib/auth/rls-simple";

export default function RLSTestPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [rlsTest, setRlsTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Obtenir le rôle de l'utilisateur
      const role = await getUserRole();
      setUserRole(role);
      
      // Tester l'accès RLS
      const testResult = await testRLSAccess();
      setRlsTest(testResult);
      
    } catch (error) {
      console.error('Erreur lors du test RLS:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Test des politiques RLS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🔒 Test des Politiques RLS
          </h1>
          <p className="mt-2 text-gray-600">
            Test des Row Level Security policies sur la table profiles
          </p>
        </div>

        {/* Informations utilisateur */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">👤 Votre profil :</h3>
          <div className="text-sm text-blue-700">
            <p><strong>Rôle actuel :</strong> {userRole || 'Non connecté'}</p>
          </div>
        </div>

        {/* Résultats des tests RLS */}
        {rlsTest && (
          <div className="space-y-6">
            
            {/* Test 1: Accès à son propre profil */}
            <div className={`p-4 border rounded-lg ${
              rlsTest.canViewOwnProfile 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="text-sm font-medium mb-2">
                {rlsTest.canViewOwnProfile ? '✅' : '❌'} Accès à son propre profil
              </h3>
              <p className="text-sm">
                {rlsTest.canViewOwnProfile 
                  ? 'Vous pouvez voir votre propre profil (RLS autorise)'
                  : 'Vous ne pouvez pas voir votre propre profil (RLS bloque)'
                }
              </p>
            </div>

            {/* Test 2: Accès à tous les profils */}
            <div className={`p-4 border rounded-lg ${
              rlsTest.canViewAllProfiles 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="text-sm font-medium mb-2">
                {rlsTest.canViewAllProfiles ? '✅' : '❌'} Accès à tous les profils
              </h3>
              <p className="text-sm">
                {rlsTest.canViewAllProfiles 
                  ? 'Vous pouvez voir tous les profils (RLS autorise)'
                  : 'Vous ne pouvez pas voir tous les profils (RLS bloque)'
                }
              </p>
              {rlsTest.error && (
                <p className="text-xs text-red-600 mt-2">
                  <strong>Erreur RLS :</strong> {rlsTest.error}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Instructions pour tester RLS */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">📋 Comment tester RLS :</h3>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. <strong>Connectez-vous</strong> avec votre compte</li>
            <li>2. <strong>Vérifiez votre rôle</strong> dans la table profiles</li>
            <li>3. <strong>Exécutez le SQL RLS</strong> dans Supabase</li>
            <li>4. <strong>Rechargez cette page</strong> pour voir les changements</li>
          </ol>
        </div>

        {/* Bouton de rechargement */}
        <div className="mt-6 text-center">
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            🔄 Recharger les tests
          </button>
        </div>

        {/* Statut RLS */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800 mb-2">ℹ️ Statut RLS :</h3>
          <p className="text-sm text-gray-700">
            Si vous voyez des erreurs "PGRST204" ou "row-level security policy", 
            cela signifie que RLS est activé et fonctionne correctement !
          </p>
        </div>

      </div>
    </div>
  );
} 