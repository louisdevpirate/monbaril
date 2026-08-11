import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/login-jwt" },
};

export default function LoginJwtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
