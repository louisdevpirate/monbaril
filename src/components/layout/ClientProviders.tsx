"use client";

import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "sonner";
import SiteNavigationTools from "@/components/layout/SiteNavigationTools";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>
        <Toaster />
        <AnalyticsProvider />
        <SiteNavigationTools />
        <Navbar />
        <main>{children}</main>
      </CartProvider>
    </UserProvider>
  );
}
