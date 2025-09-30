# Guide de Résolution - Erreur Clé Étrangère Favoris

## Problème Identifié ✅
L'erreur **"insert or update on table "favorites" violates foreign key constraint "favorites_product_id_fkey"** était causée par une incohérence entre le code et la base de données :

- **Code** : Le `FavoriteButton` utilisait `product.slug` comme `productId`
- **Base de données** : La contrainte de clé étrangère `favorites_product_id_fkey` fait référence à `products.id`

## Cause Racine
```typescript
// ❌ AVANT (incorrect)
<FavoriteButton productId={product.slug} size="large" variant="default" />

// ✅ APRÈS (correct)
<FavoriteButton productId={product.id} size="large" variant="default" />
```

## Corrections Apportées

### 1. **Correction du Code** (`src/app/(ecommerce)/collections/[slug]/page.tsx`)
- ✅ Changé `product.slug` en `product.id` dans le `FavoriteButton`
- ✅ Maintenant cohérent avec la contrainte de clé étrangère

### 2. **Script SQL de Correction** (`src/lib/supabase/fix-products-for-favorites.sql`)
- ✅ Vérification des produits existants dans la base
- ✅ Insertion des produits manquants (IDs: "1", "2", "3")
- ✅ Insertion des catégories manquantes
- ✅ Test d'insertion de favoris

## Étapes pour Résoudre Complètement

### 1. **Exécuter le Script SQL**
```sql
-- Exécuter le contenu de: src/lib/supabase/fix-products-for-favorites.sql
```

### 2. **Vérifier les Produits en Base**
```sql
-- Vérifier que les produits existent
SELECT id, title, slug FROM public.products WHERE id IN ('1', '2', '3');
```

### 3. **Tester la Fonctionnalité**
1. Aller sur une page de produit : `/collections/baril-racing-gulf`
2. Cliquer sur le bouton "Ajouter aux favoris"
3. Vérifier que ça fonctionne sans erreur

## Structure de la Base de Données

### Table `products`
```sql
CREATE TABLE public.products (
  id text NOT NULL,           -- ← Clé primaire (utilisée par favorites)
  title text NOT NULL,
  slug text NOT NULL UNIQUE,  -- ← Utilisé pour les URLs
  price integer NOT NULL,
  image text NOT NULL,
  description text,
  categoryid text,
  stock_quantity integer DEFAULT 0,
  CONSTRAINT products_pkey PRIMARY KEY (id)
);
```

### Table `favorites`
```sql
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id text NOT NULL,   -- ← Référence products.id
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
```

## Produits de Test

Les produits suivants doivent exister dans la base :

| ID | Titre | Slug | Prix |
|----|-------|------|------|
| "1" | Baril Racing Gulf | baril-racing-gulf | 149€ |
| "2" | Baril Militaire Cargo | baril-militaire-cargo | 129€ |
| "3" | Baril Vintage Oil | baril-vintage-oil | 139€ |

## Vérification du Fonctionnement

### 1. **Logs d'Erreur Améliorés**
Maintenant, si une erreur se produit, vous verrez :
```javascript
console.error("❌ Erreur ajout favori:", error);
console.error("❌ Détails de l'erreur:", {
  message: error.message,
  details: error.details,
  hint: error.hint,
  code: error.code
});
```

### 2. **Test Manuel**
1. Se connecter avec un compte utilisateur
2. Aller sur `/collections/baril-racing-gulf`
3. Cliquer sur le bouton "Ajouter aux favoris"
4. Vérifier que le toast affiche "❤️ Ajouté aux favoris"

### 3. **Vérification en Base**
```sql
-- Vérifier les favoris de l'utilisateur
SELECT f.*, p.title, p.slug
FROM public.favorites f
JOIN public.products p ON f.product_id = p.id
WHERE f.user_id = 'your-user-id';
```

## Prévention des Erreurs Futures

### 1. **Cohérence des IDs**
- ✅ Toujours utiliser `product.id` pour les clés étrangères
- ✅ Utiliser `product.slug` uniquement pour les URLs

### 2. **Validation des Données**
- ✅ Vérifier que les produits existent avant l'insertion
- ✅ Gestion d'erreur détaillée pour le diagnostic

### 3. **Tests Automatisés**
- ✅ Script SQL de vérification des données
- ✅ Test d'insertion de favoris

## Résultat Attendu
Après avoir appliqué ces corrections :
- ✅ Les favoris fonctionnent correctement
- ✅ Plus d'erreur de clé étrangère
- ✅ Messages d'erreur informatifs en cas de problème
- ✅ Données cohérentes entre le code et la base
