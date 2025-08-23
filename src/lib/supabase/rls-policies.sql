-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR PROFILES TABLE
-- =====================================================

-- 1. ACTIVER RLS SUR LA TABLE PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. POLITIQUE POUR LES UTILISATEURS NORMAUX (SELECT)
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- 3. POLITIQUE POUR LES UTILISATEURS NORMAUX (UPDATE)
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- 4. POLITIQUE POUR LES MODERATEURS (SELECT)
CREATE POLICY "Moderators can view all profiles" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('moderator', 'admin')
        )
    );

-- 5. POLITIQUE POUR LES MODERATEURS (UPDATE)
CREATE POLICY "Moderators can update all profiles" ON profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('moderator', 'admin')
        )
    );

-- 6. POLITIQUE POUR LES ADMINS (SELECT)
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 7. POLITIQUE POUR LES ADMINS (UPDATE)
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 8. POLITIQUE POUR LES ADMINS (DELETE)
CREATE POLICY "Admins can delete profiles" ON profiles
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 9. POLITIQUE POUR L'INSERTION (création de profil)
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 10. POLITIQUE POUR LES ADMINS (INSERT)
CREATE POLICY "Admins can insert any profile" ON profiles
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- INDEXES POUR OPTIMISER LES PERFORMANCES
-- =====================================================

-- Index sur role pour les vérifications rapides
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Index sur is_active pour filtrer les utilisateurs actifs
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- Index composite sur role + is_active
CREATE INDEX IF NOT EXISTS idx_profiles_role_active ON profiles(role, is_active);

-- =====================================================
-- FONCTIONS UTILITAIRES POUR LA SÉCURITÉ
-- =====================================================

-- Fonction pour vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si l'utilisateur est moderator
CREATE OR REPLACE FUNCTION is_moderator(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id 
        AND role IN ('moderator', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VÉRIFICATIONS DE SÉCURITÉ
-- =====================================================

-- Vérifier que RLS est activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Lister toutes les politiques
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles'; 