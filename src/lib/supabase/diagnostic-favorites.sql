-- =====================================================
-- 🔍 DIAGNOSTIC FAVORITES - FOREIGN KEY
-- =====================================================
-- Script pour diagnostiquer le problème de foreign key

-- 1. Vérifier les produits existants
SELECT 'PRODUITS EXISTANTS:' as info;
SELECT id, title, slug FROM public.products ORDER BY id;

-- 2. Vérifier les favoris existants
SELECT 'FAVORIS EXISTANTS:' as info;
SELECT f.id, f.user_id, f.product_id, p.title as product_title
FROM public.favorites f
LEFT JOIN public.products p ON f.product_id = p.id
ORDER BY f.created_at DESC;

-- 3. Vérifier la contrainte de foreign key
SELECT 'CONTRAINTE FOREIGN KEY:' as info;
SELECT 
    tc.constraint_name,
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
    AND tc.table_name = 'favorites'
    AND tc.table_schema = 'public';

-- 4. Test d'insertion avec un produit existant
SELECT 'TEST D''INSERTION:' as info;
SELECT 'Produit test disponible:' as test, id, title 
FROM public.products 
WHERE id = 'prod-1' OR id = 'baril-racing-gulf'
LIMIT 1;

SELECT '✅ DIAGNOSTIC TERMINÉ!' as status;
