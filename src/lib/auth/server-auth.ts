import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getCurrentUserFromServer() {
  try {
    console.log('🔍 Début getCurrentUserFromServer');
    
    const supabase = await createSupabaseServerClient();
    console.log('✅ Client Supabase créé côté serveur');
    
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('🔍 Résultat getUser:', { user: user?.id, error: error?.message });
    
    if (error || !user) {
      console.log('🔒 Pas d\'utilisateur authentifié côté serveur:', error?.message);
      return null;
    }

    console.log('✅ Utilisateur authentifié côté serveur:', user.id);
    return { id: user.id, email: user.email };
  } catch (error) {
    console.error('❌ Erreur authentification côté serveur:', error);
    return null;
  }
}

export async function getCurrentUserIdFromServer(): Promise<string | null> {
  const user = await getCurrentUserFromServer();
  return user?.id || null;
} 