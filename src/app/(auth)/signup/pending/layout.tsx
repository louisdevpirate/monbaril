import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/signup/pending" },
};

export default function SignupPendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
