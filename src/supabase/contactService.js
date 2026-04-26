import { getSupabaseBrowserClient, isSupabaseConfigured } from "./supabaseClient";

/**
 * Submits the contact form via Edge Function (DB insert + optional Resend in one step).
 * @param {{ name: string; email: string; message: string; timestamp?: string }} payload
 * @returns {Promise<{ data: { success?: boolean; id?: string; emailNotificationSent?: boolean; warning?: string } | null, error: Error | null, fnError: string | null }>}
 */
export async function submitContactForm(payload) {
  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: new Error("Supabase is not configured"),
      fnError: "not_configured",
    };
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      data: null,
      error: new Error("Client unavailable"),
      fnError: "not_configured",
    };
  }

  const { data, error } = await supabase.functions.invoke("submit-contact", {
    body: {
      name: payload.name,
      email: payload.email,
      message: payload.message,
      timestamp: payload.timestamp,
    },
  });

  if (error) {
    const msg =
      (data && typeof data === "object" && "error" in data && data.error) ||
      error.message;
    return { data, error, fnError: String(msg) };
  }

  if (data && typeof data === "object" && "error" in data && data.error) {
    return { data, error: new Error(String(data.error)), fnError: String(data.error) };
  }

  return { data, error: null, fnError: null };
}
