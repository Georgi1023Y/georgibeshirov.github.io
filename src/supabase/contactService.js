import {
  getSupabaseBrowserClient,
  getSupabaseDebugSnapshot,
  isSupabaseConfigured,
} from "../supabaseClient";

function looksLike401AuthIssue(msg) {
  if (!msg || typeof msg !== "string") return false;
  const m = msg.toLowerCase();
  return (
    m.includes("401") ||
    m.includes("unauthorized") ||
    m.includes("invalid api key") ||
    m.includes("jwt") ||
    (m.includes("permission denied") && m.includes("apikey"))
  );
}

function logCredentialDebug(context, extra) {
  const snap = getSupabaseDebugSnapshot();
  console.warn(`[Contact flow][Supabase debug] ${context}`, snap, extra ?? "");
}

/**
 * Inserts a contact form row (anon INSERT via RLS on public.messages).
 * @param {{ name: string; email: string; message: string }} payload
 * @returns {Promise<{ data: { success: true; id: string; created_at: string } | null, error: import("@supabase/supabase-js").PostgrestError | Error | null, fnError: string | null }>}
 */
export async function submitContactForm(payload) {
  if (import.meta.env.DEV) {
    console.log("[Contact flow] submitContactForm: start", {
      step: 1,
      formPayload: { name: payload.name, email: payload.email, messageLength: payload.message?.length },
    });
  }

  if (!isSupabaseConfigured) {
    if (import.meta.env.DEV) {
      console.log("[Contact flow] submitContactForm: abort — Supabase not configured");
    }
    return {
      data: null,
      error: new Error("Supabase is not configured"),
      fnError: "not_configured",
    };
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    if (import.meta.env.DEV) {
      console.log("[Contact flow] submitContactForm: abort — client is null");
    }
    return {
      data: null,
      error: new Error("Client unavailable"),
      fnError: "not_configured",
    };
  }

  const row = {
    full_name: payload.name,
    email: payload.email,
    content: payload.message,
  };

  try {
    if (import.meta.env.DEV) {
      console.log("[Contact flow] insert: payload (form) before .insert():", { step: 2, payload });
      console.log("[Contact flow] insert: row (DB columns) about to be sent", { step: 3, row });
    }

    const { data, error } = await supabase
      .from("messages")
      .insert(row)
      .select("id, created_at")
      .single();

    if (error) {
      console.error("[Contact flow] insert: failed (PostgREST returned error object)", error);
      console.table([
        {
          code: error.code,
          message: error.message,
          details: error.details ?? "—",
          hint: error.hint ?? "—",
        },
      ]);
      const status = "status" in error ? error.status : undefined;
      if (import.meta.env.DEV) {
        console.log("[Contact flow] insert: PostgREST error raw keys", Object.keys(error));
        if (status !== undefined) {
          console.log("[Contact flow] insert: HTTP status on error object:", status);
        }
      }
      if (import.meta.env.DEV) {
        logCredentialDebug("credential snapshot after PostgREST insert error");
      }
      if (status === 401 || looksLike401AuthIssue(error.message)) {
        logCredentialDebug("401-like PostgREST error — check URL + anon key for THIS project", {
          hint: "Dashboard → Settings → API: use anon public JWT (eyJ…) if publishable key fails.",
        });
      }
      return { data: null, error, fnError: error.message };
    }

    const successPayload = { success: true, id: data.id, created_at: data.created_at };
    if (import.meta.env.DEV) {
      console.log("[Contact flow] insert: Success — returned data (object)", { step: 4, data: successPayload });
      console.table([{ id: data.id, created_at: data.created_at, success: true }]);
      console.log("[Contact flow] submitContactForm: complete (ok)");
    }
    return {
      data: successPayload,
      error: null,
      fnError: null,
    };
  } catch (err) {
    console.error("[Contact flow] insert: thrown (e.g. network/TypeError)", err);
    if (import.meta.env.DEV) {
      logCredentialDebug("credential snapshot after thrown insert error");
    }
    const msg = err instanceof Error ? err.message : String(err);
    if (looksLike401AuthIssue(msg)) {
      logCredentialDebug("401-like thrown error (often fetch / gateway)", { message: msg });
    }
    if (err && typeof err === "object" && "code" in err) {
      console.table({
        code: err.code,
        message: err.message,
        details: err.details,
        hint: err.hint,
      });
    } else {
      console.table([{ name: err?.name, message: err?.message, cause: String(err?.cause ?? "") }]);
    }
    const e = err instanceof Error ? err : new Error(String(err));
    return {
      data: null,
      error: e,
      fnError: e.message || "Unknown error",
    };
  }
}
