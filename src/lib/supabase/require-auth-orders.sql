-- =====================================================
-- POLITIQUES RLS POUR UTILISATEURS AUTHENTIFIÉS UNIQUEMENT
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Allow order creation" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow order items creation" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;

-- Créer des politiques strictes qui exigent une authentification
-- Politique pour orders : seuls les utilisateurs authentifiés peuvent créer leurs commandes
CREATE POLICY "Authenticated users can create their own orders" ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Politique pour orders : seuls les utilisateurs authentifiés peuvent voir leurs commandes
CREATE POLICY "Authenticated users can view their own orders" ON public.orders
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Politique pour orders : seuls les utilisateurs authentifiés peuvent modifier leurs commandes
CREATE POLICY "Authenticated users can update their own orders" ON public.orders
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Politique pour order_items : seuls les utilisateurs authentifiés peuvent créer leurs articles
CREATE POLICY "Authenticated users can create their own order items" ON public.order_items
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Politique pour order_items : seuls les utilisateurs authentifiés peuvent voir leurs articles
CREATE POLICY "Authenticated users can view their own order items" ON public.order_items
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Politique pour order_items : seuls les utilisateurs authentifiés peuvent modifier leurs articles
CREATE POLICY "Authenticated users can update their own order items" ON public.order_items
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

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
