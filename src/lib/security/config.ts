// Configuration de sécurité centralisée
export const securityConfig = {
  // Headers de sécurité
  headers: {
    // Content Security Policy
    csp: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", "data:", "https:"],
      'font-src': ["'self'", "https:"],
      'connect-src': ["'self'", "https:"],
      'frame-src': ["'none'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
    },
    
    // Autres headers de sécurité
    hsts: {
      maxAge: 31536000, // 1 an
      includeSubDomains: true,
      preload: true,
    },
    
    // Protection contre le clickjacking
    xFrameOptions: 'DENY',
    
    // Protection contre le MIME sniffing
    xContentTypeOptions: 'nosniff',
    
    // Protection contre les attaques XSS
    xXSSProtection: '1; mode=block',
    
    // Référent Policy
    referrerPolicy: 'strict-origin-when-cross-origin',
  },
  
  // Configuration des cookies
  cookies: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes par fenêtre
    message: 'Trop de requêtes, veuillez réessayer plus tard.',
  },
  
  // Configuration CSRF
  csrf: {
    secretLength: 32,
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 heures
  },
  
  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    expiresIn: '7d',
    refreshExpiresIn: '30d',
  },
  
  // Configuration des uploads
  uploads: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimes: ['image/jpeg', 'image/png', 'image/webp'],
    scanForViruses: true,
  },
  
  // Configuration des logs
  logging: {
    sensitiveFields: ['password', 'token', 'secret', 'key'],
    logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  },
}; 