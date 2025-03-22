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
    <Link
      href={`/products/${slug}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        width: "300px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "200px",
          position: "relative",
        }}
      >
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div style={{ padding: "1rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{title}</h2>
        <p style={{ fontWeight: "bold", color: "#333" }}>{price} €</p>
      </div>
    </Link>
  );
}
