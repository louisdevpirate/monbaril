import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/admin/studio" },
};

export default function AdminStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
