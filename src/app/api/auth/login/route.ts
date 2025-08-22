import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { validateData, sanitizeForLogging } from '@/lib/validation/validate';
import { loginSchema } from '@/lib/validation/schemas';
import { verifyPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken, setTokenCookies, generateSessionId } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 🔒 VALIDATION DES DONNÉES
    const validation = validateData(loginSchema, body);
    if (!validation.success) {
      console.error('❌ Validation login échouée:', validation.errors);
      return NextResponse.json(
        { 
          error: 'Données invalides', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }
    
    const { email, password } = validation.data!;
    console.log('🔐 Tentative de connexion pour:', sanitizeForLogging({ email }));
    
    const supabase = await createSupabaseServerClient();
    
    // Vérifier si l'utilisateur existe dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authError || !authData.user) {
      console.error('❌ Échec de connexion Supabase:', authError?.message);
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }
    
    // Utiliser les données Supabase Auth directement (pas besoin de table profiles pour l'instant)
    console.log('✅ Utilisateur authentifié:', {
      id: authData.user.id,
      email: authData.user.email,
    });
    
    // Générer les tokens JWT
    const sessionId = generateSessionId();
    
    const accessToken = generateAccessToken({
      userId: authData.user.id,
      email: authData.user.email!,
      role: 'user', // Par défaut pour l'instant
      sessionId,
    });
    
    const refreshToken = generateRefreshToken({
      userId: authData.user.id,
      sessionId,
    });
    
    // Stocker les tokens dans des cookies sécurisés
    await setTokenCookies(accessToken, refreshToken);
    
    // Log de connexion réussie (sans données sensibles)
    console.log('✅ Connexion réussie:', sanitizeForLogging({
      userId: authData.user.id,
      email: authData.user.email,
      role: 'user',
      timestamp: new Date().toISOString(),
    }));
    
    // Retourner les infos utilisateur (sans tokens)
    return NextResponse.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: 'user',
        emailVerified: authData.user.email_confirmed_at ? true : false,
      },
      message: 'Connexion réussie',
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la connexion' },
      { status: 500 }
    );
  }
}