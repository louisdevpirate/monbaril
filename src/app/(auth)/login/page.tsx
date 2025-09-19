"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('🔐 Tentative de connexion pour:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('❌ Erreur de connexion:', error.message);
        alert("Erreur : " + error.message);
        return;
      }

      if (data.user) {
        console.log('✅ Connexion réussie!');
        console.log('👤 User ID:', data.user.id);
        console.log('📧 Email:', data.user.email);
        console.log('🔑 Session:', data.session ? 'Session créée' : 'Pas de session');
        
        if (data.session) {
          console.log('🍪 Cookies de session:', document.cookie);
        }
        // Vérifier si le profil existe déjà
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        // Si pas de profil, le créer
        if (!existingProfile) {
          console.log('Création du profil pour:', data.user.email);
          
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                username: data.user.email?.split('@')[0] || 'user',
                role: 'user',
                is_active: true,
                last_login: new Date().toISOString(),
                subscription_tier: 'free',
                total_orders: 0,
                total_spent: 0.00,
                preferences: { theme: 'light', language: 'fr' },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            ]);

          if (profileError) {
            console.error('Erreur création profil:', {
              message: profileError.message,
              code: profileError.code,
              details: profileError.details,
              hint: profileError.hint
            });
            // On continue même si le profil n'est pas créé
          } else {
            console.log('Profil créé avec succès !');
          }
        }

        alert("Connexion réussie !");
        
        // Rediriger vers la page d'origine si elle existe, sinon vers l'accueil
        if (redirectPath) {
          const decodedPath = decodeURIComponent(redirectPath);
          console.log("🔄 Redirection vers:", decodedPath);
          router.push(decodedPath);
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      alert('Erreur inattendue lors de la connexion');
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "4rem auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Se connecter</h1>
      
      {redirectPath && (
        <div style={{ 
          background: "#f0f9ff", 
          border: "1px solid #0ea5e9", 
          borderRadius: "6px", 
          padding: "0.75rem", 
          marginBottom: "1rem",
          fontSize: "0.875rem",
          color: "#0369a1"
        }}>
          🔄 Après connexion, tu seras redirigé vers la page où tu étais.
        </div>
      )}
      
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "0.75rem",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          Se connecter
        </button>
      </form>
      
      {/* Lien mot de passe oublié */}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <a 
          href="/forgot-password" 
          style={{ 
            color: "blue", 
            textDecoration: "underline",
            fontSize: "0.875rem"
          }}
        >
          Mot de passe oublié ?
        </a>
      </div>
    </div>
  );
}
