import { supabase } from '@/lib/supabase/supabaseClient';

// Types pour les rôles
export type UserRole = 'user' | 'moderator' | 'admin';

// Fonction simple pour obtenir le rôle de l'utilisateur
export async function getUserRole(): Promise<UserRole | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return profile?.role || 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

// Fonction pour vérifier si l'utilisateur a un rôle spécifique
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const userRole = await getUserRole();
  
  if (!userRole) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    'user': 1,
    'moderator': 2,
    'admin': 3
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// Fonction pour tester l'accès RLS
export async function testRLSAccess(): Promise<{
  canViewOwnProfile: boolean;
  canViewAllProfiles: boolean;
  error?: string;
}> {
  try {
    // Test 1: Voir son propre profil
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { canViewOwnProfile: false, canViewAllProfiles: false };
    }

    const { data: ownProfile, error: ownError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const canViewOwnProfile = !ownError && ownProfile;

    // Test 2: Voir tous les profils (sera bloqué par RLS si pas autorisé)
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('*');

    const canViewAllProfiles = !allError && allProfiles && allProfiles.length > 0;

    return {
      canViewOwnProfile,
      canViewAllProfiles,
      error: allError?.message
    };

  } catch (error) {
    return {
      canViewOwnProfile: false,
      canViewAllProfiles: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 