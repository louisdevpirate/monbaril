import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/profile" },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
