import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { securityConfig } from '@/lib/security/config';

// Types pour les tokens
export interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
  sessionId?: string;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
  tokenVersion?: number;
}

// Configuration des cookies
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
};

const ACCESS_TOKEN_NAME = 'access_token';
const REFRESH_TOKEN_NAME = 'refresh_token';

// Durées des tokens
const ACCESS_TOKEN_EXPIRY = '15m';  // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d';  // 7 jours

/**
 * Génère un access token JWT
 */
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(
    payload,
    securityConfig.jwt.secret,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
      issuer: 'monbaril-app',
      audience: 'monbaril-users',
    }
  );
}

/**
 * Génère un refresh token JWT
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(
    payload,
    securityConfig.jwt.secret + '_refresh',
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
      issuer: 'monbaril-app',
      audience: 'monbaril-users',
    }
  );
}

/**
 * Vérifie et décode un access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(
      token,
      securityConfig.jwt.secret,
      {
        issuer: 'monbaril-app',
        audience: 'monbaril-users',
      }
    ) as JWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('Erreur vérification access token:', error);
    return null;
  }
}

/**
 * Vérifie et décode un refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(
      token,
      securityConfig.jwt.secret + '_refresh',
      {
        issuer: 'monbaril-app',
        audience: 'monbaril-users',
      }
    ) as RefreshTokenPayload;
    
    return decoded;
  } catch (error) {
    console.error('Erreur vérification refresh token:', error);
    return null;
  }
}

/**
 * Stocke les tokens dans des cookies sécurisés
 */
export async function setTokenCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  
  // Access token - durée courte
  cookieStore.set(ACCESS_TOKEN_NAME, accessToken, {
    ...COOKIE_CONFIG,
    maxAge: 15 * 60, // 15 minutes en secondes
  });
  
  // Refresh token - durée longue
  cookieStore.set(REFRESH_TOKEN_NAME, refreshToken, {
    ...COOKIE_CONFIG,
    maxAge: 7 * 24 * 60 * 60, // 7 jours en secondes
  });
}

/**
 * Récupère l'access token depuis les cookies
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_NAME)?.value || null;
  } catch (error) {
    console.error('Erreur récupération access token:', error);
    return null;
  }
}

/**
 * Récupère le refresh token depuis les cookies
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_NAME)?.value || null;
  } catch (error) {
    console.error('Erreur récupération refresh token:', error);
    return null;
  }
}

/**
 * Supprime tous les tokens (déconnexion)
 */
export async function clearTokenCookies() {
  const cookieStore = await cookies();
  
  cookieStore.delete(ACCESS_TOKEN_NAME);
  cookieStore.delete(REFRESH_TOKEN_NAME);
}

/**
 * Récupère l'utilisateur actuel depuis les cookies
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const accessToken = await getAccessToken();
  
  if (!accessToken) {
    return null;
  }
  
  return verifyAccessToken(accessToken);
}

/**
 * Rafraîchit l'access token en utilisant le refresh token
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  
  if (!refreshToken) {
    return null;
  }
  
  const payload = verifyRefreshToken(refreshToken);
  
  if (!payload) {
    return null;
  }
  
  // Générer un nouvel access token
  const newAccessToken = generateAccessToken({
    userId: payload.userId,
    email: '', // On devra récupérer l'email depuis la DB
    sessionId: payload.sessionId,
  });
  
  // Mettre à jour le cookie
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_NAME, newAccessToken, {
    ...COOKIE_CONFIG,
    maxAge: 15 * 60, // 15 minutes
  });
  
  return newAccessToken;
}

/**
 * Génère un ID de session unique
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

/**
 * Vérifie si un utilisateur est authentifié
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Vérifie si un utilisateur a un rôle spécifique
 */
export async function hasRole(requiredRole: string): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === requiredRole;
}

/**
 * Middleware d'authentification pour les API routes
 */
export async function requireAuth(request: Request): Promise<JWTPayload | Response> {
  const user = await getCurrentUser();
  
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Non authentifié' }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  return user;
}