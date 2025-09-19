-- Ajouter des colonnes pour améliorer l'affichage des produits
-- Ce script ajoute les fonctionnalités nécessaires pour la nouvelle page produit

-- Ajouter les colonnes manquantes à la table products
DO $$ 
BEGIN
    -- Ajouter original_price si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'original_price') THEN
        ALTER TABLE public.products ADD COLUMN original_price integer;
    END IF;

    -- Ajouter is_on_sale si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'is_on_sale') THEN
        ALTER TABLE public.products ADD COLUMN is_on_sale boolean DEFAULT false;
    END IF;

    -- Ajouter is_featured si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'is_featured') THEN
        ALTER TABLE public.products ADD COLUMN is_featured boolean DEFAULT false;
    END IF;

    -- Ajouter is_active si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'is_active') THEN
        ALTER TABLE public.products ADD COLUMN is_active boolean DEFAULT true;
    END IF;

    -- Ajouter created_at si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'created_at') THEN
        ALTER TABLE public.products ADD COLUMN created_at timestamp with time zone DEFAULT now();
    END IF;

    -- Ajouter updated_at si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'updated_at') THEN
        ALTER TABLE public.products ADD COLUMN updated_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Ajouter les colonnes manquantes à la table categories
DO $$ 
BEGIN
    -- Ajouter is_active si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'is_active') THEN
        ALTER TABLE public.categories ADD COLUMN is_active boolean DEFAULT true;
    END IF;
END $$;

-- Créer les triggers pour updated_at si ils n'existent pas
DO $$ 
BEGIN
    -- Trigger pour products
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_products_updated_at') THEN
        CREATE TRIGGER update_products_updated_at
            BEFORE UPDATE ON public.products
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Mettre à jour quelques produits pour tester les nouvelles fonctionnalités
UPDATE public.products 
SET 
    is_featured = true,
    is_on_sale = true,
    original_price = price + 2000, -- Ajouter 20€ au prix original
    is_active = true
WHERE id IN ('baril-racing-gulf', 'baril-vintage-oak', 'baril-custom-premium');

-- Vérifier les produits mis à jour
SELECT 
    id, 
    title, 
    price, 
    original_price, 
    is_featured, 
    is_on_sale, 
    is_active,
    CASE 
        WHEN original_price IS NOT NULL 
        THEN ROUND(((original_price - price)::numeric / original_price::numeric) * 100)
        ELSE 0 
    END as discount_percentage
FROM public.products 
WHERE is_featured = true OR is_on_sale = true;
