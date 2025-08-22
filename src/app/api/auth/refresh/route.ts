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
    
    // Récupérer les informations utilisateur depuis Supabase
    const supabase = await createSupabaseServerClient();
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('id', payload.userId)
      .single();
    
    if (profileError || !userProfile) {
      console.error('❌ Utilisateur non trouvé lors du refresh:', profileError);
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 401 }
      );
    }
    
    // Générer un nouvel access token
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: userProfile.email,
      role: userProfile.role || 'user',
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
        id: userProfile.id,
        email: userProfile.email,
        role: userProfile.role || 'user',
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