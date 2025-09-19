-- =====================================================
-- DIAGNOSTIC ET CORRECTION DES FAVORIS
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- 1. VÉRIFIER L'EXISTENCE DE LA TABLE
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'favorites'
AND table_schema = 'public';

-- 2. VÉRIFIER LA STRUCTURE DE LA TABLE
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'favorites'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. VÉRIFIER LES CONTRAINTES
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'favorites'
AND tc.table_schema = 'public';

-- 4. VÉRIFIER LES POLITIQUES RLS
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
WHERE tablename = 'favorites'
ORDER BY policyname;

-- 5. VÉRIFIER QUE RLS EST ACTIVÉ
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'favorites'
AND schemaname = 'public';

-- 6. VÉRIFIER LES INDEX
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'favorites'
AND schemaname = 'public';

-- =====================================================
-- CORRECTION DES POLITIQUES RLS
-- =====================================================

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can update their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;

-- Créer des politiques RLS correctes
CREATE POLICY "Users can view their own favorites" ON public.favorites
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON public.favorites
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.favorites
    FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites" ON public.favorites
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- VÉRIFIER LA CONTRAINTE D'UNICITÉ
-- =====================================================

-- Vérifier s'il y a des doublons
SELECT 
    user_id,
    product_id,
    COUNT(*) as count
FROM public.favorites
GROUP BY user_id, product_id
HAVING COUNT(*) > 1;

-- =====================================================
-- TEST D'INSERTION (remplacer 'test-user-id' et 'test-product-id' par des valeurs réelles)
-- =====================================================

-- Test d'insertion (à décommenter et adapter)
-- INSERT INTO public.favorites (user_id, product_id)
-- VALUES ('test-user-id', 'test-product-id')
-- ON CONFLICT (user_id, product_id) DO NOTHING;

-- =====================================================
-- VÉRIFICATION FINALE
-- =====================================================

-- Vérifier que les politiques ont été créées
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'favorites'
ORDER BY policyname;
