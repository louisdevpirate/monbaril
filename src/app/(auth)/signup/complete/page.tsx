"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

interface ProfileData {
  username: string;
  birthdate: string;
  avatar_url: string;
}

function SignupCompletePageContent() {
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    birthdate: '',
    avatar_url: '1.png'
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  useUser();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Vérifier si l'utilisateur est authentifié
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          toast.error("Lien de confirmation invalide ou expiré");
          router.push("/signup");
          return;
        }

        // Vérifier si le profil existe déjà
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          // Si le profil n'existe pas encore, c'est normal (nouvel utilisateur)
          if (profileError.code === 'PGRST116') {
            console.log('Profil non trouvé, utilisateur en cours d\'inscription');
          } else {
            console.error('Erreur lors de la vérification du profil:', profileError);
            toast.error("Erreur lors de la vérification de votre profil");
            router.push("/signup");
            return;
          }
        } else if (existingProfile) {
          toast.success("Votre compte est déjà configuré !");
          router.push("/profile");
          return;
        }

        // Pré-remplir le nom d'utilisateur avec l'email
        setProfileData(prev => ({
          ...prev,
          username: user.email?.split('@')[0] || ''
        }));

        setIsVerifying(false);
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        toast.error("Erreur lors de la vérification de votre email");
        router.push("/signup");
      }
    };

    verifyEmail();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Mettre à jour le mot de passe
      const { error: passwordError } = await supabase.auth.updateUser({
        password: password
      });

      if (passwordError) {
        console.error('Erreur mise à jour mot de passe:', passwordError);
        toast.error(`Erreur lors de la mise à jour du mot de passe: ${passwordError.message}`);
        return;
      }

      // 2. Créer le profil dans la base de données
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: profileData.username,
            birthdate: profileData.birthdate || null,
            role: 'user',
            is_active: true,
            avatar_url: profileData.avatar_url,
            preferences: { theme: 'light', language: 'fr' },
            subscription_tier: 'free',
            total_orders: 0,
            total_spent: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Erreur création profil:', profileError);
          toast.error(`Erreur lors de la création du profil: ${profileError.message}`);
          return;
        }

        toast.success("Compte créé avec succès ! Bienvenue sur MonBaril !");
        router.push("/profile");
      }
    } catch (error) {
      console.error('Erreur lors de la finalisation:', error);
      toast.error('Erreur inattendue lors de la finalisation du compte');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de votre email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Header simple */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-orange-500">MonBaril™</h1>
          </div>
        </div>
      </div>
      
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finaliser votre profil
            </h1>
            <p className="text-gray-600">
              Complétez votre inscription en quelques étapes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'utilisateur *
                  </label>
                  <input
                    type="text"
                    id="username"
                    required
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    id="birthdate"
                    value={profileData.birthdate}
                    onChange={(e) => setProfileData(prev => ({ ...prev, birthdate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Sélection d'avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Choisissez votre avatar
              </label>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setProfileData(prev => ({ ...prev, avatar_url: `${num}.png` }))}
                    className={`relative w-20 h-20 rounded-full border-2 transition-all cursor-pointer overflow-hidden ${
                      profileData.avatar_url === `${num}.png`
                        ? 'border-orange-500 ring-4 ring-orange-200'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={`/images/avatar/${num}.png`}
                      alt={`Avatar ${num}`}
                      className="w-full h-full object-cover"
                    />
                    {profileData.avatar_url === `${num}.png` && (
                      <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center">
                        <div className="w-6 h-6 bg-orange-500 bg-opacity-30 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création du compte...' : 'Finaliser mon inscription'}
            </button>
          </form>
        </motion.div>
      </div>
      </div>
    </div>
  );
}

import { Suspense } from "react";
export default function SignupCompletePage() { return <Suspense><SignupCompletePageContent /></Suspense>; }
