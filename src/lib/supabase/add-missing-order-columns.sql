-- =====================================================
-- AJOUT DES COLONNES MANQUANTES POUR LES COMMANDES
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Ajouter la colonne updated_at à la table orders si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN updated_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Ajouter la colonne product_slug à la table order_items si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'product_slug'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.order_items ADD COLUMN product_slug text;
    END IF;
END $$;

-- Créer le trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Supprimer le trigger existant s'il existe
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;

-- Créer le trigger pour orders
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Vérifier les colonnes ajoutées
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('orders', 'order_items')
AND table_schema = 'public'
ORDER BY table_name, ordinal_position;
