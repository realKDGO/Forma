import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = url && key ? createClient(url, key) : null;

function requireSupabase() {
  if (!supabase) throw new Error("Authentication is not configured.");
  return supabase;
}

export const authService = {
  async session() {
    return (await supabase?.auth.getSession())?.data?.session || null;
  },
  async login(email, password) {
    const client = requireSupabase();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.session;
  },
  async register(name, email, password) {
    const client = requireSupabase();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });
    if (error) throw error;
    return data.session;
  },
  async requestPasswordReset(email) {
    const client = requireSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },
  async updatePassword(password) {
    const client = requireSupabase();
    const { data, error } = await client.auth.updateUser({ password });
    if (error) throw error;
    return data.user;
  },
  onAuthStateChange(callback) {
    const client = requireSupabase();
    return client.auth.onAuthStateChange(callback).data.subscription;
  },
  async logout() {
    if (supabase) await supabase.auth.signOut();
  },
};
