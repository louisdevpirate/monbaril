-- =====================================================
-- CORRECTION DE LA TABLE PRODUCTS POUR L'ADMIN
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- 1. VÉRIFIER LA STRUCTURE ACTUELLE DE LA TABLE PRODUCTS
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. AJOUTER LES COLONNES MANQUANTES SI NÉCESSAIRE

-- Ajouter la colonne created_at si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'created_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN created_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Ajouter la colonne updated_at si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN updated_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Ajouter la colonne is_active si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'is_active'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_active boolean DEFAULT true;
    END IF;
END $$;

-- Ajouter la colonne is_featured si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'is_featured'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_featured boolean DEFAULT false;
    END IF;
END $$;

-- 3. CRÉER LE TRIGGER POUR METTRE À JOUR updated_at AUTOMATIQUEMENT
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer le trigger existant s'il existe
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;

-- Créer le trigger pour products
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_products_updated_at();

-- 4. VÉRIFIER LES POLITIQUES RLS POUR PRODUCTS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- 5. CRÉER DES POLITIQUES RLS POUR LES ADMINS SI NÉCESSAIRE
-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Politique : Les admins peuvent voir tous les produits
CREATE POLICY "Admins can view all products" ON public.products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Politique : Les admins peuvent créer des produits
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Politique : Les admins peuvent modifier des produits
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Politique : Les admins peuvent supprimer des produits
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 6. VÉRIFICATION FINALE
-- Vérifier que les colonnes ont été ajoutées
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier que les politiques ont été créées
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- 7. TEST D'INSERTION (à décommenter et adapter)
/*
DO $$
DECLARE
    test_user_id UUID;
    insert_result TEXT;
BEGIN
    -- Récupérer un utilisateur admin
    SELECT u.id INTO test_user_id 
    FROM auth.users u
    JOIN public.profiles p ON u.id = p.id
    WHERE p.role = 'admin'
    LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        BEGIN
            INSERT INTO public.products (
                id, title, slug, price, image, description, 
                categoryid, stock_quantity, min_stock_threshold,
                is_active, is_featured
            )
            VALUES (
                'test-product-' || extract(epoch from now())::text,
                'Produit Test Admin',
                'produit-test-admin',
                99,
                '/images/test.jpg',
                'Produit de test pour l\'admin',
                'racing',
                50,
                5,
                true,
                false
            );
            
            insert_result := 'SUCCESS';
        EXCEPTION
            WHEN OTHERS THEN
                insert_result := 'ERROR: ' || SQLERRM;
        END;
        
        RAISE NOTICE 'Test insertion produit admin: %', insert_result;
    ELSE
        RAISE NOTICE 'Cannot test: no admin user found';
    END IF;
END $$;
*/
