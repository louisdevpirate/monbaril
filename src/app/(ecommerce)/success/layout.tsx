import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/success" },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
