# Guide de Résolution - Erreur Récupération Commandes

## Problème Identifié
L'erreur "Erreur récupération commandes: {}" était causée par plusieurs problèmes :

1. **Incohérences de schéma** : Le code utilisait des noms de colonnes différents de ceux définis dans la base de données
2. **Politiques RLS manquantes** : Les politiques Row Level Security ne permettaient pas aux admins de voir toutes les commandes
3. **Vérification d'authentification manquante** : La page admin ne vérifiait pas si l'utilisateur était authentifié et avait le rôle admin

## Corrections Apportées

### 1. Code de la Page Admin (`src/app/(admin)/admin/orders/page.tsx`)
- ✅ Corrigé les noms de colonnes dans l'interface `OrderItem`
- ✅ Mis à jour la requête Supabase pour utiliser les bonnes colonnes
- ✅ Ajouté la vérification d'authentification et de rôle admin
- ✅ Supprimé les références à la colonne `updated_at` qui n'existe pas

### 2. Scripts SQL Créés

#### `src/lib/supabase/fix-admin-orders-rls.sql`
- Politiques RLS pour permettre aux admins de voir toutes les commandes
- Politiques RLS pour permettre aux admins de modifier toutes les commandes
- Politiques RLS pour les articles de commande (order_items)

#### `src/lib/supabase/add-missing-order-columns.sql`
- Ajout de la colonne `updated_at` à la table `orders`
- Ajout de la colonne `product_slug` à la table `order_items`
- Création du trigger pour la mise à jour automatique de `updated_at`

#### `src/lib/supabase/test-orders-setup.sql`
- Script de test pour vérifier la configuration
- Vérification des tables, colonnes, politiques RLS

## Étapes pour Résoudre le Problème

### 1. Exécuter les Scripts SQL dans Supabase
```sql
-- 1. Ajouter les colonnes manquantes
-- Exécuter le contenu de: src/lib/supabase/add-missing-order-columns.sql

-- 2. Corriger les politiques RLS
-- Exécuter le contenu de: src/lib/supabase/fix-admin-orders-rls.sql

-- 3. Vérifier la configuration
-- Exécuter le contenu de: src/lib/supabase/test-orders-setup.sql
```

### 2. Vérifier l'Utilisateur Admin
Assurez-vous qu'il existe au moins un utilisateur avec le rôle 'admin' dans la table `profiles` :

```sql
-- Vérifier les utilisateurs admin
SELECT id, role FROM public.profiles WHERE role = 'admin';

-- Si aucun admin n'existe, en créer un (remplacer 'user-id' par l'ID réel)
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'user-id';
```

### 3. Tester la Page Admin
1. Connectez-vous avec un compte admin
2. Naviguez vers `/admin/orders`
3. Vérifiez que les commandes s'affichent correctement

## Changements de Colonnes

| Ancien Nom | Nouveau Nom | Table |
|------------|-------------|-------|
| `product_image` | `image` | `order_items` |
| `product_slug` | `product_id` | `order_items` |
| `updated_at` | Supprimé | `orders` |

## Sécurité
- ✅ Vérification d'authentification obligatoire
- ✅ Vérification du rôle admin obligatoire
- ✅ Redirection vers `/login` si non authentifié
- ✅ Redirection vers `/` si pas admin
- ✅ Politiques RLS sécurisées

## Test de Fonctionnement
Après avoir exécuté les scripts SQL, la page admin devrait :
1. Vérifier l'authentification
2. Vérifier le rôle admin
3. Charger les commandes avec leurs articles
4. Permettre la modification du statut des commandes
5. Afficher les détails des commandes dans le modal
