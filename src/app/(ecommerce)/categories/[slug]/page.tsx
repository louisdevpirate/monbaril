import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return notFound();

  const filteredProducts = products.filter(
    (product) => product.categoryId === category.id
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{category.title}</h1>
      <p style={{ marginBottom: "2rem" }}>{category.description}</p>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {filteredProducts.length === 0 ? (
          <p>Aucun produit dans cette catégorie.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              slug={product.slug}
              image={product.image}
            />
          ))
        )}
      </div>
    </div>
  );
}
