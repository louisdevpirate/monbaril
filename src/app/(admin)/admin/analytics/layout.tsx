import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/admin/analytics" },
};

export default function AdminAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
