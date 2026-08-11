import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/admin/products" },
};

export default function AdminProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
