-- Vérifier les produits dans la base de données
SELECT 
  id,
  title,
  slug,
  stock_quantity,
  stock_reserved,
  min_stock_threshold
FROM products 
ORDER BY title;
