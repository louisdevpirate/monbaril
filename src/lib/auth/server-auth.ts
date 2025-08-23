import { cookies } from 'next/headers';
import { verifyAccessToken } from './jwt';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getCurrentUserFromServer() {
  try {
    // 1. Récupérer le token depuis les cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    
    if (!accessToken) {
      console.log('🔒 Pas de token d\'accès trouvé');
      return null;
    }

    // 2. Vérifier le token JWT
    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
      console.log('🔒 Token JWT invalide');
      return null;
    }

    console.log('🔍 Token JWT décodé:', decoded);
    console.log('🔍 UserID dans le token:', decoded.userId);

    // 3. Récupérer le profil directement par ID depuis Supabase
    const supabase = await createSupabaseServerClient();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, username, role')
      .eq('id', decoded.userId) // Utiliser directement l'ID du token
      .single();

    if (error || !profile) {
      console.log('🔒 Profil non trouvé par ID:', error);
      console.log('🔍 Recherche par ID:', decoded.userId);
      return null;
    }

    console.log('✅ Utilisateur authentifié côté serveur:', profile);
    return profile;

  } catch (error) {
    console.error('❌ Erreur authentification côté serveur:', error);
    return null;
  }
}

export async function getCurrentUserIdFromServer(): Promise<string | null> {
  const user = await getCurrentUserFromServer();
  return user?.id || null;
} 