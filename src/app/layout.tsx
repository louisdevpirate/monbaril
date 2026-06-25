"use client";

import Navbar from "@/components/layout/Navbar";
import { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/UserContext";
import { Space_Grotesk, Bebas_Neue } from 'next/font/google';
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${bebasNeue.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#e85d04" />
      </head>
      <body className="font-space-grotesk">
        <UserProvider>
          <CartProvider>
            <Toaster />
            <Navbar />
            <main>{children}</main>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}