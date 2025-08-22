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
    
    // Récupérer les informations utilisateur depuis la base
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .eq('id', authData.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Erreur récupération profil:', profileError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du profil' },
        { status: 500 }
      );
    }
    
    // Générer les tokens JWT
    const sessionId = generateSessionId();
    
    const accessToken = generateAccessToken({
      userId: authData.user.id,
      email: authData.user.email!,
      role: userProfile?.role || 'user',
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
      role: userProfile?.role,
      timestamp: new Date().toISOString(),
    }));
    
    // Retourner les infos utilisateur (sans tokens)
    return NextResponse.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: userProfile?.role || 'user',
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