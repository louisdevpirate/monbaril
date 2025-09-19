-- =====================================================
-- 🎯 SCHEMA ECOMMERCE COMPLET ET PROPRE
-- =====================================================
-- UN SEUL FICHIER avec RLS, fonctions, et données de test
-- Compatible avec votre schéma existant

-- =====================================================
-- 1. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si l'utilisateur est modérateur
CREATE OR REPLACE FUNCTION is_moderator()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
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
    SELECT stock_quantity - COALESCE(stock_reserved, 0)
    INTO available_stock
    FROM public.products
    WHERE id = p_product_id;
    
    RETURN COALESCE(available_stock, 0) >= p_quantity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. AJOUT DES COLONNES MANQUANTES (SI NÉCESSAIRES)
-- =====================================================

-- Ajouter les colonnes manquantes aux catégories
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'categories'
        AND column_name = 'is_active'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN is_active boolean DEFAULT true;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'categories'
        AND column_name = 'sort_order'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN sort_order integer DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'categories'
        AND column_name = 'created_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN created_at timestamp with time zone DEFAULT now();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'categories'
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN updated_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Ajouter les colonnes manquantes aux produits
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products'
        AND column_name = 'original_price'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN original_price integer;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products'
        AND column_name = 'is_active'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_active boolean DEFAULT true;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products'
        AND column_name = 'is_featured'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_featured boolean DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products'
        AND column_name = 'is_on_sale'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_on_sale boolean DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products'
        AND column_name = 'created_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN created_at timestamp with time zone DEFAULT now();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products'
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN updated_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Ajouter les colonnes manquantes aux profils
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles'
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN updated_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- =====================================================
-- 3. TRIGGERS POUR UPDATED_AT
-- =====================================================

-- Supprimer les triggers existants avant de les recréer
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;

-- Créer les triggers
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

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Supprimer TOUTES les politiques existantes pour repartir à zéro
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
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

-- =====================================================
-- 5. POLITIQUES RLS POUR PROFILES
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
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete all profiles" ON public.profiles
    FOR DELETE USING (is_admin());

-- =====================================================
-- 6. POLITIQUES RLS POUR CATEGORIES
-- =====================================================

-- Tout le monde peut voir les catégories actives
CREATE POLICY "Anyone can view active categories" ON public.categories
    FOR SELECT USING (is_active = true);

-- Seuls les admins peuvent gérer les catégories
CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (is_admin());

-- =====================================================
-- 7. POLITIQUES RLS POUR PRODUCTS
-- =====================================================

-- Tout le monde peut voir les produits actifs
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (is_active = true);

-- Seuls les admins peuvent gérer les produits
CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL USING (is_admin());

-- =====================================================
-- 8. POLITIQUES RLS POUR ADDRESSES
-- =====================================================

-- Utilisateurs peuvent gérer leurs propres adresses
CREATE POLICY "Users can manage own addresses" ON public.addresses
    FOR ALL USING (auth.uid() = user_id);

-- Admins peuvent voir toutes les adresses
CREATE POLICY "Admins can view all addresses" ON public.addresses
    FOR SELECT USING (is_admin());

-- =====================================================
-- 9. POLITIQUES RLS POUR CARTS
-- =====================================================

-- Utilisateurs peuvent gérer leur propre panier
CREATE POLICY "Users can manage own cart" ON public.carts
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 10. POLITIQUES RLS POUR FAVORITES
-- =====================================================

-- Utilisateurs peuvent voir leurs propres favoris
CREATE POLICY "Users can view own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

-- Utilisateurs peuvent insérer leurs propres favoris
CREATE POLICY "Users can insert own favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Utilisateurs peuvent supprimer leurs propres favoris
CREATE POLICY "Users can delete own favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Admins peuvent tout faire sur les favoris
CREATE POLICY "Admins can manage all favorites" ON public.favorites
    FOR ALL USING (is_admin());

-- =====================================================
-- 11. POLITIQUES RLS POUR ORDERS
-- =====================================================

-- Utilisateurs peuvent voir leurs propres commandes
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

-- Utilisateurs peuvent créer leurs propres commandes
CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins peuvent tout faire sur les commandes
CREATE POLICY "Admins can manage all orders" ON public.orders
    FOR ALL USING (is_admin());

-- =====================================================
-- 12. POLITIQUES RLS POUR ORDER_ITEMS
-- =====================================================

-- Utilisateurs peuvent voir les articles de leurs commandes
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (auth.uid() = user_id);

-- Utilisateurs peuvent créer des articles pour leurs commandes
CREATE POLICY "Users can create own order items" ON public.order_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins peuvent tout faire sur les articles de commande
CREATE POLICY "Admins can manage all order items" ON public.order_items
    FOR ALL USING (is_admin());

-- =====================================================
-- 13. DONNÉES DE TEST (COMPATIBLES AVEC VOS DONNÉES)
-- =====================================================

-- Ajouter seulement les catégories manquantes
INSERT INTO public.categories (id, title, slug, image, description, is_active, sort_order) 
SELECT 'racing', 'Barils Racing', 'barils-racing', '/images/categories/racing.jpg', 'Barils haute performance pour la course', true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'racing');

INSERT INTO public.categories (id, title, slug, image, description, is_active, sort_order) 
SELECT 'vintage', 'Barils Vintage', 'barils-vintage', '/images/categories/vintage.jpg', 'Barils vintage et collection', true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'vintage');

INSERT INTO public.categories (id, title, slug, image, description, is_active, sort_order) 
SELECT 'custom', 'Barils Sur Mesure', 'barils-custom', '/images/categories/custom.jpg', 'Barils personnalisés selon vos goûts', true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'custom');

INSERT INTO public.categories (id, title, slug, image, description, is_active, sort_order) 
SELECT 'limited-edition', 'Éditions Limitées', 'editions-limitees', '/images/categories/limited.jpg', 'Barils en édition limitée', true, 4
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE id = 'limited-edition');

-- Ajouter seulement les produits manquants (après avoir créé les catégories)
INSERT INTO public.products (id, title, slug, price, image, description, categoryid, stock_quantity, min_stock_threshold, stock_reserved, is_active, is_featured) 
SELECT 'baril-vintage-oak', 'Baril Vintage Oak', 'baril-vintage-oak', 18999, '/images/products/baril-vintage-oak.jpg', 'Baril vintage en chêne français', 'vintage', 25, 5, 0, true, false
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE id = 'baril-vintage-oak')
  AND EXISTS (SELECT 1 FROM public.categories WHERE id = 'vintage');

INSERT INTO public.products (id, title, slug, price, image, description, categoryid, stock_quantity, min_stock_threshold, stock_reserved, is_active, is_featured) 
SELECT 'baril-custom-premium', 'Baril Custom Premium', 'baril-custom-premium', 34999, '/images/products/baril-custom-premium.jpg', 'Baril sur mesure premium', 'custom', 8, 2, 0, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE id = 'baril-custom-premium')
  AND EXISTS (SELECT 1 FROM public.categories WHERE id = 'custom');

INSERT INTO public.products (id, title, slug, price, image, description, categoryid, stock_quantity, min_stock_threshold, stock_reserved, is_active, is_featured) 
SELECT 'baril-limited-edition', 'Baril Limited Edition', 'baril-limited-edition', 49999, '/images/products/baril-limited-edition.jpg', 'Baril en édition limitée', 'limited-edition', 5, 1, 0, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE id = 'baril-limited-edition')
  AND EXISTS (SELECT 1 FROM public.categories WHERE id = 'limited-edition');

-- =====================================================
-- 14. COMMENTAIRES POUR LA DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.profiles IS 'Profils utilisateurs avec informations personnelles et préférences';
COMMENT ON TABLE public.categories IS 'Catégories de produits avec gestion de l''ordre d''affichage';
COMMENT ON TABLE public.products IS 'Produits disponibles à la vente avec gestion complète du stock';
COMMENT ON TABLE public.addresses IS 'Adresses de livraison et facturation des utilisateurs';
COMMENT ON TABLE public.carts IS 'Panier d''achat des utilisateurs avec contrainte d''unicité';
COMMENT ON TABLE public.favorites IS 'Produits favoris des utilisateurs avec contrainte d''unicité';
COMMENT ON TABLE public.orders IS 'Commandes des utilisateurs avec gestion complète du statut';
COMMENT ON TABLE public.order_items IS 'Articles des commandes avec informations produit';

-- =====================================================
-- FIN DU SCHEMA ECOMMERCE COMPLET ET PROPRE
-- =====================================================
