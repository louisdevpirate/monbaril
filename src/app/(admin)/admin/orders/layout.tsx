import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/admin/orders" },
};

export default function AdminOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
