import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/products/ProductCard";

export default function ProductsPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Nos Barils</h1>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            price={product.price}
            slug={product.slug}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
}
