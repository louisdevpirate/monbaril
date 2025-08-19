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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Erreur : " + error.message);
    } else {
      alert("Connexion réussie !");
      router.push("/");
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
