-- =====================================================
-- SUPPRESSION DE TOUTES LES POLITIQUES RLS
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Supprimer TOUTES les politiques RLS sur orders
DROP POLICY IF EXISTS "Authenticated users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow order creation" ON public.orders;

-- Supprimer TOUTES les politiques RLS sur order_items
DROP POLICY IF EXISTS "Authenticated users can create their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can update their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can insert all order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create their order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow order items creation" ON public.order_items;

-- Supprimer TOUTES les politiques RLS sur profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Supprimer TOUTES les politiques RLS sur products
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- Supprimer TOUTES les politiques RLS sur categories
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

-- Supprimer TOUTES les politiques RLS sur addresses
DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Admins can manage all addresses" ON public.addresses;

-- Supprimer TOUTES les politiques RLS sur favorites
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Admins can manage all favorites" ON public.favorites;

-- Supprimer TOUTES les politiques RLS sur carts
DROP POLICY IF EXISTS "Users can manage their own cart" ON public.carts;
DROP POLICY IF EXISTS "Admins can manage all carts" ON public.carts;

-- Supprimer TOUTES les politiques RLS sur stock_reservations
DROP POLICY IF EXISTS "Users can manage their own reservations" ON public.stock_reservations;
DROP POLICY IF EXISTS "Admins can manage all reservations" ON public.stock_reservations;

-- =====================================================
-- DÉSACTIVER RLS TEMPORAIREMENT
-- =====================================================

-- Désactiver RLS sur toutes les tables
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_reservations DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Vérifier qu'il n'y a plus de politiques RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Vérifier que RLS est désactivé
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
