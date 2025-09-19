-- =====================================================
-- AJOUT DU PRODUIT MANQUANT
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Ajouter le produit baril-racing-gulf qui manque
INSERT INTO public.products (
  id, 
  title, 
  slug, 
  price, 
  image, 
  description, 
  categoryid, 
  stock_quantity, 
  min_stock_threshold
) VALUES (
  'prod-racing-gulf',
  'Baril Racing Gulf',
  'baril-racing-gulf',
  24999,
  '/images/products/racing-gulf.jpg',
  'Baril Racing Gulf - Édition limitée',
  'cat-1',
  15,
  3
) ON CONFLICT (slug) DO UPDATE SET
  stock_quantity = EXCLUDED.stock_quantity,
  min_stock_threshold = EXCLUDED.min_stock_threshold;

-- Vérifier que le produit a été ajouté
SELECT 
  id,
  title,
  slug,
  stock_quantity,
  stock_reserved,
  min_stock_threshold
FROM products
WHERE slug = 'baril-racing-gulf';
