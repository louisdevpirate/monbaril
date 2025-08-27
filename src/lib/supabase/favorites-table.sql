-- =====================================================
-- TABLE FAVORITES ET POLITIQUES RLS
-- =====================================================

-- 1. CRÉER LA TABLE FAVORITES
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte d'unicité : un utilisateur ne peut pas avoir le même produit en favori plusieurs fois
    UNIQUE(user_id, product_id)
);

-- 2. ACTIVER RLS SUR LA TABLE FAVORITES
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 3. POLITIQUES RLS POUR LES FAVORIS

-- Les utilisateurs peuvent voir leurs propres favoris
CREATE POLICY "Users can view their own favorites" ON favorites
    FOR SELECT
    USING (auth.uid() = user_id);

-- Les utilisateurs peuvent ajouter leurs propres favoris
CREATE POLICY "Users can insert their own favorites" ON favorites
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres favoris
CREATE POLICY "Users can delete their own favorites" ON favorites
    FOR DELETE
    USING (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs propres favoris (mise à jour du timestamp)
CREATE POLICY "Users can update their own favorites" ON favorites
    FOR UPDATE
    USING (auth.uid() = user_id);

-- 4. INDEXES POUR OPTIMISER LES PERFORMANCES
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_product ON favorites(user_id, product_id);

-- 5. TRIGGER POUR METTRE À JOUR LE TIMESTAMP
CREATE OR REPLACE FUNCTION update_favorites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_favorites_updated_at
    BEFORE UPDATE ON favorites
    FOR EACH ROW
    EXECUTE FUNCTION update_favorites_updated_at();

-- 6. VÉRIFICATIONS
-- Vérifier que la table existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'favorites'
);

-- Vérifier que RLS est activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'favorites';

-- Lister toutes les politiques
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'favorites';
