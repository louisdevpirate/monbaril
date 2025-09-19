-- =====================================================
-- POLITIQUES RLS POUR COMMANDES ANONYMES
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Authenticated users can manage their own orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can manage their own order items" ON public.order_items;

-- Créer des politiques qui permettent les commandes anonymes
-- Politique pour orders : permettre l'insertion même sans utilisateur authentifié
CREATE POLICY "Allow order creation" ON public.orders
  FOR INSERT
  WITH CHECK (true); -- Permettre toutes les insertions

-- Politique pour orders : permettre la lecture des commandes par utilisateur authentifié
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Politique pour order_items : permettre l'insertion même sans utilisateur authentifié
CREATE POLICY "Allow order items creation" ON public.order_items
  FOR INSERT
  WITH CHECK (true); -- Permettre toutes les insertions

-- Politique pour order_items : permettre la lecture des articles par utilisateur authentifié
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

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
