import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/admin/rls-test" },
};

export default function AdminRlsTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
