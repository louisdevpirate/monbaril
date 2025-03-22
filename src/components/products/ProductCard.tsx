import Link from "next/link";
import Image from "next/image";

interface ProductProps {
  title: string;
  price: number;
  slug: string;
  image: string;
}

export function ProductCard({ title, price, slug, image }: ProductProps) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", width: "300px" }}>
      <Image
        src={image}
        alt={title}
        width={300}
        height={300}
        style={{ objectFit: "cover" }}
      />
      <h2 style={{ fontSize: "1.25rem", margin: "1rem 0 0.5rem" }}>{title}</h2>
      <p style={{ marginBottom: "0.5rem" }}>{price}€</p>
      <Link href={`/products/${slug}`}>Voir le produit</Link>
    </div>
  );
}
