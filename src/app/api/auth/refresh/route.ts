import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getRefreshToken, verifyRefreshToken, generateAccessToken } from '@/lib/auth/jwt';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token manquant' }, { status: 401 });
    }

    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json({ error: 'Refresh token invalide' }, { status: 401 });
    }

    // Récupérer les infos réelles via Supabase SSR session
    const supabase = await createSupabaseServerClient();

    const [{ data: { user: authUser } }, { data: profile }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from('profiles').select('role').eq('id', payload.userId).single(),
    ]);

    if (!authUser?.email || authUser.id !== payload.userId) {
      return NextResponse.json({ error: 'Session expirée' }, { status: 401 });
    }

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: authUser.email,
      role: profile?.role || 'user',
      sessionId: payload.sessionId,
    });

    const cookieStore = await cookies();
    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60,
    });

    return NextResponse.json({
      message: 'Token rafraîchi avec succès',
      user: {
        id: payload.userId,
        email: authUser.email,
        role: profile?.role || 'user',
      },
    });

  } catch (error) {
    console.error('Erreur rafraîchissement token:', error);
    return NextResponse.json({ error: 'Erreur lors du rafraîchissement' }, { status: 500 });
  }
}