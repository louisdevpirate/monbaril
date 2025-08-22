"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Créer l'utilisateur Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        alert(`Erreur d'inscription: ${authError.message}`);
        return;
      }

      if (authData.user) {
        // 2. Créer le profil dans la table profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              username: authData.user.email?.split('@')[0] || 'user',
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
          console.error('Erreur création profil:', profileError);
          // On continue même si le profil n'est pas créé
        }

        alert("Compte créé avec succès ! Vérifie tes mails pour confirmer ton email.");
        router.push("/");
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Erreur inattendue lors de l\'inscription');
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "4rem auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Créer un compte</h1>
      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
          style={{ backgroundColor: "black", color: "white", padding: "0.75rem", borderRadius: "4px", fontWeight: "bold" }}
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}
