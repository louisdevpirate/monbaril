"use client";

import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "sonner";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>
        <Toaster />
        <Navbar />
        <main>{children}</main>
      </CartProvider>
    </UserProvider>
  );
}
