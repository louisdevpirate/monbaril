-- Ajouter le produit baril-militaire-cargo manquant
INSERT INTO public.products (
  id,
  title,
  slug,
  description,
  price,
  image,
  category_id,
  stock_quantity,
  stock_reserved,
  min_stock_threshold,
  created_at,
  updated_at
) VALUES (
  'prod-military-cargo',
  'Baril Militaire Cargo',
  'baril-militaire-cargo',
  'Baril militaire cargo robuste et fonctionnel',
  89.99,
  '/images/products/military-cargo.png',
  'cat-1', -- Assurez-vous que cette catégorie existe
  15,
  0,
  3,
  NOW(),
  NOW()
);
