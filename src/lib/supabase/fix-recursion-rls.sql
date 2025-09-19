-- =====================================================
-- CORRECTION DES POLITIQUES RLS RÉCURSIVES
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Supprimer toutes les politiques existantes sur orders et order_items
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can insert all order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create their order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;

-- Créer des politiques simples sans récursion
-- Politique simple pour orders : tous les utilisateurs authentifiés peuvent créer/modifier leurs commandes
CREATE POLICY "Authenticated users can manage their own orders" ON public.orders
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique simple pour order_items : tous les utilisateurs authentifiés peuvent créer/modifier leurs articles
CREATE POLICY "Authenticated users can manage their own order items" ON public.order_items
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Vérifier que les nouvelles politiques ont été créées
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
