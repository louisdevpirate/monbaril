-- =====================================================
-- CORRECTION DE LA FONCTION confirm_order_stock
-- =====================================================

-- 1. SUPPRIMER L'ANCIENNE FONCTION
DROP FUNCTION IF EXISTS confirm_order_stock(TEXT, UUID, INTEGER);

-- 2. CRÉER UNE VERSION CORRIGÉE
CREATE OR REPLACE FUNCTION confirm_order_stock(
    p_product_id TEXT,
    p_user_id UUID,
    p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    current_stock INTEGER;
    current_reserved INTEGER;
BEGIN
    -- Récupérer le stock actuel
    SELECT stock_quantity, stock_reserved 
    INTO current_stock, current_reserved
    FROM products 
    WHERE slug = p_product_id;
    
    IF current_stock IS NULL THEN
        RAISE EXCEPTION 'Produit non trouvé: %', p_product_id;
    END IF;
    
    -- Libérer la réservation de commande (si elle existe)
    DELETE FROM stock_reservations 
    WHERE product_id = p_product_id 
      AND user_id = p_user_id 
      AND reservation_type = 'order';
    
    -- Réduire le stock réel
    UPDATE products 
    SET 
        stock_quantity = GREATEST(0, current_stock - p_quantity),
        stock_reserved = GREATEST(0, current_reserved - p_quantity),
        stock_updated_at = NOW()
    WHERE slug = p_product_id;
    
    -- Log pour debug
    RAISE NOTICE 'Stock mis à jour: produit=%, ancien_stock=%, nouvelle_quantité=%, stock_final=%', 
        p_product_id, current_stock, p_quantity, GREATEST(0, current_stock - p_quantity);
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erreur dans confirm_order_stock: %', SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. TESTER LA FONCTION
-- Remplace 'baril-militaire-cargo' par un slug de produit existant
-- Remplace l'UUID par un UUID valide d'utilisateur
SELECT confirm_order_stock(
    'baril-militaire-cargo',
    '00000000-0000-0000-0000-000000000000',
    1
);

-- 4. VÉRIFIER QUE LA FONCTION EXISTE
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'confirm_order_stock';
