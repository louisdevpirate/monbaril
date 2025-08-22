"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginJWTTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { user, login, logout } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        setMessage('✅ Connexion réussie !');
        setEmail('');
        setPassword('');
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setMessage('🚪 Déconnexion réussie !');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          🔐 Test Système JWT
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Page de test pour notre nouveau système d'authentification
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Statut de connexion */}
          <div className="mb-6 p-4 rounded-md bg-blue-50 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800">Statut actuel :</h3>
            {user ? (
              <div className="mt-2 text-sm text-blue-700">
                <p><strong>Connecté :</strong> {user.email}</p>
                <p><strong>Rôle :</strong> {user.role}</p>
                <p><strong>ID :</strong> {user.id}</p>
                <p><strong>Email vérifié :</strong> {user.emailVerified ? '✅ Oui' : '❌ Non'}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-blue-700">❌ Non connecté</p>
            )}
          </div>

          {/* Formulaire de connexion */}
          {!user ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
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
                    placeholder="test@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleLogout}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Se déconnecter
              </button>
            </div>
          )}

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

          {/* Informations de test */}
          <div className="mt-6 p-4 rounded-md bg-gray-50 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-800">💡 Comment tester :</h3>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              <li>• Utilise un compte Supabase existant</li>
              <li>• Vérifie les cookies dans les DevTools</li>
              <li>• Regarde les logs du serveur Next.js</li>
              <li>• Teste la déconnexion et reconnexion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 