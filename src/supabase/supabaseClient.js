import { createClient } from "@supabase/supabase-js";

/**
 * Vite only exposes env vars prefixed with VITE_ (embedded at build time).
 * The Supabase anon key is public by design. Never ship service_role, webhooks
 * signing secrets, or Resend API keys in the client.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * @type {import('@supabase/supabase-js').SupabaseClient | null}
 */
let client = null;

/**
 * Single browser client. Auth is unused for the portfolio but kept for
 * future magic-link / user areas.
 */
export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: { "X-Client-Info": "georgi-portfolio" },
      },
    });
  }
  return client;
}

/**
 * @deprecated use getSupabaseBrowserClient for clarity; default export kept for short imports
 */
const supabase = isSupabaseConfigured
  ? getSupabaseBrowserClient()
  : null;

export default supabase;
