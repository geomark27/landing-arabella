import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente para uso en servidor y API routes (mantener compatibilidad)
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Cliente mejorado para uso en cliente (componentes)
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Tipos para TypeScript
export type WaitlistEntry = {
  id: string;
  email: string;
  ip_address?: string;
  country?: string;
  created_at: string;
};