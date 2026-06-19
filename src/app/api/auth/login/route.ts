import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { validateData } from '@/lib/validation/validate';
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

    const supabase = await createSupabaseServerClient();
    
    // Vérifier si l'utilisateur existe dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }
    
    // Récupérer ou créer le profil utilisateur
    let userProfile = null;
    
    // Vérifier si le profil existe déjà
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (existingProfile) {
      userProfile = existingProfile;
    } else {
      // Créer le profil s'il n'existe pas
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username: authData.user.email?.split('@')[0] || 'user',
            role: 'user',
            is_active: true,
            last_login: new Date().toISOString(),
            subscription_tier: 'free',
            total_orders: 0,
            total_spent: 0.00,
            preferences: { theme: 'light', language: 'fr' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();
      
      if (!profileError) {
        userProfile = newProfile;
      }
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
    
    // Retourner les infos utilisateur (sans tokens)
    return NextResponse.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: userProfile?.role || 'user',
        username: userProfile?.username,
        emailVerified: authData.user.email_confirmed_at ? true : false,
      },
      message: 'Connexion réussie',
    });
    
  } catch (error) {
    console.error('Erreur serveur login:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la connexion' },
      { status: 500 }
    );
  }
}