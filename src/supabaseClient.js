import { createClient } from "@supabase/supabase-js";

/**
 * Vite only exposes env vars prefixed with VITE_ (embedded at build time).
 * Use the **anon public** key from Supabase Dashboard → Settings → API.
 *
 * If you see **401 Unauthorized** on inserts: use the long **JWT** key labelled
 * `anon` `public` (starts with `eyJ...`). Do not use `service_role`. If the dashboard
 * only shows `sb_publishable_...`, that is usually fine with current supabase-js—then
 * verify the key belongs to this project URL and has not been rotated/revoked.
 */
const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim()?.replace(/\/$/, "");
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * @param {string | undefined} url
 * @returns {string | null}
 */
function normalizeSupabaseUrl(url) {
  if (!url || typeof url !== "string") return null;
  let u = url.trim();
  if (!u) return null;
  if (u.startsWith("//")) u = `https:${u}`;
  u = u.replace(/\/+$/g, "");
  if (!/^https?:\/\//i.test(u) && /\.supabase\.co/i.test(u)) {
    u = `https://${u.replace(/^\/+/, "")}`;
  }
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

const supabaseUrl = normalizeSupabaseUrl(typeof rawUrl === "string" ? rawUrl : undefined);
const supabaseAnonKey = typeof rawAnonKey === "string" ? rawAnonKey.trim() : "";

const rawUrlFromEnv = import.meta.env.VITE_SUPABASE_URL;
const hasKeyFromEnv = Boolean(
  import.meta.env.VITE_SUPABASE_ANON_KEY && String(import.meta.env.VITE_SUPABASE_ANON_KEY).trim()
);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Safe snapshot for debugging 401 / missing env (no full secrets in console).
 * @returns {Record<string, unknown>}
 */
export function getSupabaseDebugSnapshot() {
  const rawK = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const rawU = import.meta.env.VITE_SUPABASE_URL;
  return {
    import_meta_has_VITE_SUPABASE_URL: rawU !== undefined,
    import_meta_has_VITE_SUPABASE_ANON_KEY: rawK !== undefined,
    raw_url_trimmed_length: String(rawU ?? "").trim().length,
    raw_key_trimmed_length: String(rawK ?? "").trim().length,
    normalized_origin: supabaseUrl,
    resolved_key_length: supabaseAnonKey.length,
    resolved_key_prefix: `${supabaseAnonKey.slice(0, 14)}…`,
    resolved_key_shape: supabaseAnonKey.startsWith("eyJ")
      ? "eyJ… (legacy anon JWT)"
      : supabaseAnonKey.startsWith("sb_publishable_")
        ? "sb_publishable_…"
        : supabaseAnonKey.length
          ? "other_format"
          : "empty",
    isSupabaseConfigured,
    createClientFailed,
  };
}

if (import.meta.env.DEV) {
  if (isSupabaseConfigured) {
    const keyHint = supabaseAnonKey.startsWith("eyJ")
      ? "legacy anon JWT"
      : supabaseAnonKey.startsWith("sb_publishable_")
        ? "publishable key"
        : "custom";
    console.log("[Contact flow][Supabase] credentials resolved", {
      VITE_SUPABASE_URL_normalized: supabaseUrl,
      anonKey: `present (length ${supabaseAnonKey.length}, ${keyHint})`,
      fromEnv: { urlDefined: rawUrlFromEnv !== undefined, keyDefined: hasKeyFromEnv },
      mode: import.meta.env.MODE,
    });
    if (!supabaseAnonKey.startsWith("eyJ") && !supabaseAnonKey.startsWith("sb_publishable_")) {
      console.warn(
        "[Supabase] Key format unrecognized. 401 errors often mean wrong key: copy the **anon public** JWT (eyJ...) from Dashboard → API."
      );
    }
  } else {
    console.log("[Contact flow][Supabase] not configured", {
      hasRawUrl: Boolean(rawUrlFromEnv?.trim?.()),
      hasKeyFromEnv: hasKeyFromEnv,
      normalizedUrl: supabaseUrl,
      mode: import.meta.env.MODE,
    });
  }
}

if (!isSupabaseConfigured) {
  const help =
    " VITE build needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (GitHub: Settings → Secrets and variables → Actions, then redeploy; local: .env + restart Vite).";
  if (import.meta.env.PROD) {
    console.error("Missing GitHub Secrets/Env Vars." + help);
  } else {
    console.warn("Missing GitHub Secrets/Env Vars. (dev)" + help);
  }
}

/** @type {import("@supabase/supabase-js").SupabaseClient | null} */
let client = null;
let createClientFailed = false;

/**
 * @returns {import("@supabase/supabase-js").SupabaseClient | null}
 */
export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured || createClientFailed) {
    return null;
  }
  if (!client) {
    if (import.meta.env.DEV) {
      console.log("[Contact flow][Supabase] createClient() initializing (first call)", {
        supabaseUrl,
        anonKey: `length ${supabaseAnonKey.length}`,
      });
    }
    try {
      // Do not set global Content-Type/Accept here — supabase-js sets per-request headers;
      // wrong global headers have been associated with auth/REST issues in some setups.
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
      if (import.meta.env.DEV) {
        console.log("[Contact flow][Supabase] createClient: OK");
      }
    } catch (e) {
      createClientFailed = true;
      client = null;
      console.error("[Contact flow][Supabase] createClient threw — halting client init:", e);
    }
  }
  return client;
}

const supabase = isSupabaseConfigured && !createClientFailed ? getSupabaseBrowserClient() : null;
export default supabase;

if (import.meta.env.DEV && typeof window !== "undefined") {
  window.__portfolioTestSupabase = {
    debugSnapshot: () => getSupabaseDebugSnapshot(),
    checklist: () => {
      console.log(`
[Portfolio][Supabase] quick checklist
  [ ] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (anon JWT eyJ... or publishable sb_...)
  [ ] Same project: URL ref in Dashboard must match this URL
  [ ] messages table + RLS anon INSERT
`);
    },
    run: async () => {
      if (!isSupabaseConfigured || createClientFailed) {
        console.warn("[Portfolio] Supabase env not configured or createClient failed.");
        return { ok: false, reason: "not_configured" };
      }
      const sb = getSupabaseBrowserClient();
      if (!sb) {
        return { ok: false, reason: "no_client" };
      }
      const { data, error } = await sb.auth.getSession();
      if (error) {
        console.error("[Portfolio] getSession:", error);
        return { ok: false, error };
      }
      console.log("[Portfolio] Supabase client alive. Session:", data.session ? "signed in" : "anon");
      window.__portfolioTestSupabase.checklist();
      return { ok: true, session: data.session };
    },
  };
}
