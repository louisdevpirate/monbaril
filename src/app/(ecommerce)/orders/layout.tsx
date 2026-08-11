import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/orders" },
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
