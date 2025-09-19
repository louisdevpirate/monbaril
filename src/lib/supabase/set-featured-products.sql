-- =====================================================
-- 🏆 MARQUER DES PRODUITS COMME FEATURED
-- =====================================================
-- Script pour marquer des produits comme best-sellers

-- Marquer quelques produits comme featured
UPDATE public.products 
SET is_featured = true 
WHERE id IN ('prod-1', 'prod-2', 'prod-racing-gulf');

-- Vérifier les produits featured
SELECT 'Produits marqués comme featured:' as info;
SELECT id, title, slug, price, is_featured 
FROM public.products 
WHERE is_featured = true
ORDER BY id;

-- Vérifier tous les produits actifs
SELECT 'Tous les produits actifs:' as info;
SELECT id, title, slug, price, is_featured, is_active
FROM public.products 
WHERE is_active = true
ORDER BY is_featured DESC, created_at DESC;

SELECT '✅ PRODUITS FEATURED MIS À JOUR!' as status;
