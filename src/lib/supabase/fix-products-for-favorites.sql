-- =====================================================
-- VÉRIFICATION ET CORRECTION DES PRODUITS POUR LES FAVORIS
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- 1. VÉRIFIER LES PRODUITS EXISTANTS
SELECT 
    id,
    title,
    slug,
    price,
    stock_quantity
FROM public.products
ORDER BY id;

-- 2. VÉRIFIER QUE LES PRODUITS DE TEST EXISTENT
-- Les produits dans le code ont les IDs: "1", "2", "3"
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.products WHERE id = '1') THEN '✅ Produit 1 existe'
        ELSE '❌ Produit 1 manquant'
    END as produit_1,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.products WHERE id = '2') THEN '✅ Produit 2 existe'
        ELSE '❌ Produit 2 manquant'
    END as produit_2,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.products WHERE id = '3') THEN '✅ Produit 3 existe'
        ELSE '❌ Produit 3 manquant'
    END as produit_3;

-- 3. INSÉRER LES PRODUITS MANQUANTS SI NÉCESSAIRE
-- Produit 1: Baril Racing Gulf
INSERT INTO public.products (id, title, slug, price, image, description, categoryid, stock_quantity)
VALUES (
    '1',
    'Baril Racing Gulf',
    'baril-racing-gulf',
    149,
    '/barils/baril1.png',
    'Un baril au look inspiré des légendes de la course auto.',
    'racing',
    100
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    image = EXCLUDED.image,
    description = EXCLUDED.description,
    categoryid = EXCLUDED.categoryid,
    stock_quantity = EXCLUDED.stock_quantity;

-- Produit 2: Baril Militaire Cargo
INSERT INTO public.products (id, title, slug, price, image, description, categoryid, stock_quantity)
VALUES (
    '2',
    'Baril Militaire Cargo',
    'baril-militaire-cargo',
    129,
    '/barils/baril2.png',
    'Look kaki, brut, pour les amateurs de style commando.',
    'military',
    100
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    image = EXCLUDED.image,
    description = EXCLUDED.description,
    categoryid = EXCLUDED.categoryid,
    stock_quantity = EXCLUDED.stock_quantity;

-- Produit 3: Baril Vintage Oil
INSERT INTO public.products (id, title, slug, price, image, description, categoryid, stock_quantity)
VALUES (
    '3',
    'Baril Vintage Oil',
    'baril-vintage-oil',
    139,
    '/barils/baril3.png',
    'Baril industriel avec un charme rétro unique.',
    'vintage',
    100
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    image = EXCLUDED.image,
    description = EXCLUDED.description,
    categoryid = EXCLUDED.categoryid,
    stock_quantity = EXCLUDED.stock_quantity;

-- 4. VÉRIFIER LES CATÉGORIES EXISTANTES
SELECT 
    id,
    title,
    slug
FROM public.categories
ORDER BY id;

-- 5. INSÉRER LES CATÉGORIES MANQUANTES SI NÉCESSAIRE
INSERT INTO public.categories (id, title, slug, image, description)
VALUES 
    ('racing', 'Racing', 'racing', '/images/categories/racing.jpg', 'Collection inspirée de la course automobile'),
    ('military', 'Militaire', 'military', '/images/categories/military.jpg', 'Collection style militaire et commando'),
    ('vintage', 'Vintage', 'vintage', '/images/categories/vintage.jpg', 'Collection rétro et industrielle')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    image = EXCLUDED.image,
    description = EXCLUDED.description;

-- 6. VÉRIFICATION FINALE
SELECT 
    'Produits dans la base' as check_type,
    COUNT(*)::text as count
FROM public.products
UNION ALL
SELECT 
    'Catégories dans la base' as check_type,
    COUNT(*)::text as count
FROM public.categories
UNION ALL
SELECT 
    'Favoris dans la base' as check_type,
    COUNT(*)::text as count
FROM public.favorites;

-- 7. TEST D'INSERTION D'UN FAVORI (à décommenter et adapter)
/*
DO $$
DECLARE
    test_user_id UUID;
    test_product_id TEXT := '1';
    insert_result TEXT;
BEGIN
    -- Récupérer un utilisateur existant
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        BEGIN
            INSERT INTO public.favorites (user_id, product_id)
            VALUES (test_user_id, test_product_id)
            ON CONFLICT (user_id, product_id) DO NOTHING;
            
            insert_result := 'SUCCESS';
        EXCEPTION
            WHEN OTHERS THEN
                insert_result := 'ERROR: ' || SQLERRM;
        END;
        
        RAISE NOTICE 'Test insertion favori: %', insert_result;
        RAISE NOTICE 'User ID: %, Product ID: %', test_user_id, test_product_id;
    ELSE
        RAISE NOTICE 'Cannot test: no users found';
    END IF;
END $$;
*/
