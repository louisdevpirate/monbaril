-- =====================================================
-- SCRIPT DE TEST POUR LES COMMANDES ADMIN
-- À exécuter dans Supabase SQL Editor pour vérifier la configuration
-- =====================================================

-- 1. Vérifier que les tables existent
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name IN ('orders', 'order_items', 'profiles')
AND table_schema = 'public'
ORDER BY table_name;

-- 2. Vérifier les colonnes des tables
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('orders', 'order_items')
AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 3. Vérifier les politiques RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, policyname;

-- 4. Vérifier que RLS est activé
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('orders', 'order_items')
AND schemaname = 'public';

-- 5. Tester l'accès aux données (remplacer 'your-user-id' par un ID d'utilisateur admin réel)
-- SELECT 
--     o.id,
--     o.order_number,
--     o.status,
--     o.total_price,
--     o.created_at
-- FROM public.orders o
-- WHERE EXISTS (
--     SELECT 1 FROM public.profiles p
--     WHERE p.id = 'your-user-id'
--     AND p.role = 'admin'
-- )
-- LIMIT 5;

-- 6. Vérifier les données de test
SELECT COUNT(*) as total_orders FROM public.orders;
SELECT COUNT(*) as total_order_items FROM public.order_items;
SELECT COUNT(*) as total_profiles FROM public.profiles WHERE role = 'admin';
