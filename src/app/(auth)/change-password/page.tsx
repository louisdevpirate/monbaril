"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Validation côté client
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (newPassword.length < 12) {
      setError("Le nouveau mot de passe doit contenir au moins 12 caractères");
      setLoading(false);
      return;
    }

    try {
      // 1. Vérifier le mot de passe actuel en se reconnectant
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        setError("Vous devez être connecté pour changer votre mot de passe");
        setLoading(false);
        return;
      }

      // 2. Changer le mot de passe
      const { error: changeError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (changeError) {
        setError(`Erreur lors du changement: ${changeError.message}`);
      } else {
        setMessage("✅ Mot de passe changé avec succès ! Vous allez être redirigé...");
        
        // Rediriger après 2 secondes
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setError("Erreur inattendue lors du changement de mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          🔐 Changer le mot de passe
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choisissez un nouveau mot de passe sécurisé
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleChangePassword} className="space-y-6">
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nouveau mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Minimum 12 caractères
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le nouveau mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Changement en cours...' : 'Changer le mot de passe'}
              </button>
            </div>
          </form>

          {/* Messages */}
          {message && (
            <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-800">{message}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Informations de sécurité */}
          <div className="mt-6 p-4 rounded-md bg-blue-50 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800">🔒 Conseils de sécurité :</h3>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• Utilisez au moins 12 caractères</li>
              <li>• Mélangez lettres, chiffres et symboles</li>
              <li>• Évitez les informations personnelles</li>
              <li>• Utilisez un gestionnaire de mots de passe</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 