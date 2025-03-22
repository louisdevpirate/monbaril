import { categories } from "@/lib/data/categories";
import { CategoryCard } from "@/components/categories/CategoryCard";

export default function CategoriesPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Nos Catégories</h1>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            title={category.title}
            slug={category.slug}
            image={category.image}
          />
        ))}
      </div>
    </div>
  );
}
