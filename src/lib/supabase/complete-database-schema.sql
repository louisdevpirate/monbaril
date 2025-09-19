-- =====================================================
-- SCHEMA COMPLET DE LA BASE DE DONNÉES MONBARIL
-- =====================================================

-- 1. SUPPRIMER LES TABLES EXISTANTES (si elles existent)
DROP TABLE IF EXISTS public.stock_reservations CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.carts CASCADE;
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. CRÉER LA TABLE PROFILES (doit être créée en premier)
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text,
  birthdate date,
  created_at timestamp with time zone DEFAULT now(),
  role text DEFAULT 'user'::text CHECK (role = ANY (ARRAY['user'::text, 'admin'::text, 'moderator'::text])),
  is_active boolean DEFAULT true,
  last_login timestamp with time zone,
  avatar_url text,
  preferences jsonb DEFAULT '{}'::jsonb,
  subscription_tier text DEFAULT 'free'::text CHECK (subscription_tier = ANY (ARRAY['free'::text, 'premium'::text, 'enterprise'::text])),
  total_orders integer DEFAULT 0,
  total_spent numeric DEFAULT 0.00,
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT profiles_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 3. CRÉER LA TABLE CATEGORIES
CREATE TABLE public.categories (
  id text NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  image text NOT NULL,
  description text,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- 4. CRÉER LA TABLE PRODUCTS
CREATE TABLE public.products (
  id text NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  price integer NOT NULL,
  image text NOT NULL,
  description text,
  categoryid text,
  stock_quantity integer DEFAULT 0,
  min_stock_threshold integer DEFAULT 5,
  stock_reserved integer DEFAULT 0,
  stock_updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_categoryid_fkey FOREIGN KEY (categoryid) REFERENCES public.categories(id) ON DELETE SET NULL
);

-- 5. CRÉER LA TABLE ADDRESSES
CREATE TABLE public.addresses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type character varying NOT NULL DEFAULT 'delivery'::character varying CHECK (type::text = ANY (ARRAY['delivery'::character varying, 'billing'::character varying]::text[])),
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  company character varying,
  address_line_1 character varying NOT NULL,
  address_line_2 character varying,
  city character varying NOT NULL,
  postal_code character varying NOT NULL,
  country character varying NOT NULL DEFAULT 'France'::character varying,
  phone character varying,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT addresses_pkey PRIMARY KEY (id),
  CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 6. CRÉER LA TABLE CARTS
CREATE TABLE public.carts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id text NOT NULL,
  quantity integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT carts_pkey PRIMARY KEY (id),
  CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT carts_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- 7. CRÉER LA TABLE FAVORITES
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT favorites_pkey PRIMARY KEY (id),
  CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- 8. CRÉER LA TABLE ORDERS
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  total_price numeric NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'paid'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  order_id text,
  email text,
  invoice_url text,
  order_number text UNIQUE,
  stripe_session_id text NOT NULL,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 9. CRÉER LA TABLE ORDER_ITEMS
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  product_id text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  image text,
  product_name text NOT NULL,
  price numeric NOT NULL,
  user_id uuid NOT NULL,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT order_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 10. CRÉER LA TABLE STOCK_RESERVATIONS
CREATE TABLE public.stock_reservations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  user_id uuid NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  reservation_type text NOT NULL CHECK (reservation_type = ANY (ARRAY['cart'::text, 'order'::text, 'manual'::text])),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT stock_reservations_pkey PRIMARY KEY (id),
  CONSTRAINT stock_reservations_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(slug) ON DELETE CASCADE,
  CONSTRAINT stock_reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- =====================================================
-- INDEX POUR AMÉLIORER LES PERFORMANCES
-- =====================================================

-- Index pour profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- Index pour products
CREATE INDEX IF NOT EXISTS idx_products_categoryid ON public.products(categoryid);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock_quantity);

-- Index pour addresses
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_type ON public.addresses(type);
CREATE INDEX IF NOT EXISTS idx_addresses_is_default ON public.addresses(is_default);

-- Index pour carts
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_product_id ON public.carts(product_id);

-- Index pour favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON public.favorites(product_id);

-- Index pour orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

-- Index pour order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_user_id ON public.order_items(user_id);

-- Index pour stock_reservations
CREATE INDEX IF NOT EXISTS idx_stock_reservations_product_id ON public.stock_reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_user_id ON public.stock_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_expires_at ON public.stock_reservations(expires_at);

-- =====================================================
-- TRIGGERS POUR MISE À JOUR AUTOMATIQUE
-- =====================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON public.addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_favorites_updated_at
    BEFORE UPDATE ON public.favorites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_reservations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLITIQUES RLS POUR PROFILES
-- =====================================================

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;

-- Politiques pour les utilisateurs normaux
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- Politiques pour les admins
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete all profiles" ON public.profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR ADDRESSES
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can create their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;

CREATE POLICY "Users can view their own addresses" ON public.addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own addresses" ON public.addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" ON public.addresses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" ON public.addresses
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- POLITIQUES RLS POUR CARTS
-- =====================================================

DROP POLICY IF EXISTS "Users can manage their own cart" ON public.carts;

CREATE POLICY "Users can manage their own cart" ON public.carts
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- POLITIQUES RLS POUR FAVORITES
-- =====================================================

DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;

CREATE POLICY "Users can manage their own favorites" ON public.favorites
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- POLITIQUES RLS POUR ORDERS
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- POLITIQUES RLS POUR ORDER_ITEMS
-- =====================================================

DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create their order items" ON public.order_items;

CREATE POLICY "Users can view their order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE public.orders.id = public.order_items.order_id 
            AND public.orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE public.orders.id = public.order_items.order_id 
            AND public.orders.user_id = auth.uid()
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR STOCK_RESERVATIONS
-- =====================================================

DROP POLICY IF EXISTS "Users can manage their own stock reservations" ON public.stock_reservations;

CREATE POLICY "Users can manage their own stock reservations" ON public.stock_reservations
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Insérer des catégories de test
INSERT INTO public.categories (id, title, slug, image, description) VALUES
  ('cat-1', 'Barils Premium', 'barils-premium', '/barils/baril1.png', 'Nos barils les plus exclusifs'),
  ('cat-2', 'Barils Classiques', 'barils-classiques', '/barils/baril2.png', 'Barils traditionnels de qualité'),
  ('cat-3', 'Barils Économiques', 'barils-economiques', '/barils/baril3.png', 'Barils abordables sans compromis')
ON CONFLICT (id) DO NOTHING;

-- Insérer des produits de test
INSERT INTO public.products (id, title, slug, price, image, description, categoryid, stock_quantity) VALUES
  ('prod-1', 'Baril Premium Oak', 'baril-premium-oak', 29999, '/images/products/premium.jpg', 'Baril en chêne premium vieilli 12 mois', 'cat-1', 10),
  ('prod-2', 'Baril Classique', 'baril-classique', 19999, '/images/products/classic.jpg', 'Baril classique en chêne français', 'cat-2', 25),
  ('prod-3', 'Baril Économique', 'baril-economique', 9999, '/images/products/economy.jpg', 'Baril économique parfait pour débuter', 'cat-3', 50)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- COMMENTAIRES POUR LA DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.profiles IS 'Profils utilisateurs avec informations personnelles et préférences';
COMMENT ON TABLE public.categories IS 'Catégories de produits';
COMMENT ON TABLE public.products IS 'Produits disponibles à la vente';
COMMENT ON TABLE public.addresses IS 'Adresses de livraison et facturation des utilisateurs';
COMMENT ON TABLE public.carts IS 'Panier d''achat des utilisateurs';
COMMENT ON TABLE public.favorites IS 'Produits favoris des utilisateurs';
COMMENT ON TABLE public.orders IS 'Commandes des utilisateurs';
COMMENT ON TABLE public.order_items IS 'Articles des commandes';
COMMENT ON TABLE public.stock_reservations IS 'Réservations de stock temporaires';

-- =====================================================
-- FONCTIONS RPC POUR LA GESTION DU STOCK
-- =====================================================

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
-- FIN DU SCRIPT
-- =====================================================
