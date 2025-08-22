import { z } from 'zod';

// Schéma de base pour l'email
export const emailSchema = z
  .string()
  .email('Format d\'email invalide')
  .min(5, 'Email trop court')
  .max(254, 'Email trop long')
  .toLowerCase()
  .trim();

// Schéma pour les mots de passe
export const passwordSchema = z
  .string()
  .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
  .max(128, 'Le mot de passe est trop long')

// Schéma pour les noms
export const nameSchema = z
  .string()
  .min(2, 'Le nom doit contenir au moins 2 caractères')
  .max(50, 'Le nom est trop long')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom contient des caractères non autorisés')
  .trim();

// Schéma pour les numéros de téléphone
export const phoneSchema = z
  .string()
  .regex(/^(\+33|0)[1-9](\d{8})$/, 'Format de téléphone invalide')
  .transform((val) => val.replace(/^0/, '+33')); // Normaliser en format international

// Schéma pour les URLs
export const urlSchema = z
  .string()
  .url('URL invalide')
  .refine((url) => url.startsWith('https://'), 'Seules les URLs HTTPS sont autorisées');

// Schéma pour les montants
export const amountSchema = z
  .number()
  .positive('Le montant doit être positif')
  .max(1000000, 'Montant trop élevé')
  .multipleOf(0.01, 'Le montant doit avoir au maximum 2 décimales');

// Schéma pour les quantités
export const quantitySchema = z
  .number()
  .int('La quantité doit être un nombre entier')
  .positive('La quantité doit être positive')
  .max(100, 'Quantité trop élevée');

// Schéma pour les IDs
export const idSchema = z
  .string()
  .min(1, 'ID requis')
  .max(100, 'ID trop long');

// Schéma pour les UUID
export const uuidSchema = z
  .string()
  .uuid('Format UUID invalide');

// Schéma pour les dates
export const dateSchema = z
  .string()
  .datetime('Format de date invalide')
  .or(z.date());

// Schéma pour les images
export const imageSchema = z
  .string()
  .regex(/^\/barils\/baril\d+\.(png|jpg|jpeg|webp)$/, 'Chemin d\'image invalide');

// Schéma pour les catégories
export const categorySchema = z
  .string()
  .min(1, 'Catégorie requise')
  .max(50, 'Catégorie trop longue')
  .regex(/^[a-z-]+$/, 'Format de catégorie invalide (minuscules et tirets uniquement)');

// Schéma pour les slugs
export const slugSchema = z
  .string()
  .min(1, 'Slug requis')
  .max(100, 'Slug trop long')
  .regex(/^[a-z0-9-]+$/, 'Format de slug invalide (minuscules, chiffres et tirets uniquement)');

// Schéma pour les descriptions
export const descriptionSchema = z
  .string()
  .min(10, 'La description doit contenir au moins 10 caractères')
  .max(1000, 'La description est trop longue')
  .trim();

// Schéma pour les titres
export const titleSchema = z
  .string()
  .min(3, 'Le titre doit contenir au moins 3 caractères')
  .max(100, 'Le titre est trop long')
  .trim();

// Schéma pour les prix
export const priceSchema = z
  .number()
  .positive('Le prix doit être positif')
  .max(10000, 'Prix trop élevé')
  .multipleOf(0.01, 'Le prix doit avoir au maximum 2 décimales');

// Schéma pour les statuts de commande
export const orderStatusSchema = z
  .enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']);

// Schéma pour les données de checkout Stripe
export const stripeCheckoutSchema = z.object({
  items: z.array(z.object({
    id: z.string().min(1, 'ID de produit requis'),
    name: z.string().min(1, 'Nom de produit requis'),
    price: z.number().positive('Prix invalide'),
    quantity: z.number().int().positive('Quantité invalide'),
    image: z.string().min(1, 'Image requise'),
  })).min(1, 'Au moins un produit requis'),
  email: emailSchema,
  total_price: z.number().positive('Prix total invalide'),
});

// Schéma pour les données de commande
export const orderSchema = z.object({
  email: emailSchema,
  status: orderStatusSchema,
  total_price: priceSchema,
  user_id: uuidSchema.optional(),
});

// Schéma pour les articles de commande
export const orderItemSchema = z.object({
  product_id: z.string().min(1, 'ID de produit requis'),
  product_name: titleSchema,
  price: priceSchema,
  quantity: quantitySchema,
  image: imageSchema,
  user_id: uuidSchema.optional(),
});

// Schéma pour les données de facture
export const invoiceSchema = z.object({
  order_number: z.string().min(1, 'Numéro de commande requis'),
  email: emailSchema,
  created_at: dateSchema,
  total_price: priceSchema,
  items: z.array(orderItemSchema).min(1, 'Au moins un article requis'),
});

// Schéma pour les données d'utilisateur
export const userSchema = z.object({
  email: emailSchema,
  name: nameSchema.optional(),
  phone: phoneSchema.optional(),
});

// Schéma pour la connexion
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Schéma pour l'inscription
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
  name: nameSchema.optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Schéma pour la réinitialisation de mot de passe
export const resetPasswordSchema = z.object({
  email: emailSchema,
});

// Schéma pour le changement de mot de passe
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string().min(1, 'Confirmation du nouveau mot de passe requise'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Les nouveaux mots de passe ne correspondent pas',
  path: ['confirmNewPassword'],
}); 