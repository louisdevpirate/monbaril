import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/admin/profiles" },
};

export default function AdminProfilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
