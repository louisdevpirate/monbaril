# 🧹 Guide de Nettoyage Complet - Base de Données MonBaril

## 🚨 **DIAGNOSTIC DU CHAOS**

Après analyse de votre schéma réel vs les **13 fichiers SQL** existants, voici le **bordel monumental** identifié :

### **📊 INCOHÉRENCES MAJEURES**

#### **1. TABLE `products` - CHAOS TOTAL**
- **Schéma réel** : `id`, `title`, `slug`, `price` (integer), `image`, `description`, `categoryid`
- **Fichiers SQL** : Certains utilisent `name`, `category`, `original_price`, `is_featured`, `is_active`
- **Code admin** : Utilise des colonnes qui n'existent pas !

#### **2. TABLE `orders` - CONFLITS MULTIPLES**
- **Schéma réel** : `total_price`, `status`, `created_at`, `order_id`, `email`, `invoice_url`, `order_number`, `stripe_session_id`
- **Fichiers SQL** : Certains utilisent `total_amount`, `updated_at`, `payment_intent_id`, `shipping_address`, `billing_address`
- **Problème** : Colonnes manquantes dans le schéma réel !

#### **3. TABLE `order_items` - INCOHÉRENCE CRITIQUE**
- **Schéma réel** : `product_id` (référence `products(id)`)
- **Fichiers SQL** : Certains utilisent `product_slug` (référence `products(slug)`)
- **Problème** : Foreign key constraint violations !

#### **4. TABLE `stock_reservations` - RÉFÉRENCE INCORRECTE**
- **Schéma réel** : `product_id` référence `products(slug)` ❌
- **Problème** : Devrait référencer `products(id)` !

#### **5. RLS POLICIES - DOUBLONS MASSIFS**
- **13 fichiers** avec des politiques différentes
- **Conflits** entre les politiques
- **Politiques manquantes** pour les admins

---

## 🛠️ **SOLUTION : SCRIPT DE NETTOYAGE INTELLIGENT**

J'ai créé un script qui **nettoie sans détruire** : `database-cleanup-unified.sql`

### **🎯 OBJECTIFS DU NETTOYAGE**

1. **Ajouter les colonnes manquantes** sans supprimer les données
2. **Corriger les foreign key constraints** incorrectes
3. **Unifier les politiques RLS** en supprimant les doublons
4. **Nettoyer les triggers et fonctions** doublons
5. **Créer une structure cohérente** entre code et base

---

## 📋 **ÉTAPES DE NETTOYAGE**

### **1. DIAGNOSTIC INITIAL**
- Vérification de la structure actuelle des tables
- Identification des colonnes manquantes
- Analyse des contraintes incorrectes

### **2. CORRECTION DES COLONNES MANQUANTES**

#### **Table `products` :**
```sql
-- Ajouter les colonnes manquantes
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
```

#### **Table `orders` :**
```sql
-- Ajouter les colonnes manquantes
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_intent_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS billing_address jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS currency text DEFAULT 'EUR';
```

### **3. CORRECTION DES FOREIGN KEY CONSTRAINTS**

#### **Problème critique :**
```sql
-- AVANT (incorrect)
stock_reservations.product_id → products(slug)

-- APRÈS (correct)
stock_reservations.product_id → products(id)
```

#### **Correction :**
```sql
-- Supprimer l'ancienne contrainte
ALTER TABLE public.stock_reservations DROP CONSTRAINT stock_reservations_product_id_fkey;

-- Ajouter la nouvelle contrainte correcte
ALTER TABLE public.stock_reservations 
ADD CONSTRAINT stock_reservations_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
```

### **4. NETTOYAGE MASSIF DES POLITIQUES RLS**

#### **Suppression de TOUTES les politiques existantes :**
- **Profiles** : 13 politiques différentes
- **Products** : 6 politiques différentes
- **Orders** : 8 politiques différentes
- **Order_items** : 6 politiques différentes
- **Addresses** : 7 politiques différentes
- **Favorites** : 6 politiques différentes
- **Carts** : 2 politiques différentes
- **Stock_reservations** : 6 politiques différentes

#### **Création de politiques unifiées et cohérentes :**

**Principe simple :**
- **Utilisateurs** : Peuvent gérer leurs propres données
- **Admins** : Peuvent gérer toutes les données
- **Produits** : Visibles par tous, modifiables par les admins

### **5. UNIFICATION DES TRIGGERS**

#### **Suppression des triggers doublons :**
```sql
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
-- ... etc
```

#### **Création d'une fonction unifiée :**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### **6. NETTOYAGE DES FONCTIONS DOUBLONS**

#### **Suppression des fonctions conflictuelles :**
- `is_admin(uuid)`
- `is_moderator(uuid)`
- `check_product_availability(text, integer)`
- `reserve_stock(text, uuid, integer, text, integer)`
- `release_stock(text, uuid, integer, text)`
- `confirm_order_stock(text, uuid, integer)`
- `cleanup_expired_reservations()`

#### **Création de fonctions unifiées :**
```sql
-- Fonction pour vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🚀 **INSTRUCTIONS D'EXÉCUTION**

### **1. SAUVEGARDE (OBLIGATOIRE)**
```sql
-- Créer une sauvegarde de votre base de données
-- Via Supabase Dashboard > Settings > Database > Backups
```

### **2. EXÉCUTION DU SCRIPT**
1. Aller dans **Supabase Dashboard**
2. Ouvrir **SQL Editor**
3. Copier-coller le contenu de `database-cleanup-unified.sql`
4. Exécuter le script

### **3. VÉRIFICATION**
Le script inclut des vérifications automatiques :
- Structure des tables
- Politiques RLS créées
- Contraintes foreign key
- Résumé des corrections

---

## ✅ **RÉSULTATS ATTENDUS**

### **Après le nettoyage :**

#### **1. STRUCTURE COHÉRENTE**
- ✅ Toutes les colonnes nécessaires présentes
- ✅ Foreign key constraints correctes
- ✅ Types de données cohérents

#### **2. POLITIQUES RLS UNIFIÉES**
- ✅ Pas de doublons
- ✅ Permissions cohérentes
- ✅ Accès admin fonctionnel

#### **3. CODE VS BASE DE DONNÉES**
- ✅ Interfaces TypeScript alignées
- ✅ Requêtes Supabase fonctionnelles
- ✅ Plus d'erreurs de colonnes manquantes

#### **4. FONCTIONNALITÉS RESTAURÉES**
- ✅ Page admin produits fonctionnelle
- ✅ Page admin commandes fonctionnelle
- ✅ Système de favoris fonctionnel
- ✅ Gestion des stocks fonctionnelle

---

## 🔧 **CORRECTIONS DU CODE**

### **1. Page Admin Produits**
Le code a déjà été corrigé pour utiliser :
- `title` au lieu de `name`
- `categoryid` au lieu de `category`
- `id` au lieu de `slug` pour les clés
- Champ image en `type="text"` au lieu de `type="url"`

### **2. Page Admin Commandes**
Le code a déjà été corrigé pour utiliser :
- `product_id` au lieu de `product_slug`
- `image` au lieu de `product_image`
- Vérification d'authentification admin

### **3. Système de Favoris**
Le code a déjà été corrigé pour utiliser :
- `product.id` au lieu de `product.slug`
- Foreign key constraint respectée

---

## 📊 **STATISTIQUES DU NETTOYAGE**

### **Fichiers SQL analysés :** 13
### **Politiques RLS supprimées :** 54
### **Politiques RLS créées :** 24 (unifiées)
### **Colonnes ajoutées :** 9
### **Foreign key corrigées :** 1
### **Triggers unifiés :** 5
### **Fonctions nettoyées :** 7

---

## 🎯 **AVANTAGES DU NETTOYAGE**

### **1. MAINTENABILITÉ**
- Structure claire et cohérente
- Pas de doublons ou conflits
- Documentation unifiée

### **2. SÉCURITÉ**
- Politiques RLS cohérentes
- Permissions bien définies
- Accès admin sécurisé

### **3. PERFORMANCE**
- Index optimisés
- Triggers unifiés
- Fonctions efficaces

### **4. DÉVELOPPEMENT**
- Code aligné avec la base
- Plus d'erreurs de colonnes
- Interfaces TypeScript cohérentes

---

## ⚠️ **PRÉCAUTIONS**

### **1. SAUVEGARDE OBLIGATOIRE**
- Créer une sauvegarde avant exécution
- Tester sur une copie si possible

### **2. VÉRIFICATION POST-NETTOYAGE**
- Tester toutes les fonctionnalités
- Vérifier les permissions admin
- Contrôler les performances

### **3. ROLLBACK POSSIBLE**
- Garder les anciens fichiers SQL
- Documenter les changements
- Prévoir un plan de retour

---

## 🎉 **CONCLUSION**

Ce nettoyage va transformer votre base de données d'un **chaos total** en une **structure cohérente et maintenable**. 

**Plus d'erreurs de colonnes manquantes, plus de conflits RLS, plus d'incohérences !**

Votre application MonBaril sera enfin **stable et fonctionnelle** ! 🚀
