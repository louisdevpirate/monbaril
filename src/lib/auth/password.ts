import bcrypt from 'bcryptjs';

// Configuration du hashing
const SALT_ROUNDS = 12; // Plus sécurisé que le défaut (10)

/**
 * Hash un mot de passe avec bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe:', error);
    throw new Error('Erreur lors du hachage du mot de passe');
  }
}

/**
 * Vérifie un mot de passe contre son hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe:', error);
    return false;
  }
}

/**
 * Génère un mot de passe temporaire sécurisé
 */
export function generateTempPassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

/**
 * Vérifie la force d'un mot de passe
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  // Longueur minimale
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  // Longueur optimale
  if (password.length >= 12) {
    score += 1;
  } else if (password.length >= 8) {
    feedback.push('Un mot de passe de 12 caractères ou plus est recommandé');
  }
  
  // Minuscules
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez des lettres minuscules');
  }
  
  // Majuscules
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez des lettres majuscules');
  }
  
  // Chiffres
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez des chiffres');
  }
  
  // Caractères spéciaux
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez des caractères spéciaux (!@#$%^&* etc.)');
  }
  
  // Pas de répétitions
  if (!/(.)\1{2,}/.test(password)) {
    score += 1;
  } else {
    feedback.push('Évitez les répétitions de caractères');
  }
  
  // Pas de séquences communes
  const commonSequences = ['123', 'abc', 'qwe', 'password', 'admin'];
  const hasCommonSequence = commonSequences.some(seq => 
    password.toLowerCase().includes(seq)
  );
  
  if (!hasCommonSequence) {
    score += 1;
  } else {
    feedback.push('Évitez les séquences communes (123, abc, etc.)');
  }
  
  return { score, feedback };
}

/**
 * Génère un token de réinitialisation sécurisé
 */
export function generateResetToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Génère un salt personnalisé (si besoin d'un contrôle plus fin)
 */
export async function generateCustomSalt(): Promise<string> {
  return await bcrypt.genSalt(SALT_ROUNDS);
}