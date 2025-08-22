"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Erreur : " + error.message);
        return;
      }

      if (data.user) {
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
                email: data.user.email,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            ]);

          if (profileError) {
            console.error('Erreur création profil:', profileError);
            // On continue même si le profil n'est pas créé
          } else {
            console.log('Profil créé avec succès !');
          }
        }

        alert("Connexion réussie !");
        router.push("/");
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      alert('Erreur inattendue lors de la connexion');
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "4rem auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Se connecter</h1>
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
    </div>
  );
}
