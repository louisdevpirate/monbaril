import Navbar from "@/components/layout/Navbar";
import { CurrentYear } from "@/components/shared/CurrentYear";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer style={{ padding: "2rem", textAlign: "center", marginTop: "3rem", borderTop: "1px solid #ccc" }}>
          © <CurrentYear /> MonBaril. Tous droits réservés.
        </footer>
      </body>
    </html>
  );
}
