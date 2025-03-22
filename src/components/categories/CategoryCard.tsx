import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/data/categories";

export function CategoryCard({ title, slug, image }: Category) {
  return (
    <Link href={`/categories/${slug}`} style={{ textDecoration: "none" }}>
      <div style={{ width: "300px", border: "1px solid #ccc", padding: "1rem" }}>
        <Image
          src={image}
          alt={title}
          width={300}
          height={200}
          style={{ objectFit: "cover" }}
        />
        <h2 style={{ marginTop: "1rem", fontSize: "1.2rem" }}>{title}</h2>
      </div>
    </Link>
  );
}
