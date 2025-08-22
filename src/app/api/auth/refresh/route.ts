import { NextResponse } from 'next/server';
import { getRefreshToken, verifyRefreshToken, generateAccessToken, setTokenCookies } from '@/lib/auth/jwt';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    // Récupérer le refresh token
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token manquant' },
        { status: 401 }
      );
    }
    
    // Vérifier le refresh token
    const payload = verifyRefreshToken(refreshToken);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Refresh token invalide' },
        { status: 401 }
      );
    }
    
    // Pour l'instant, on fait confiance au refresh token valide
    // Plus tard on pourra ajouter des vérifications en base
    
    // Générer un nouvel access token (on récupérera l'email plus tard)
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: 'user@temp.com', // Temporaire
      role: 'user',
      sessionId: payload.sessionId,
    });
    
    // Mettre à jour le cookie access token (garder le même refresh token)
    const cookieStore = await import('next/headers').then(mod => mod.cookies());
    const store = await cookieStore;
    
    store.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });
    
    console.log('🔄 Token rafraîchi pour utilisateur:', {
      userId: payload.userId,
      sessionId: payload.sessionId,
      timestamp: new Date().toISOString(),
    });
    
    return NextResponse.json({
      message: 'Token rafraîchi avec succès',
      user: {
        id: payload.userId,
        email: 'user@temp.com', // Temporaire
        role: 'user',
      },
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du rafraîchissement du token:', error);
    return NextResponse.json(
      { error: 'Erreur lors du rafraîchissement' },
      { status: 500 }
    );
  }
}