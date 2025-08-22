import { NextResponse } from 'next/server';
import { clearTokenCookies, getCurrentUser } from '@/lib/auth/jwt';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    // Récupérer l'utilisateur actuel avant déconnexion
    const user = await getCurrentUser();
    
    if (user) {
      console.log('🚪 Déconnexion utilisateur:', {
        userId: user.userId,
        email: user.email,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Déconnexion de Supabase
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    
    // Supprimer les cookies JWT
    await clearTokenCookies();
    
    return NextResponse.json({
      message: 'Déconnexion réussie',
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion:', error);
    
    // Même en cas d'erreur, on supprime les cookies
    await clearTokenCookies();
    
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}