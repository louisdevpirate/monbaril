"use client";

import { useEffect } from "react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Supprimer les attributs ajoutés par les extensions après l'hydratation
    const body = document.body;
    if (body) {
      body.removeAttribute('cz-shortcut-listen');
    }
  }, []);

  return <>{children}</>;
}
