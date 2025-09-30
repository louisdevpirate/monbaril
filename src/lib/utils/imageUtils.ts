/**
 * Convertit un chemin d'image relatif en URL absolue
 * @param imagePath - Le chemin de l'image (relatif ou absolu)
 * @returns L'URL absolue de l'image
 */
export function getAbsoluteImageUrl(imagePath: string): string {
  // Si c'est déjà une URL absolue, on la retourne telle quelle
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Sinon, on construit l'URL absolue
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const fullUrl = `${baseUrl}${imagePath}`;
  
  console.log(`🔧 getAbsoluteImageUrl: ${imagePath} -> ${fullUrl}`);
  console.log(`🔧 Base URL utilisée: ${baseUrl}`);
  
  return fullUrl;
}

/**
 * Convertit un chemin d'image relatif en URL absolue côté client
 * @param imagePath - Le chemin de l'image (relatif ou absolu)
 * @returns L'URL absolue de l'image
 */
export function getAbsoluteImageUrlClient(imagePath: string): string {
  // Si c'est déjà une URL absolue, on la retourne telle quelle
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Sinon, on construit l'URL absolue avec l'origine actuelle
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${imagePath}`;
  }
  
  // Fallback pour SSR
  return imagePath;
}
