-- =====================================================
-- GESTION DES STOCKS - MONBARIL APP
-- =====================================================

-- 1. AJOUTER LE CHAMP STOCK À LA TABLE PRODUCTS
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_stock_threshold INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS stock_reserved INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS stock_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. METTRE À JOUR LES PRODUITS EXISTANTS AVEC UN STOCK PAR DÉFAUT
UPDATE products 
SET stock_quantity = 100, 
    min_stock_threshold = 10,
    stock_updated_at = NOW()
WHERE stock_quantity IS NULL;

-- 3. CRÉER UNE TABLE DE RÉSERVATIONS DE STOCK
CREATE TABLE IF NOT EXISTS stock_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(slug) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    reservation_type TEXT NOT NULL CHECK (reservation_type IN ('cart', 'order', 'manual')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte d'unicité : un utilisateur ne peut avoir qu'une réservation active par produit
    UNIQUE(product_id, user_id, reservation_type)
);

-- 4. ACTIVER RLS SUR STOCK_RESERVATIONS
ALTER TABLE stock_reservations ENABLE ROW LEVEL SECURITY;

-- 5. POLITIQUES RLS POUR STOCK_RESERVATIONS
CREATE POLICY "Users can view their own reservations" ON stock_reservations
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reservations" ON stock_reservations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations" ON stock_resERVATIONS
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reservations" ON stock_reservations
    FOR DELETE
    USING (auth.uid() = user_id);

-- 6. INDEXES POUR OPTIMISER LES PERFORMANCES
CREATE INDEX IF NOT EXISTS idx_stock_reservations_product ON stock_reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_user ON stock_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_expires ON stock_reservations(expires_at);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity, min_stock_threshold);

-- 7. FONCTIONS UTILITAIRES POUR LA GESTION DES STOCKS

-- Fonction pour vérifier la disponibilité d'un produit
CREATE OR REPLACE FUNCTION check_product_availability(
    p_product_id TEXT,
    p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    available_stock INTEGER;
BEGIN
    SELECT (stock_quantity - stock_reserved) INTO available_stock
    FROM products 
    WHERE slug = p_product_id;
    
    RETURN COALESCE(available_stock, 0) >= p_quantity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour réserver du stock
CREATE OR REPLACE FUNCTION reserve_stock(
    p_product_id TEXT,
    p_user_id UUID,
    p_quantity INTEGER,
    p_reservation_type TEXT DEFAULT 'cart',
    p_expires_in_hours INTEGER DEFAULT 24
)
RETURNS BOOLEAN AS $$
DECLARE
    available_stock INTEGER;
    current_reservation INTEGER;
BEGIN
    -- Vérifier le stock disponible
    SELECT (stock_quantity - stock_reserved) INTO available_stock
    FROM products 
    WHERE slug = p_product_id;
    
    IF available_stock < p_quantity THEN
        RETURN FALSE;
    END IF;
    
    -- Vérifier s'il y a déjà une réservation
    SELECT quantity INTO current_reservation
    FROM stock_reservations
    WHERE product_id = p_product_id 
      AND user_id = p_user_id 
      AND reservation_type = p_reservation_type
      AND expires_at > NOW();
    
    -- Mettre à jour ou créer la réservation
    IF current_reservation IS NOT NULL THEN
        UPDATE stock_reservations 
        SET quantity = p_quantity, 
            expires_at = NOW() + (p_expires_in_hours || ' hours')::INTERVAL
        WHERE product_id = p_product_id 
          AND user_id = p_user_id 
          AND reservation_type = p_reservation_type;
    ELSE
        INSERT INTO stock_reservations (product_id, user_id, quantity, reservation_type, expires_at)
        VALUES (p_product_id, p_user_id, p_quantity, p_reservation_type, 
                NOW() + (p_expires_in_hours || ' hours')::INTERVAL);
    END IF;
    
    -- Mettre à jour le stock réservé
    UPDATE products 
    SET stock_reserved = stock_reserved + p_quantity,
        stock_updated_at = NOW()
    WHERE slug = p_product_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour libérer du stock réservé
CREATE OR REPLACE FUNCTION release_stock(
    p_product_id TEXT,
    p_user_id UUID,
    p_quantity INTEGER,
    p_reservation_type TEXT DEFAULT 'cart'
)
RETURNS BOOLEAN AS $$
DECLARE
    current_reservation INTEGER;
BEGIN
    -- Récupérer la quantité réservée actuelle
    SELECT quantity INTO current_reservation
    FROM stock_reservations
    WHERE product_id = p_product_id 
      AND user_id = p_user_id 
      AND reservation_type = p_reservation_type
      AND expires_at > NOW();
    
    IF current_reservation IS NULL OR current_reservation < p_quantity THEN
        RETURN FALSE;
    END IF;
    
    -- Mettre à jour ou supprimer la réservation
    IF current_reservation = p_quantity THEN
        DELETE FROM stock_reservations
        WHERE product_id = p_product_id 
          AND user_id = p_user_id 
          AND reservation_type = p_reservation_type;
    ELSE
        UPDATE stock_reservations 
        SET quantity = current_reservation - p_quantity
        WHERE product_id = p_product_id 
          AND user_id = p_user_id 
          AND reservation_type = p_reservation_type;
    END IF;
    
    -- Mettre à jour le stock réservé
    UPDATE products 
    SET stock_reserved = GREATEST(0, stock_reserved - p_quantity),
        stock_updated_at = NOW()
    WHERE slug = p_product_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour confirmer une commande (convertir réservation en vente)
CREATE OR REPLACE FUNCTION confirm_order_stock(
    p_product_id TEXT,
    p_user_id UUID,
    p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Libérer la réservation de commande
    PERFORM release_stock(p_product_id, p_user_id, p_quantity, 'order');
    
    -- Réduire le stock réel
    UPDATE products 
    SET stock_quantity = GREATEST(0, stock_quantity - p_quantity),
        stock_updated_at = NOW()
    WHERE slug = p_product_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. TRIGGER POUR NETTOYER LES RÉSERVATIONS EXPIRÉES
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS TRIGGER AS $$
BEGIN
    -- Supprimer les réservations expirées
    DELETE FROM stock_reservations WHERE expires_at < NOW();
    
    -- Mettre à jour le stock réservé total
    UPDATE products 
    SET stock_reserved = (
        SELECT COALESCE(SUM(quantity), 0)
        FROM stock_reservations 
        WHERE product_id = products.slug 
          AND expires_at > NOW()
    ),
    stock_updated_at = NOW();
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger (s'exécute toutes les heures)
CREATE TRIGGER trigger_cleanup_expired_reservations
    AFTER INSERT OR UPDATE OR DELETE ON stock_reservations
    FOR EACH STATEMENT
    EXECUTE FUNCTION cleanup_expired_reservations();

-- 9. VÉRIFICATIONS FINALES
SELECT '✅ Stock management setup complete!' as status;

-- Vérifier la structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name IN ('stock_quantity', 'min_stock_threshold', 'stock_reserved', 'stock_updated_at')
ORDER BY ordinal_position;

-- Vérifier les fonctions
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%stock%';
