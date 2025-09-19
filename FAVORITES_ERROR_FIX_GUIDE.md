# Guide de Résolution - Erreur Ajout aux Favoris

## Problème Identifié
L'erreur "❌ Erreur ajout favori: {}" indique un problème avec l'insertion dans la table `favorites`. L'objet d'erreur vide `{}` suggère un problème avec les politiques RLS ou les contraintes de base de données.

## Causes Possibles

### 1. **Politiques RLS Incorrectes**
- Les politiques RLS peuvent empêcher l'insertion
- Conflit entre différentes politiques (simplifiée vs détaillée)

### 2. **Contrainte d'Unicité**
- Tentative d'ajouter un produit déjà en favori
- Violation de la contrainte `UNIQUE(user_id, product_id)`

### 3. **Clé Étrangère Manquante**
- Référence vers un produit inexistant
- Contrainte de clé étrangère vers `products(id)` non respectée

### 4. **Authentification**
- Utilisateur non authentifié
- Session expirée

## Corrections Apportées

### 1. **Amélioration de la Gestion d'Erreur** (`src/hooks/useFavorites.ts`)
- ✅ Ajout de logs détaillés pour diagnostiquer l'erreur
- ✅ Affichage du message d'erreur spécifique dans le toast
- ✅ Logs des détails complets de l'erreur (message, code, hint, etc.)

### 2. **Scripts SQL de Diagnostic**

#### `src/lib/supabase/fix-favorites-rls.sql`
- Diagnostic complet de la table `favorites`
- Vérification des politiques RLS
- Correction des politiques RLS
- Test d'insertion

#### `src/lib/supabase/check-products-for-favorites.sql`
- Vérification de la table `products`
- Vérification des contraintes de clé étrangère
- Test de compatibilité entre `favorites` et `products`

## Étapes pour Résoudre le Problème

### 1. **Exécuter les Scripts de Diagnostic**
```sql
-- 1. Diagnostiquer les favoris
-- Exécuter le contenu de: src/lib/supabase/fix-favorites-rls.sql

-- 2. Vérifier les produits
-- Exécuter le contenu de: src/lib/supabase/check-products-for-favorites.sql
```

### 2. **Vérifier l'Authentification**
Assurez-vous que l'utilisateur est bien connecté :
```javascript
// Dans la console du navigateur
console.log('User:', user);
console.log('User ID:', user?.id);
```

### 3. **Vérifier les Données**
```sql
-- Vérifier qu'il y a des produits
SELECT COUNT(*) FROM public.products;

-- Vérifier qu'il y a des utilisateurs
SELECT COUNT(*) FROM auth.users;

-- Vérifier les favoris existants
SELECT COUNT(*) FROM public.favorites;
```

### 4. **Tester avec des Données Réelles**
```sql
-- Remplacer par des valeurs réelles
INSERT INTO public.favorites (user_id, product_id)
VALUES ('your-user-id', 'your-product-id')
ON CONFLICT (user_id, product_id) DO NOTHING;
```

## Diagnostic Avancé

### 1. **Vérifier les Logs du Navigateur**
Après avoir appliqué les corrections, les logs devraient maintenant afficher :
- Le message d'erreur spécifique
- Le code d'erreur
- Les détails et hints de Supabase

### 2. **Vérifier les Politiques RLS**
```sql
-- Lister toutes les politiques pour favorites
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'favorites';
```

### 3. **Vérifier les Contraintes**
```sql
-- Vérifier les contraintes de la table favorites
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'favorites';
```

## Solutions Spécifiques

### Si l'erreur est "duplicate key value violates unique constraint"
- Le produit est déjà en favori
- Solution : Vérifier avec `isFavorite()` avant d'ajouter

### Si l'erreur est "foreign key constraint fails"
- Le produit n'existe pas
- Solution : Vérifier que le `product_id` existe dans `products`

### Si l'erreur est "permission denied"
- Problème avec les politiques RLS
- Solution : Exécuter le script `fix-favorites-rls.sql`

### Si l'erreur est "relation does not exist"
- La table `favorites` n'existe pas
- Solution : Exécuter le script de création de table

## Test de Fonctionnement
Après avoir appliqué les corrections :
1. **Recharger la page** pour appliquer les nouveaux logs
2. **Essayer d'ajouter un favori** et vérifier les logs
3. **Vérifier le message d'erreur** dans le toast et la console
4. **Exécuter les scripts SQL** si nécessaire

## Prévention
- ✅ Vérification de l'authentification avant l'ajout
- ✅ Vérification de l'existence du produit
- ✅ Gestion des doublons avec `ON CONFLICT`
- ✅ Logs détaillés pour le diagnostic
- ✅ Politiques RLS sécurisées
