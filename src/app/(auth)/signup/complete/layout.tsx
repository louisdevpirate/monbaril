import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/signup/complete" },
};

export default function SignupCompleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
