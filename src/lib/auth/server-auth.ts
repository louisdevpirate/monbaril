import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getCurrentUserFromServer() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return { id: user.id, email: user.email, role: profile?.role || 'user' };
  } catch {
    return null;
  }
}

export async function getCurrentUserIdFromServer(): Promise<string | null> {
  const user = await getCurrentUserFromServer();
  return user?.id || null;
} 