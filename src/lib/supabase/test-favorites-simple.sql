-- =====================================================
-- TEST SIMPLE DES FAVORIS
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- 1. VÉRIFIER QUE TOUT EST EN PLACE
SELECT 
    'Table favorites exists' as check_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'favorites' AND table_schema = 'public')
        THEN '✅ OK'
        ELSE '❌ MISSING'
    END as status
UNION ALL
SELECT 
    'Table products exists' as check_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products' AND table_schema = 'public')
        THEN '✅ OK'
        ELSE '❌ MISSING'
    END as status
UNION ALL
SELECT 
    'RLS enabled on favorites' as check_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'favorites' AND rowsecurity = true)
        THEN '✅ OK'
        ELSE '❌ MISSING'
    END as status
UNION ALL
SELECT 
    'Policies exist for favorites' as check_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favorites')
        THEN '✅ OK'
        ELSE '❌ MISSING'
    END as status;

-- 2. COMPTER LES DONNÉES
SELECT 
    'Products count' as data_type,
    COUNT(*)::text as count
FROM public.products
UNION ALL
SELECT 
    'Users count' as data_type,
    COUNT(*)::text as count
FROM auth.users
UNION ALL
SELECT 
    'Profiles count' as data_type,
    COUNT(*)::text as count
FROM public.profiles
UNION ALL
SELECT 
    'Favorites count' as data_type,
    COUNT(*)::text as count
FROM public.favorites;

-- 3. VÉRIFIER LES POLITIQUES RLS
SELECT 
    policyname,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN '✅ USING clause'
        ELSE '❌ No USING clause'
    END as using_clause,
    CASE 
        WHEN with_check IS NOT NULL THEN '✅ WITH CHECK clause'
        ELSE '❌ No WITH CHECK clause'
    END as with_check_clause
FROM pg_policies 
WHERE tablename = 'favorites'
ORDER BY policyname;

-- 4. TEST D'INSERTION (si des données existent)
-- Décommenter et adapter avec des valeurs réelles
/*
DO $$
DECLARE
    test_user_id UUID;
    test_product_id TEXT;
    insert_result TEXT;
BEGIN
    -- Récupérer un utilisateur existant
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    -- Récupérer un produit existant
    SELECT id INTO test_product_id FROM public.products LIMIT 1;
    
    IF test_user_id IS NOT NULL AND test_product_id IS NOT NULL THEN
        BEGIN
            INSERT INTO public.favorites (user_id, product_id)
            VALUES (test_user_id, test_product_id)
            ON CONFLICT (user_id, product_id) DO NOTHING;
            
            insert_result := 'SUCCESS';
        EXCEPTION
            WHEN OTHERS THEN
                insert_result := 'ERROR: ' || SQLERRM;
        END;
        
        RAISE NOTICE 'Test result: %', insert_result;
        RAISE NOTICE 'User ID: %, Product ID: %', test_user_id, test_product_id;
    ELSE
        RAISE NOTICE 'Cannot test: missing user or product data';
    END IF;
END $$;
*/
