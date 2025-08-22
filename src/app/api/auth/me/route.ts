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
    
    // Retourner les informations depuis le JWT (simplifié pour l'instant)
    return NextResponse.json({
      user: {
        id: user.userId,
        email: user.email,
        role: user.role || 'user',
        sessionId: user.sessionId,
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