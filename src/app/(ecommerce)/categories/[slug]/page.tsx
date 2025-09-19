import { notFound } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { createClient } from "@/lib/supabase/server";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createClient();

  // Récupérer la catégorie
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, title, slug, description')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (categoryError || !category) {
    return notFound();
  }

  // Récupérer les produits de cette catégorie
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, title, slug, price, image, description, categoryid')
    .eq('categoryid', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (productsError) {
    console.error('Erreur lors du chargement des produits:', productsError);
  }

  const filteredProducts = products || [];

  return (
    <div className="max-w-[95%] mx-auto px-6 lg:px-10 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{category.title}</h1>
        <p className="text-gray-600 text-lg">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">Aucun produit dans cette catégorie.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))
        )}
      </div>
    </div>
  );
}
