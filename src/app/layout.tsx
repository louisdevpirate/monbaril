import Navbar from "@/components/layout/Navbar";
import { CurrentYear } from "@/components/shared/CurrentYear";
import { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <UserProvider>
          <CartProvider>
            <Toaster />
              <Navbar />
              <main>{children}</main>
              <footer style={{ padding: "2rem", textAlign: "center", marginTop: "3rem", borderTop: "1px solid #ccc" }}>
                © <CurrentYear /> MonBaril. Tous droits réservés.
              </footer>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
