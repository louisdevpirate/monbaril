import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/admin/stocks" },
};

export default function AdminStocksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
