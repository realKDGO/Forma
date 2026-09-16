import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = url && key ? createClient(url, key) : null;
export const authService = {
  async session() { return (await supabase?.auth.getSession())?.data?.session || null; },
  async login(email, password) { if (!supabase) throw new Error("Authentication is not configured."); const {data,error}=await supabase.auth.signInWithPassword({email,password}); if(error) throw error; return data.session; },
  async register(name,email,password) { if (!supabase) throw new Error("Authentication is not configured."); const {data,error}=await supabase.auth.signUp({email,password,options:{data:{name},emailRedirectTo:`${window.location.origin}/onboarding`}}); if(error) throw error; return data.session; },
  async logout() { if (supabase) await supabase.auth.signOut(); },
};
