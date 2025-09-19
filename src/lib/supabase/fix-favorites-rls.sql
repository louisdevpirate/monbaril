-- =====================================================
-- 🔧 CORRECTION RLS FAVORITES
-- =====================================================
-- Script pour corriger les politiques RLS des favoris

-- Supprimer la politique existante
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;

-- Créer les nouvelles politiques séparées
CREATE POLICY "Users can view own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all favorites" ON public.favorites
    FOR ALL USING (is_admin());

-- Vérifier que les politiques existent
SELECT 'Politiques RLS pour favorites:' as info;
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'favorites' 
AND schemaname = 'public'
ORDER BY policyname;

SELECT '✅ CORRECTION RLS FAVORITES TERMINÉE!' as status;