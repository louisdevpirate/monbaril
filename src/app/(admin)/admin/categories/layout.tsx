import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/admin/categories" },
};

export default function AdminCategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
