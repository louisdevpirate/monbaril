"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(`Erreur lors de l'envoi: ${resetError.message}`);
      } else {
        setMessage("✅ Email de récupération envoyé ! Vérifiez votre boîte mail.");
        setEmail("");
      }
    } catch (error) {
      console.error('Erreur lors de la demande de récupération:', error);
      setError("Erreur inattendue lors de la demande de récupération");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          🔑 Mot de passe oublié ?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Entrez votre email pour recevoir un lien de récupération
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleResetPassword} className="space-y-6">
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="votre-email@exemple.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien de récupération'}
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

          {/* Informations */}
          <div className="mt-6 p-4 rounded-md bg-blue-50 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800">💡 Comment ça marche :</h3>
            <ol className="mt-2 text-sm text-blue-700 space-y-1">
              <li>1. Entrez votre email</li>
              <li>2. Recevez un lien par email</li>
              <li>3. Cliquez sur le lien</li>
              <li>4. Choisissez un nouveau mot de passe</li>
            </ol>
          </div>

          {/* Retour à la connexion */}
          <div className="mt-6 text-center">
            <a 
              href="/login" 
              className="text-sm text-blue-600 hover:text-blue-500 underline"
            >
              ← Retour à la connexion
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 