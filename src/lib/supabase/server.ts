import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { type Database } from "@/types/supabase";
import { supabaseConfig } from "./config";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Si on est dans un contexte server component, on ignore
          }
        },
      },
    }
  );
}