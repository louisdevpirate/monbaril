-- =====================================================
-- 🏪 SCHEMA ECOMMERCE COMPLET - MONBARIL APP
-- =====================================================
-- Schema unifié et cohérent pour une application eCommerce
-- RLS conventionnelles pour utilisateurs, admins, produits, etc.

-- =====================================================
-- 1. TABLES PRINCIPALES
-- =====================================================

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- Table des catégories
CREATE TABLE IF NOT EXISTS public.categories (
  id text NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  image text NOT NULL,
  description text,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- Ajouter les colonnes manquantes si elles n'existent pas
DO $$ 
BEGIN
    -- Ajouter is_active si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'categories' 
        AND column_name = 'is_active'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN is_active boolean DEFAULT true;
    END IF;

    -- Ajouter sort_order si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'categories' 
        AND column_name = 'sort_order'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN sort_order integer DEFAULT 0;
    END IF;

    -- Ajouter created_at si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'categories' 
        AND column_name = 'created_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN created_at timestamp with time zone DEFAULT now();
    END IF;

    -- Ajouter updated_at si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'categories' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN updated_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Table des produits
CREATE TABLE IF NOT EXISTS public.products (
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

-- Ajouter les colonnes manquantes si elles n'existent pas
DO $$ 
BEGIN
    -- Ajouter original_price si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'original_price'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN original_price integer;
    END IF;

    -- Ajouter is_active si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'is_active'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_active boolean DEFAULT true;
    END IF;

    -- Ajouter is_featured si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'is_featured'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_featured boolean DEFAULT false;
    END IF;

    -- Ajouter is_on_sale si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'is_on_sale'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_on_sale boolean DEFAULT false;
    END IF;

    -- Ajouter weight si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'weight'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN weight numeric;
    END IF;

    -- Ajouter dimensions si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'dimensions'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN dimensions jsonb;
    END IF;

    -- Ajouter tags si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'tags'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN tags text[];
    END IF;

    -- Ajouter seo_title si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'seo_title'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN seo_title text;
    END IF;

    -- Ajouter seo_description si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'seo_description'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN seo_description text;
    END IF;

    -- Ajouter created_at si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'created_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN created_at timestamp with time zone DEFAULT now();
    END IF;

    -- Ajouter updated_at si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN updated_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Table des adresses
CREATE TABLE IF NOT EXISTS public.addresses (
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

-- Table du panier
CREATE TABLE IF NOT EXISTS public.carts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id text NOT NULL,
  quantity integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT carts_pkey PRIMARY KEY (id),
  CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT carts_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  UNIQUE(user_id, product_id)
);

-- Table des favoris
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT favorites_pkey PRIMARY KEY (id),
  CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  UNIQUE(user_id, product_id)
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS public.orders (
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

-- Ajouter les colonnes manquantes si elles n'existent pas
DO $$ 
BEGIN
    -- Ajouter order_number si manquant (pour compatibilité)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'order_number'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN order_number text UNIQUE;
    END IF;

    -- Ajouter currency si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'currency'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN currency text DEFAULT 'EUR';
    END IF;

    -- Ajouter payment_intent_id si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_intent_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN payment_intent_id text;
    END IF;

    -- Ajouter payment_method si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_method'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN payment_method text;
    END IF;

    -- Ajouter shipping_address si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'shipping_address'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN shipping_address jsonb;
    END IF;

    -- Ajouter billing_address si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'billing_address'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN billing_address jsonb;
    END IF;

    -- Ajouter shipping_cost si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'shipping_cost'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN shipping_cost numeric DEFAULT 0;
    END IF;

    -- Ajouter tax_amount si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'tax_amount'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN tax_amount numeric DEFAULT 0;
    END IF;

    -- Ajouter discount_amount si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'discount_amount'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN discount_amount numeric DEFAULT 0;
    END IF;

    -- Ajouter notes si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'notes'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN notes text;
    END IF;

    -- Ajouter tracking_number si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'tracking_number'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN tracking_number text;
    END IF;

    -- Ajouter estimated_delivery si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'estimated_delivery'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN estimated_delivery date;
    END IF;

    -- Ajouter updated_at si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN updated_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Table des articles de commande
CREATE TABLE IF NOT EXISTS public.order_items (
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

-- Ajouter les colonnes manquantes si elles n'existent pas
DO $$ 
BEGIN
    -- Ajouter product_sku si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'product_sku'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.order_items ADD COLUMN product_sku text;
    END IF;

    -- Ajouter product_image si manquant (alias pour image)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'product_image'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.order_items ADD COLUMN product_image text;
    END IF;

    -- Ajouter created_at si manquant
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'created_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.order_items ADD COLUMN created_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Table des réservations de stock
CREATE TABLE IF NOT EXISTS public.stock_reservations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  user_id uuid NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  reservation_type text NOT NULL CHECK (reservation_type = ANY (ARRAY['cart'::text, 'order'::text, 'manual'::text])),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT stock_reservations_pkey PRIMARY KEY (id),
  CONSTRAINT stock_reservations_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT stock_reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(product_id, user_id, reservation_type)
);

-- Table des avis clients
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id text NOT NULL,
  order_id uuid,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  is_verified boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT reviews_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL,
  UNIQUE(user_id, product_id, order_id)
);

-- Table des coupons de réduction
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  discount_type text NOT NULL CHECK (discount_type = ANY (ARRAY['percentage'::text, 'fixed'::text])),
  discount_value numeric NOT NULL,
  minimum_amount numeric,
  maximum_discount numeric,
  usage_limit integer,
  used_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  valid_from timestamp with time zone DEFAULT now(),
  valid_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);

-- Table des utilisations de coupons
CREATE TABLE IF NOT EXISTS public.coupon_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL,
  user_id uuid NOT NULL,
  order_id uuid NOT NULL,
  discount_amount numeric NOT NULL,
  used_at timestamp with time zone DEFAULT now(),
  CONSTRAINT coupon_usage_pkey PRIMARY KEY (id),
  CONSTRAINT coupon_usage_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id) ON DELETE CASCADE,
  CONSTRAINT coupon_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT coupon_usage_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
  UNIQUE(coupon_id, user_id, order_id)
);

-- =====================================================
-- 2. INDEX POUR LES PERFORMANCES
-- =====================================================

-- Index pour profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- Index pour categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);

-- Index pour products
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_categoryid ON public.products(categoryid);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_on_sale ON public.products(is_on_sale);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

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
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);

-- Index pour order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Index pour stock_reservations
CREATE INDEX IF NOT EXISTS idx_stock_reservations_product_id ON public.stock_reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_user_id ON public.stock_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_expires_at ON public.stock_reservations(expires_at);

-- Index pour reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON public.reviews(is_approved);

-- Index pour coupons
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON public.coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_valid_from ON public.coupons(valid_from);
CREATE INDEX IF NOT EXISTS idx_coupons_valid_until ON public.coupons(valid_until);

-- =====================================================
-- 3. TRIGGERS POUR MISE À JOUR AUTOMATIQUE
-- =====================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer les triggers existants avant de les recréer
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
DROP TRIGGER IF EXISTS update_addresses_updated_at ON public.addresses;
DROP TRIGGER IF EXISTS update_carts_updated_at ON public.carts;
DROP TRIGGER IF EXISTS update_favorites_updated_at ON public.favorites;
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
DROP TRIGGER IF EXISTS update_coupons_updated_at ON public.coupons;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON public.addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at
    BEFORE UPDATE ON public.carts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_favorites_updated_at
    BEFORE UPDATE ON public.favorites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON public.coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) - CONVENTIONNELLES ECOMMERCE
-- =====================================================

-- Supprimer TOUTES les politiques existantes pour repartir à zéro
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    -- Supprimer toutes les politiques RLS existantes
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            policy_record.policyname, 
            policy_record.schemaname, 
            policy_record.tablename
        );
    END LOOP;
    
    RAISE NOTICE 'Toutes les politiques RLS existantes ont été supprimées';
END $$;

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLITIQUES RLS POUR PROFILES
-- =====================================================

-- Utilisateurs peuvent voir/modifier leur propre profil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins peuvent tout faire sur les profils
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete all profiles" ON public.profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR CATEGORIES
-- =====================================================

-- Tout le monde peut voir les catégories actives
CREATE POLICY "Anyone can view active categories" ON public.categories
    FOR SELECT USING (is_active = true);

-- Seuls les admins peuvent gérer les catégories
CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR PRODUCTS
-- =====================================================

-- Tout le monde peut voir les produits actifs
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (is_active = true);

-- Seuls les admins peuvent gérer les produits
CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR ADDRESSES
-- =====================================================

-- Utilisateurs peuvent gérer leurs propres adresses
CREATE POLICY "Users can manage own addresses" ON public.addresses
    FOR ALL USING (auth.uid() = user_id);

-- Admins peuvent gérer toutes les adresses
CREATE POLICY "Admins can manage all addresses" ON public.addresses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR CARTS
-- =====================================================

-- Utilisateurs peuvent gérer leur propre panier
CREATE POLICY "Users can manage own cart" ON public.carts
    FOR ALL USING (auth.uid() = user_id);

-- Admins peuvent gérer tous les paniers
CREATE POLICY "Admins can manage all carts" ON public.carts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR FAVORITES
-- =====================================================

-- Utilisateurs peuvent gérer leurs propres favoris
CREATE POLICY "Users can manage own favorites" ON public.favorites
    FOR ALL USING (auth.uid() = user_id);

-- Admins peuvent gérer tous les favoris
CREATE POLICY "Admins can manage all favorites" ON public.favorites
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR ORDERS
-- =====================================================

-- Utilisateurs peuvent voir leurs propres commandes
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins peuvent tout faire sur les commandes
CREATE POLICY "Admins can manage all orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR ORDER_ITEMS
-- =====================================================

-- Utilisateurs peuvent voir les items de leurs commandes
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_items.order_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_items.order_id 
            AND user_id = auth.uid()
        )
    );

-- Admins peuvent tout faire sur les order_items
CREATE POLICY "Admins can manage all order items" ON public.order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR STOCK_RESERVATIONS
-- =====================================================

-- Utilisateurs peuvent gérer leurs propres réservations
CREATE POLICY "Users can manage own stock reservations" ON public.stock_reservations
    FOR ALL USING (auth.uid() = user_id);

-- Admins peuvent gérer toutes les réservations
CREATE POLICY "Admins can manage all stock reservations" ON public.stock_reservations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR REVIEWS
-- =====================================================

-- Utilisateurs peuvent voir les avis approuvés
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = true);

-- Utilisateurs peuvent créer leurs propres avis
CREATE POLICY "Users can create own reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Utilisateurs peuvent modifier leurs propres avis
CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Utilisateurs peuvent supprimer leurs propres avis
CREATE POLICY "Users can delete own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Admins peuvent tout faire sur les avis
CREATE POLICY "Admins can manage all reviews" ON public.reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR COUPONS
-- =====================================================

-- Tout le monde peut voir les coupons actifs
CREATE POLICY "Anyone can view active coupons" ON public.coupons
    FOR SELECT USING (is_active = true AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until >= NOW()));

-- Seuls les admins peuvent gérer les coupons
CREATE POLICY "Admins can manage coupons" ON public.coupons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLITIQUES RLS POUR COUPON_USAGE
-- =====================================================

-- Utilisateurs peuvent voir leurs propres utilisations de coupons
CREATE POLICY "Users can view own coupon usage" ON public.coupon_usage
    FOR SELECT USING (auth.uid() = user_id);

-- Utilisateurs peuvent créer leurs propres utilisations de coupons
CREATE POLICY "Users can create own coupon usage" ON public.coupon_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins peuvent tout faire sur les utilisations de coupons
CREATE POLICY "Admins can manage all coupon usage" ON public.coupon_usage
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- 5. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si l'utilisateur est moderator ou admin
CREATE OR REPLACE FUNCTION is_moderator(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id 
        AND role IN ('moderator', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier la disponibilité d'un produit
CREATE OR REPLACE FUNCTION check_product_availability(
    p_product_id TEXT,
    p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    available_stock INTEGER;
BEGIN
    SELECT (stock_quantity - COALESCE(stock_reserved, 0))
    INTO available_stock
    FROM public.products
    WHERE id = p_product_id AND is_active = true;
    
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
    expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Calculer la date d'expiration
    expires_at := NOW() + (p_expires_in_hours || ' hours')::INTERVAL;
    
    -- Vérifier le stock disponible
    SELECT (stock_quantity - COALESCE(stock_reserved, 0))
    INTO available_stock
    FROM public.products
    WHERE id = p_product_id AND is_active = true;
    
    -- Vérifier si le stock est suffisant
    IF available_stock < p_quantity THEN
        RETURN false;
    END IF;
    
    -- Supprimer les réservations expirées pour ce produit/utilisateur
    DELETE FROM public.stock_reservations
    WHERE product_id = p_product_id
      AND user_id = p_user_id
      AND reservation_type = p_reservation_type
      AND expires_at <= NOW();
    
    -- Créer ou mettre à jour la réservation
    INSERT INTO public.stock_reservations (
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
        expires_at
    )
    ON CONFLICT (product_id, user_id, reservation_type)
    DO UPDATE SET
        quantity = EXCLUDED.quantity,
        expires_at = EXCLUDED.expires_at;
    
    -- Mettre à jour le stock réservé
    UPDATE public.products
    SET stock_reserved = (
        SELECT COALESCE(SUM(quantity), 0)
        FROM public.stock_reservations
        WHERE product_id = p_product_id
          AND expires_at > NOW()
    ),
    stock_updated_at = NOW()
    WHERE id = p_product_id;
    
    RETURN true;
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
    released_quantity INTEGER := 0;
BEGIN
    -- Supprimer les réservations correspondantes
    DELETE FROM public.stock_reservations
    WHERE product_id = p_product_id
      AND user_id = p_user_id
      AND reservation_type = p_reservation_type
      AND expires_at > NOW()
    RETURNING quantity INTO released_quantity;
    
    -- Mettre à jour le stock réservé
    UPDATE public.products
    SET stock_reserved = (
        SELECT COALESCE(SUM(quantity), 0)
        FROM public.stock_reservations
        WHERE product_id = p_product_id
          AND expires_at > NOW()
    ),
    stock_updated_at = NOW()
    WHERE id = p_product_id;
    
    RETURN released_quantity > 0;
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
    -- Libérer les réservations de panier pour ce produit
    PERFORM release_stock(p_product_id, p_user_id, p_quantity, 'cart');
    
    -- Réduire le stock réel
    UPDATE public.products
    SET stock_quantity = GREATEST(0, stock_quantity - p_quantity),
        stock_updated_at = NOW()
    WHERE id = p_product_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour nettoyer les réservations expirées
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS INTEGER AS $$
DECLARE
    cleaned_count INTEGER := 0;
BEGIN
    -- Supprimer les réservations expirées
    DELETE FROM public.stock_reservations
    WHERE expires_at <= NOW();
    
    GET DIAGNOSTICS cleaned_count = ROW_COUNT;
    
    -- Recalculer le stock réservé pour tous les produits
    UPDATE public.products
    SET stock_reserved = (
        SELECT COALESCE(SUM(quantity), 0)
        FROM public.stock_reservations
        WHERE stock_reservations.product_id = products.id
          AND stock_reservations.expires_at > NOW()
    ),
    stock_updated_at = NOW();
    
    RETURN cleaned_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Insérer des catégories de test (avec gestion des conflits sur slug)
-- IMPORTANT: Les catégories doivent être insérées AVANT les produits
-- Utilisation des colonnes existantes seulement
INSERT INTO public.categories (id, title, slug, image, description) VALUES
  ('racing', 'Barils Racing', 'barils-racing', '/images/categories/racing.jpg', 'Barils haute performance pour la course'),
  ('vintage', 'Barils Vintage', 'barils-vintage', '/images/categories/vintage.jpg', 'Barils vintage et collection'),
  ('custom', 'Barils Sur Mesure', 'barils-custom', '/images/categories/custom.jpg', 'Barils personnalisés selon vos goûts'),
  ('limited-edition', 'Éditions Limitées', 'editions-limitees', '/images/categories/limited.jpg', 'Barils en édition limitée'),
  ('premium', 'Barils Premium', 'barils-premium', '/images/categories/premium.jpg', 'Nos barils les plus exclusifs')
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    image = EXCLUDED.image,
    description = EXCLUDED.description;

-- Vérifier que les catégories existent avant d'insérer les produits
DO $$
BEGIN
    -- Vérifier que toutes les catégories nécessaires existent
    IF NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'racing') THEN
        RAISE EXCEPTION 'Catégorie "racing" manquante';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'vintage') THEN
        RAISE EXCEPTION 'Catégorie "vintage" manquante';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'custom') THEN
        RAISE EXCEPTION 'Catégorie "custom" manquante';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'limited-edition') THEN
        RAISE EXCEPTION 'Catégorie "limited-edition" manquante';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'premium') THEN
        RAISE EXCEPTION 'Catégorie "premium" manquante';
    END IF;
    
    RAISE NOTICE 'Toutes les catégories nécessaires existent';
END $$;

-- Insérer des produits de test (avec gestion des conflits sur slug)
-- Utilisation des colonnes existantes seulement
INSERT INTO public.products (id, title, slug, price, image, description, categoryid, stock_quantity, min_stock_threshold, stock_reserved) VALUES
  ('baril-racing-gulf', 'Baril Racing Gulf', 'baril-racing-gulf', 24999, '/images/products/baril-racing-gulf.jpg', 'Baril Racing Gulf - Édition limitée', 'racing', 12, 3, 0),
  ('baril-vintage-oak', 'Baril Vintage Oak', 'baril-vintage-oak', 18999, '/images/products/baril-vintage-oak.jpg', 'Baril vintage en chêne français', 'vintage', 25, 5, 0),
  ('baril-custom-premium', 'Baril Custom Premium', 'baril-custom-premium', 34999, '/images/products/baril-custom-premium.jpg', 'Baril sur mesure premium', 'custom', 8, 2, 0),
  ('baril-limited-edition', 'Baril Limited Edition', 'baril-limited-edition', 49999, '/images/products/baril-limited-edition.jpg', 'Baril en édition limitée', 'limited-edition', 5, 1, 0),
  ('baril-premium-oak', 'Baril Premium Oak', 'baril-premium-oak', 29999, '/images/products/baril-premium-oak.jpg', 'Baril premium en chêne vieilli', 'premium', 15, 3, 0)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    price = EXCLUDED.price,
    image = EXCLUDED.image,
    description = EXCLUDED.description,
    categoryid = EXCLUDED.categoryid,
    stock_quantity = EXCLUDED.stock_quantity,
    min_stock_threshold = EXCLUDED.min_stock_threshold,
    stock_reserved = EXCLUDED.stock_reserved;

-- Insérer des coupons de test (avec gestion des conflits sur code)
INSERT INTO public.coupons (id, code, name, description, discount_type, discount_value, minimum_amount, usage_limit, is_active, valid_until) VALUES
  ('welcome-10', 'WELCOME10', 'Bienvenue -10%', 'Réduction de bienvenue de 10%', 'percentage', 10, 5000, 100, true, NOW() + INTERVAL '1 year'),
  ('premium-50', 'PREMIUM50', 'Premium -50€', 'Réduction de 50€ sur les produits premium', 'fixed', 5000, 20000, 50, true, NOW() + INTERVAL '6 months'),
  ('racing-15', 'RACING15', 'Racing -15%', 'Réduction de 15% sur les produits racing', 'percentage', 15, 10000, 200, true, NOW() + INTERVAL '3 months')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    discount_type = EXCLUDED.discount_type,
    discount_value = EXCLUDED.discount_value,
    minimum_amount = EXCLUDED.minimum_amount,
    usage_limit = EXCLUDED.usage_limit,
    is_active = EXCLUDED.is_active,
    valid_until = EXCLUDED.valid_until;

-- =====================================================
-- 7. COMMENTAIRES POUR LA DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.profiles IS 'Profils utilisateurs avec informations personnelles et préférences';
COMMENT ON TABLE public.categories IS 'Catégories de produits avec gestion de l''ordre d''affichage';
COMMENT ON TABLE public.products IS 'Produits disponibles à la vente avec gestion complète du stock';
COMMENT ON TABLE public.addresses IS 'Adresses de livraison et facturation des utilisateurs';
COMMENT ON TABLE public.carts IS 'Panier d''achat des utilisateurs avec contrainte d''unicité';
COMMENT ON TABLE public.favorites IS 'Produits favoris des utilisateurs avec contrainte d''unicité';
COMMENT ON TABLE public.orders IS 'Commandes des utilisateurs avec gestion complète du statut';
COMMENT ON TABLE public.order_items IS 'Articles des commandes avec informations produit';
COMMENT ON TABLE public.stock_reservations IS 'Réservations de stock temporaires pour panier et commandes';
COMMENT ON TABLE public.reviews IS 'Avis clients avec système de modération';
COMMENT ON TABLE public.coupons IS 'Coupons de réduction avec gestion des limites et validité';
COMMENT ON TABLE public.coupon_usage IS 'Utilisation des coupons par les utilisateurs';

-- =====================================================
-- FIN DU SCHEMA ECOMMERCE COMPLET
-- =====================================================
