-- =====================================================
-- VÉRIFICATION DE LA TABLE PRODUCTS POUR LES FAVORIS
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- 1. VÉRIFIER L'EXISTENCE DE LA TABLE PRODUCTS
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'products'
AND table_schema = 'public';

-- 2. VÉRIFIER LA STRUCTURE DE LA TABLE PRODUCTS
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. VÉRIFIER LES CONTRAINTES DE LA TABLE PRODUCTS
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_name = 'products'
AND tc.table_schema = 'public';

-- 4. VÉRIFIER QUE LA CLÉ ÉTRANGÈRE FONCTIONNE
-- Tester avec un produit existant
SELECT 
    id,
    title,
    slug
FROM public.products
LIMIT 5;

-- 5. VÉRIFIER LES DONNÉES DE TEST
-- Compter le nombre de produits
SELECT COUNT(*) as total_products FROM public.products;

-- 6. VÉRIFIER LES FAVORIS EXISTANTS
SELECT COUNT(*) as total_favorites FROM public.favorites;

-- 7. VÉRIFIER LES UTILISATEURS EXISTANTS
SELECT COUNT(*) as total_users FROM auth.users;

-- 8. VÉRIFIER LES PROFILS EXISTANTS
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- =====================================================
-- CORRECTION DE LA CONTRAINTE DE CLÉ ÉTRANGÈRE SI NÉCESSAIRE
-- =====================================================

-- Vérifier si la contrainte de clé étrangère existe
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'favorites'
AND tc.table_schema = 'public'
AND tc.constraint_type = 'FOREIGN KEY'
AND kcu.column_name = 'product_id';

-- Si la contrainte n'existe pas, la créer
-- ALTER TABLE public.favorites 
-- ADD CONSTRAINT favorites_product_id_fkey 
-- FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- =====================================================
-- TEST D'INSERTION COMPLET
-- =====================================================

-- Test d'insertion avec un utilisateur et un produit existants
-- (À décommenter et adapter avec des valeurs réelles)
/*
DO $$
DECLARE
    test_user_id UUID;
    test_product_id TEXT;
BEGIN
    -- Récupérer un utilisateur existant
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    -- Récupérer un produit existant
    SELECT id INTO test_product_id FROM public.products LIMIT 1;
    
    -- Tester l'insertion
    IF test_user_id IS NOT NULL AND test_product_id IS NOT NULL THEN
        INSERT INTO public.favorites (user_id, product_id)
        VALUES (test_user_id, test_product_id)
        ON CONFLICT (user_id, product_id) DO NOTHING;
        
        RAISE NOTICE 'Test d''insertion réussi pour user_id: %, product_id: %', test_user_id, test_product_id;
    ELSE
        RAISE NOTICE 'Impossible de tester: utilisateur ou produit manquant';
    END IF;
END $$;
*/
