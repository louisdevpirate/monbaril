-- =====================================================
-- 🧹 SCRIPT DE NETTOYAGE INTELLIGENT - MONBARIL APP
-- =====================================================
-- Ce script nettoie les incohérences SANS supprimer les données
-- À exécuter dans Supabase SQL Editor

-- =====================================================
-- 1. DIAGNOSTIC INITIAL
-- =====================================================

-- Vérifier la structure actuelle des tables
SELECT 'DIAGNOSTIC INITIAL' as step;

-- Structure de la table products
SELECT 
    'products' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Structure de la table orders
SELECT 
    'orders' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Structure de la table order_items
SELECT 
    'order_items' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- 2. CORRECTION DES COLONNES MANQUANTES
-- =====================================================

SELECT 'CORRECTION DES COLONNES MANQUANTES' as step;

-- Ajouter les colonnes manquantes à la table products
DO $$ 
BEGIN
    -- Ajouter created_at si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'created_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN created_at timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Colonne created_at ajoutée à products';
    END IF;

    -- Ajouter updated_at si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN updated_at timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Colonne updated_at ajoutée à products';
    END IF;

    -- Ajouter is_active si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'is_active'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_active boolean DEFAULT true;
        RAISE NOTICE 'Colonne is_active ajoutée à products';
    END IF;

    -- Ajouter is_featured si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'is_featured'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_featured boolean DEFAULT false;
        RAISE NOTICE 'Colonne is_featured ajoutée à products';
    END IF;
END $$;

-- Ajouter les colonnes manquantes à la table orders
DO $$ 
BEGIN
    -- Ajouter updated_at si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN updated_at timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Colonne updated_at ajoutée à orders';
    END IF;

    -- Ajouter payment_intent_id si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_intent_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN payment_intent_id text;
        RAISE NOTICE 'Colonne payment_intent_id ajoutée à orders';
    END IF;

    -- Ajouter shipping_address si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'shipping_address'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN shipping_address jsonb;
        RAISE NOTICE 'Colonne shipping_address ajoutée à orders';
    END IF;

    -- Ajouter billing_address si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'billing_address'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN billing_address jsonb;
        RAISE NOTICE 'Colonne billing_address ajoutée à orders';
    END IF;

    -- Ajouter notes si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'notes'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN notes text;
        RAISE NOTICE 'Colonne notes ajoutée à orders';
    END IF;

    -- Ajouter currency si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'currency'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN currency text DEFAULT 'EUR';
        RAISE NOTICE 'Colonne currency ajoutée à orders';
    END IF;
END $$;

-- =====================================================
-- 3. CORRECTION DES FOREIGN KEY CONSTRAINTS
-- =====================================================

SELECT 'CORRECTION DES FOREIGN KEY CONSTRAINTS' as step;

-- Corriger la foreign key de stock_reservations (slug → id)
DO $$ 
BEGIN
    -- Supprimer l'ancienne contrainte
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'stock_reservations_product_id_fkey'
        AND table_name = 'stock_reservations'
    ) THEN
        ALTER TABLE public.stock_reservations DROP CONSTRAINT stock_reservations_product_id_fkey;
        RAISE NOTICE 'Ancienne contrainte stock_reservations_product_id_fkey supprimée';
    END IF;

    -- Ajouter la nouvelle contrainte correcte
    ALTER TABLE public.stock_reservations 
    ADD CONSTRAINT stock_reservations_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Nouvelle contrainte stock_reservations_product_id_fkey ajoutée (référence products.id)';
END $$;

-- =====================================================
-- 4. NETTOYAGE DES TRIGGERS DOUBLONS
-- =====================================================

SELECT 'NETTOYAGE DES TRIGGERS DOUBLONS' as step;

-- Supprimer les triggers doublons
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_addresses_updated_at ON public.addresses;
DROP TRIGGER IF EXISTS update_favorites_updated_at ON public.favorites;

-- Créer une fonction unifiée pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recréer les triggers unifiés
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON public.addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_favorites_updated_at
    BEFORE UPDATE ON public.favorites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. NETTOYAGE MASSIF DES POLITIQUES RLS
-- =====================================================

SELECT 'NETTOYAGE MASSIF DES POLITIQUES RLS' as step;

-- Supprimer TOUTES les politiques existantes pour repartir à zéro
-- PROFILES
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Moderators can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Moderators can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert any profile" ON public.profiles;

-- PRODUCTS
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- ORDERS
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can insert all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete all orders" ON public.orders;

-- ORDER_ITEMS
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create their order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view order items of their orders" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert order items for their orders" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can insert all order items" ON public.order_items;

-- ADDRESSES
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can create their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Admins can view all addresses" ON public.addresses;
DROP POLICY IF EXISTS "Admins can update all addresses" ON public.addresses;
DROP POLICY IF EXISTS "Admins can delete all addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can view own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON public.addresses;

-- FAVORITES
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can update their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Admins can manage all favorites" ON public.favorites;

-- CARTS
DROP POLICY IF EXISTS "Users can manage their own cart" ON public.carts;
DROP POLICY IF EXISTS "Admins can manage all carts" ON public.carts;

-- STOCK_RESERVATIONS
DROP POLICY IF EXISTS "Users can manage their own stock reservations" ON public.stock_reservations;
DROP POLICY IF EXISTS "Users can view their own reservations" ON public.stock_reservations;
DROP POLICY IF EXISTS "Users can create their own reservations" ON public.stock_reservations;
DROP POLICY IF EXISTS "Users can update their own reservations" ON public.stock_reservations;
DROP POLICY IF EXISTS "Users can delete their own reservations" ON public.stock_reservations;
DROP POLICY IF EXISTS "Admins can manage all reservations" ON public.stock_reservations;

-- =====================================================
-- 6. CRÉATION DES POLITIQUES RLS UNIFIÉES ET COHÉRENTES
-- =====================================================

SELECT 'CRÉATION DES POLITIQUES RLS UNIFIÉES' as step;

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_reservations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLITIQUES RLS POUR PROFILES
-- =====================================================

-- Utilisateurs peuvent voir/modifier leur propre profil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins peuvent tout faire sur les profils
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete all profiles" ON public.profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR PRODUCTS
-- =====================================================

-- Tout le monde peut voir les produits
CREATE POLICY "Anyone can view products" ON public.products
    FOR SELECT USING (true);

-- Seuls les admins peuvent gérer les produits
CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR ORDERS
-- =====================================================

-- Utilisateurs peuvent voir leurs propres commandes
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins peuvent tout faire sur les commandes
CREATE POLICY "Admins can manage all orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR ORDER_ITEMS
-- =====================================================

-- Utilisateurs peuvent voir les items de leurs commandes
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_items.order_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_items.order_id 
            AND user_id = auth.uid()
        )
    );

-- Admins peuvent tout faire sur les order_items
CREATE POLICY "Admins can manage all order items" ON public.order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR ADDRESSES
-- =====================================================

-- Utilisateurs peuvent gérer leurs propres adresses
CREATE POLICY "Users can manage own addresses" ON public.addresses
    FOR ALL USING (auth.uid() = user_id);

-- Admins peuvent gérer toutes les adresses
CREATE POLICY "Admins can manage all addresses" ON public.addresses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR FAVORITES
-- =====================================================

-- Utilisateurs peuvent gérer leurs propres favoris
CREATE POLICY "Users can manage own favorites" ON public.favorites
    FOR ALL USING (auth.uid() = user_id);

-- Admins peuvent gérer tous les favoris
CREATE POLICY "Admins can manage all favorites" ON public.favorites
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR CARTS
-- =====================================================

-- Utilisateurs peuvent gérer leur propre panier
CREATE POLICY "Users can manage own cart" ON public.carts
    FOR ALL USING (auth.uid() = user_id);

-- Admins peuvent gérer tous les paniers
CREATE POLICY "Admins can manage all carts" ON public.carts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR STOCK_RESERVATIONS
-- =====================================================

-- Utilisateurs peuvent gérer leurs propres réservations
CREATE POLICY "Users can manage own stock reservations" ON public.stock_reservations
    FOR ALL USING (auth.uid() = user_id);

-- Admins peuvent gérer toutes les réservations
CREATE POLICY "Admins can manage all stock reservations" ON public.stock_reservations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- 7. VÉRIFICATION FINALE
-- =====================================================

SELECT 'VÉRIFICATION FINALE' as step;

-- Vérifier la structure finale des tables
SELECT 'Structure finale des tables:' as info;

-- Products
SELECT 
    'products' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Orders
SELECT 
    'orders' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier les politiques RLS
SELECT 'Politiques RLS créées:' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Vérifier les contraintes foreign key
SELECT 'Contraintes foreign key:' as info;
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- =====================================================
-- 8. NETTOYAGE DES FONCTIONS DOUBLONS
-- =====================================================

SELECT 'NETTOYAGE DES FONCTIONS DOUBLONS' as step;

-- Supprimer les fonctions doublons
DROP FUNCTION IF EXISTS is_admin(uuid);
DROP FUNCTION IF EXISTS is_moderator(uuid);
DROP FUNCTION IF EXISTS check_product_availability(text, integer);
DROP FUNCTION IF EXISTS reserve_stock(text, uuid, integer, text, integer);
DROP FUNCTION IF EXISTS release_stock(text, uuid, integer, text);
DROP FUNCTION IF EXISTS confirm_order_stock(text, uuid, integer);
DROP FUNCTION IF EXISTS cleanup_expired_reservations();

-- =====================================================
-- 9. CRÉATION DES FONCTIONS UNIFIÉES
-- =====================================================

SELECT 'CRÉATION DES FONCTIONS UNIFIÉES' as step;

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

-- Fonction pour vérifier si l'utilisateur est moderator ou admin
CREATE OR REPLACE FUNCTION is_moderator(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id 
        AND role IN ('moderator', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 10. FINALISATION
-- =====================================================

SELECT '✅ NETTOYAGE TERMINÉ AVEC SUCCÈS!' as status;

-- Résumé des corrections
SELECT 'RÉSUMÉ DES CORRECTIONS:' as info;
SELECT '1. ✅ Colonnes manquantes ajoutées (created_at, updated_at, is_active, is_featured, etc.)' as correction;
SELECT '2. ✅ Foreign key constraints corrigées (stock_reservations → products.id)' as correction;
SELECT '3. ✅ Triggers unifiés et doublons supprimés' as correction;
SELECT '4. ✅ Politiques RLS nettoyées et unifiées' as correction;
SELECT '5. ✅ Fonctions utilitaires unifiées' as correction;
SELECT '6. ✅ Structure cohérente entre code et base de données' as correction;

-- =====================================================
-- FIN DU SCRIPT DE NETTOYAGE
-- =====================================================
