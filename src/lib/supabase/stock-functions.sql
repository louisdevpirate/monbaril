-- =====================================================
-- FONCTIONS DE GESTION DU STOCK
-- =====================================================
-- Script séparé pour éviter les conflits de syntaxe

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
    current_stock INTEGER;
    current_reserved INTEGER;
    available_stock INTEGER;
BEGIN
    -- Récupérer le stock actuel (chercher par slug si c'est un slug, sinon par id)
    SELECT stock_quantity, COALESCE(stock_reserved, 0)
    INTO current_stock, current_reserved
    FROM public.products
    WHERE id = p_product_id OR slug = p_product_id;
    
    -- Calculer le stock disponible
    available_stock := current_stock - current_reserved;
    
    -- Log pour debug
    RAISE NOTICE 'Product ID: %, Stock: %, Reserved: %, Available: %, Requested: %', 
        p_product_id, current_stock, current_reserved, available_stock, p_quantity;
    
    -- Vérifier si le produit existe
    IF current_stock IS NULL THEN
        RAISE NOTICE 'Product not found: %', p_product_id;
        RETURN FALSE;
    END IF;
    
    -- Vérifier si le stock est suffisant
    IF available_stock >= p_quantity THEN
        -- Mettre à jour le stock réservé
        UPDATE public.products
        SET stock_reserved = COALESCE(stock_reserved, 0) + p_quantity
        WHERE id = p_product_id OR slug = p_product_id;
        
        RAISE NOTICE 'Stock reserved successfully for product: %', p_product_id;
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Insufficient stock for product: %. Available: %, Requested: %', 
            p_product_id, available_stock, p_quantity;
        RETURN FALSE;
    END IF;
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
BEGIN
    -- Libérer le stock réservé
    UPDATE public.products
    SET stock_reserved = GREATEST(COALESCE(stock_reserved, 0) - p_quantity, 0)
    WHERE id = p_product_id OR slug = p_product_id;
    
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
    -- Diminuer le stock total et libérer le stock réservé
    UPDATE public.products
    SET stock_quantity = stock_quantity - p_quantity,
        stock_reserved = GREATEST(COALESCE(stock_reserved, 0) - p_quantity, 0)
    WHERE id = p_product_id OR slug = p_product_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
