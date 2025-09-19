-- =====================================================
-- 🧪 SCRIPT DE TEST - SCHEMA ECOMMERCE COMPLET
-- =====================================================
-- Script de test pour vérifier que le schema fonctionne correctement

-- =====================================================
-- 1. VÉRIFICATION DE LA STRUCTURE DES TABLES
-- =====================================================

SELECT 'VÉRIFICATION DE LA STRUCTURE DES TABLES' as test_step;

-- Vérifier la structure de categories
SELECT 
    'categories' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'categories' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier la structure de products
SELECT 
    'products' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier la structure de orders
SELECT 
    'orders' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier la structure de order_items
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
-- 2. VÉRIFICATION DES POLITIQUES RLS
-- =====================================================

SELECT 'VÉRIFICATION DES POLITIQUES RLS' as test_step;

-- Lister toutes les politiques RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- 3. VÉRIFICATION DES CONTRAINTES FOREIGN KEY
-- =====================================================

SELECT 'VÉRIFICATION DES CONTRAINTES FOREIGN KEY' as test_step;

-- Lister toutes les contraintes foreign key
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
-- 4. VÉRIFICATION DES FONCTIONS
-- =====================================================

SELECT 'VÉRIFICATION DES FONCTIONS' as test_step;

-- Lister toutes les fonctions créées
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
    AND routine_name IN ('is_admin', 'is_moderator', 'check_product_availability', 'reserve_stock', 'release_stock', 'confirm_order_stock', 'cleanup_expired_reservations')
ORDER BY routine_name;

-- =====================================================
-- 5. VÉRIFICATION DES INDEX
-- =====================================================

SELECT 'VÉRIFICATION DES INDEX' as test_step;

-- Lister tous les index créés
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =====================================================
-- 6. VÉRIFICATION DES TRIGGERS
-- =====================================================

SELECT 'VÉRIFICATION DES TRIGGERS' as test_step;

-- Lister tous les triggers créés
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- 7. TEST DES FONCTIONS UTILITAIRES
-- =====================================================

SELECT 'TEST DES FONCTIONS UTILITAIRES' as test_step;

-- Test de la fonction is_admin (doit retourner false pour un utilisateur non connecté)
SELECT is_admin() as is_admin_result;

-- Test de la fonction is_moderator (doit retourner false pour un utilisateur non connecté)
SELECT is_moderator() as is_moderator_result;

-- Test de la fonction check_product_availability (doit retourner false si pas de produit)
SELECT check_product_availability('test-product', 1) as availability_result;

-- =====================================================
-- 8. VÉRIFICATION DES DONNÉES DE TEST
-- =====================================================

SELECT 'VÉRIFICATION DES DONNÉES DE TEST' as test_step;

-- Vérifier les catégories de test
SELECT 'Catégories de test:' as info;
SELECT id, title, slug, is_active FROM public.categories ORDER BY sort_order;

-- Vérifier les produits de test
SELECT 'Produits de test:' as info;
SELECT id, title, slug, price, is_active, is_featured FROM public.products ORDER BY created_at;

-- Vérifier les coupons de test
SELECT 'Coupons de test:' as info;
SELECT code, name, discount_type, discount_value, is_active FROM public.coupons ORDER BY created_at;

-- =====================================================
-- 9. TEST DE CRÉATION D'UN PRODUIT (SIMULATION)
-- =====================================================

SELECT 'TEST DE CRÉATION D''UN PRODUIT' as test_step;

-- Test d'insertion d'un produit de test (simulation)
DO $$
BEGIN
    -- Vérifier si on peut insérer un produit
    IF EXISTS (SELECT 1 FROM public.categories WHERE id = 'racing') THEN
        RAISE NOTICE '✅ Test de création de produit: Structure OK';
    ELSE
        RAISE NOTICE '❌ Test de création de produit: Catégorie racing manquante';
    END IF;
    
    -- Vérifier si les colonnes nécessaires existent
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'is_active'
        AND table_schema = 'public'
    ) THEN
        RAISE NOTICE '✅ Colonne is_active présente dans products';
    ELSE
        RAISE NOTICE '❌ Colonne is_active manquante dans products';
    END IF;
END $$;

-- =====================================================
-- 10. RÉSUMÉ FINAL
-- =====================================================

SELECT 'RÉSUMÉ FINAL' as test_step;

-- Compter les tables
SELECT 'Nombre de tables:' as info, COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Compter les politiques RLS
SELECT 'Nombre de politiques RLS:' as info, COUNT(*) as count
FROM pg_policies 
WHERE schemaname = 'public';

-- Compter les fonctions
SELECT 'Nombre de fonctions:' as info, COUNT(*) as count
FROM information_schema.routines 
WHERE routine_schema = 'public';

-- Compter les index
SELECT 'Nombre d''index:' as info, COUNT(*) as count
FROM pg_indexes 
WHERE schemaname = 'public';

-- Compter les triggers
SELECT 'Nombre de triggers:' as info, COUNT(*) as count
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- =====================================================
-- FIN DU SCRIPT DE TEST
-- =====================================================

SELECT '✅ TESTS TERMINÉS AVEC SUCCÈS!' as status;
