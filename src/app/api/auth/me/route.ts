import { NextResponse } from 'next/server';
import { getCurrentUser, refreshAccessToken } from '@/lib/auth/jwt';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Récupérer l'utilisateur depuis le JWT
    let user = await getCurrentUser();
    
    // Si pas d'access token, essayer de rafraîchir
    if (!user) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        user = await getCurrentUser();
      }
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }
    
    // Récupérer les informations à jour depuis Supabase
    const supabase = await createSupabaseServerClient();
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role, created_at, updated_at')
      .eq('id', user.userId)
      .single();
    
    if (profileError) {
      console.error('❌ Erreur récupération profil:', profileError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du profil' },
        { status: 500 }
      );
    }
    
    // Retourner les informations utilisateur
    return NextResponse.json({
      user: {
        id: user.userId,
        email: user.email,
        role: userProfile?.role || 'user',
        createdAt: userProfile?.created_at,
        updatedAt: userProfile?.updated_at,
      },
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}