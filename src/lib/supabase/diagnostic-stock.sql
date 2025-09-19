-- =====================================================
-- SCRIPT DE DIAGNOSTIC POUR LE STOCK
-- À exécuter dans Supabase SQL Editor pour diagnostiquer
-- =====================================================

-- 1. Vérifier si les fonctions RPC existent
SELECT 
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('reserve_stock', 'release_stock', 'confirm_order_stock', 'cleanup_expired_reservations');

-- 2. Vérifier les produits existants
SELECT 
  id,
  title,
  slug,
  stock_quantity,
  stock_reserved,
  min_stock_threshold
FROM products
ORDER BY id;

-- 3. Vérifier les catégories
SELECT 
  id,
  title,
  slug
FROM categories
ORDER BY id;

-- 4. Vérifier les politiques RLS sur products
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'products';

-- 5. Tester la fonction checkAvailability manuellement
-- Remplacez 'baril-premium-oak' par un slug existant
SELECT 
  stock_quantity,
  stock_reserved,
  min_stock_threshold,
  (stock_quantity - COALESCE(stock_reserved, 0)) as available
FROM products
WHERE slug = 'baril-premium-oak';

-- 6. Vérifier les réservations de stock
SELECT 
  sr.id,
  sr.product_id,
  sr.user_id,
  sr.quantity,
  sr.reservation_type,
  sr.expires_at,
  sr.created_at
FROM stock_reservations sr
ORDER BY sr.created_at DESC
LIMIT 10;
