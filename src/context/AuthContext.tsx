"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Types pour l'authentification
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupérer l'utilisateur actuel
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Important pour les cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Erreur de connexion' };
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
    }
  };

  // Fonction pour rafraîchir les données utilisateur
  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  // Initialisation
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Auto-refresh du token toutes les 10 minutes
  useEffect(() => {
    if (user) {
      const interval = setInterval(async () => {
        try {
          await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });
        } catch (error) {
          console.error('Erreur lors du rafraîchissement automatique:', error);
        }
      }, 10 * 60 * 1000); // 10 minutes

      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        refreshUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};