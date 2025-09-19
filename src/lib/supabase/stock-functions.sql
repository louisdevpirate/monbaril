-- =====================================================
-- FONCTIONS RPC POUR LA GESTION DU STOCK
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Supprimer les fonctions existantes si elles existent
DROP FUNCTION IF EXISTS cleanup_expired_reservations();
DROP FUNCTION IF EXISTS reserve_stock(text, uuid, integer, text, integer);
DROP FUNCTION IF EXISTS release_stock(text, uuid, integer, text);
DROP FUNCTION IF EXISTS confirm_order_stock(text, uuid, integer);

-- Fonction pour réserver du stock
CREATE OR REPLACE FUNCTION reserve_stock(
  p_product_id text,
  p_user_id uuid,
  p_quantity integer,
  p_reservation_type text DEFAULT 'cart',
  p_expires_in_hours integer DEFAULT 24
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_available_stock integer;
  v_expires_at timestamp with time zone;
BEGIN
  -- Calculer la date d'expiration
  v_expires_at := NOW() + (p_expires_in_hours || ' hours')::interval;
  
  -- Vérifier le stock disponible
  SELECT (stock_quantity - COALESCE(stock_reserved, 0))
  INTO v_available_stock
  FROM products
  WHERE slug = p_product_id;
  
  -- Vérifier si le stock est suffisant
  IF v_available_stock < p_quantity THEN
    RETURN false;
  END IF;
  
  -- Créer la réservation
  INSERT INTO stock_reservations (
    product_id,
    user_id,
    quantity,
    reservation_type,
    expires_at
  ) VALUES (
    p_product_id,
    p_user_id,
    p_quantity,
    p_reservation_type,
    v_expires_at
  );
  
  -- Mettre à jour le stock réservé
  UPDATE products
  SET stock_reserved = COALESCE(stock_reserved, 0) + p_quantity,
      stock_updated_at = NOW()
  WHERE slug = p_product_id;
  
  RETURN true;
END;
$$;

-- Fonction pour libérer du stock réservé
CREATE OR REPLACE FUNCTION release_stock(
  p_product_id text,
  p_user_id uuid,
  p_quantity integer,
  p_reservation_type text DEFAULT 'cart'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_released_quantity integer := 0;
BEGIN
  -- Supprimer les réservations expirées ou correspondantes
  DELETE FROM stock_reservations
  WHERE product_id = p_product_id
    AND user_id = p_user_id
    AND reservation_type = p_reservation_type
    AND expires_at > NOW()
  RETURNING quantity INTO v_released_quantity;
  
  -- Mettre à jour le stock réservé
  UPDATE products
  SET stock_reserved = GREATEST(0, COALESCE(stock_reserved, 0) - v_released_quantity),
      stock_updated_at = NOW()
  WHERE slug = p_product_id;
  
  RETURN v_released_quantity > 0;
END;
$$;

-- Fonction pour confirmer une commande (convertir réservation en vente)
CREATE OR REPLACE FUNCTION confirm_order_stock(
  p_product_id text,
  p_user_id uuid,
  p_quantity integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_reserved_quantity integer := 0;
BEGIN
  -- Supprimer les réservations de panier pour ce produit
  DELETE FROM stock_reservations
  WHERE product_id = p_product_id
    AND user_id = p_user_id
    AND reservation_type = 'cart'
    AND expires_at > NOW()
  RETURNING quantity INTO v_reserved_quantity;
  
  -- Mettre à jour le stock (réduire stock_quantity et stock_reserved)
  UPDATE products
  SET stock_quantity = GREATEST(0, stock_quantity - p_quantity),
      stock_reserved = GREATEST(0, COALESCE(stock_reserved, 0) - v_reserved_quantity),
      stock_updated_at = NOW()
  WHERE slug = p_product_id;
  
  RETURN true;
END;
$$;

-- Fonction pour nettoyer les réservations expirées
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cleaned_count integer := 0;
BEGIN
  -- Supprimer les réservations expirées
  DELETE FROM stock_reservations
  WHERE expires_at <= NOW();
  
  GET DIAGNOSTICS v_cleaned_count = ROW_COUNT;
  
  -- Recalculer le stock réservé pour tous les produits
  UPDATE products
  SET stock_reserved = (
    SELECT COALESCE(SUM(quantity), 0)
    FROM stock_reservations
    WHERE stock_reservations.product_id = products.slug
      AND stock_reservations.expires_at > NOW()
  ),
  stock_updated_at = NOW();
  
  RETURN v_cleaned_count;
END;
$$;

-- =====================================================
-- DONNÉES DE TEST POUR LES PRODUITS
-- =====================================================

-- Insérer des catégories de test
INSERT INTO public.categories (id, title, slug, image, description) VALUES
  ('cat-1', 'Barils Premium', 'barils-premium', '/barils/baril1.png', 'Nos barils les plus exclusifs'),
  ('cat-2', 'Barils Classiques', 'barils-classiques', '/barils/baril2.png', 'Barils traditionnels de qualité'),
  ('cat-3', 'Barils Économiques', 'barils-economiques', '/barils/baril3.png', 'Barils abordables sans compromis')
ON CONFLICT (id) DO NOTHING;

-- Insérer des produits de test avec du stock
INSERT INTO public.products (id, title, slug, price, image, description, categoryid, stock_quantity, min_stock_threshold) VALUES
  ('prod-1', 'Baril Premium Oak', 'baril-premium-oak', 29999, '/images/products/premium.jpg', 'Baril en chêne premium vieilli 12 mois', 'cat-1', 10, 2),
  ('prod-2', 'Baril Classique', 'baril-classique', 19999, '/images/products/classic.jpg', 'Baril classique en chêne français', 'cat-2', 25, 5),
  ('prod-3', 'Baril Économique', 'baril-economique', 9999, '/images/products/economy.jpg', 'Baril économique parfait pour débuter', 'cat-3', 50, 10)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
