import { products } from "@/lib/data/products";
import { notFound } from "next/navigation";
import Image from "next/image";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) return notFound();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{product.title}</h1>
      <Image
        src={product.image}
        alt={product.title}
        width={600}
        height={600}
        style={{ objectFit: "cover", margin: "2rem 0" }}
      />
      <p style={{ marginBottom: "1rem" }}>{product.description}</p>
      <p style={{ fontWeight: "bold", fontSize: "1.25rem" }}>{product.price} €</p>
    </div>
  );
}
