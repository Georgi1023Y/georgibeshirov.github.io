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
 * Uses `.insert()` only (no `.select()`) so RLS does not require SELECT on the row.
 * Never returns developer-facing config/connection strings for UI display.
 * @param {{ full_name: string; email: string; content: string }} payload
 * @returns {Promise<{ data: { success: true } | null, error: import("@supabase/supabase-js").PostgrestError | Error | null, fnError: string | null }>}
 */
export async function submitContactForm(payload) {
  if (import.meta.env.DEV) {
    console.log("[Contact flow] submitContactForm: start", {
      step: 1,
      formPayload: {
        full_name: payload.full_name,
        email: payload.email,
        contentLength: payload.content?.length,
      },
    });
  }

  if (!isSupabaseConfigured) {
    if (import.meta.env.DEV) {
      console.log("[Contact flow] submitContactForm: abort — Supabase not configured");
    }
    return {
      data: null,
      error: new Error("not_configured"),
      fnError: null,
    };
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    if (import.meta.env.DEV) {
      console.log("[Contact flow] submitContactForm: abort — client is null");
    }
    return {
      data: null,
      error: new Error("not_configured"),
      fnError: null,
    };
  }

  const insertPayload = {
    full_name: payload.full_name,
    email: payload.email,
    content: payload.content,
  };

  try {
    if (import.meta.env.DEV) {
      console.log("[Contact flow] insert: incoming payload", { step: 2, payload });
      console.log("[Contact flow] insert: exact keys sent to Supabase", {
        step: 3,
        keys: Object.keys(insertPayload),
        insertPayload,
      });
    }

    const { error } = await supabase.from("messages").insert(insertPayload);

    if (error) {
      if (import.meta.env.DEV) {
        console.error("[Contact flow] insert: failed (PostgREST returned error object)", error);
        console.table([
          {
            code: error.code,
            message: error.message,
            details: error.details ?? "—",
            hint: error.hint ?? "—",
          },
        ]);
        console.log("[Contact flow] insert: PostgREST error raw keys", Object.keys(error));
        const status = "status" in error ? error.status : undefined;
        if (status !== undefined) {
          console.log("[Contact flow] insert: HTTP status on error object:", status);
        }
        logCredentialDebug("credential snapshot after PostgREST insert error");
        if (status === 401 || looksLike401AuthIssue(error.message)) {
          logCredentialDebug("401-like PostgREST error — check URL + anon key for THIS project", {
            hint: "Dashboard → Settings → API: use anon public JWT (eyJ…) if publishable key fails.",
          });
        }
        console.error("[Contact flow] messages.insert result", { ok: false, error });
      }
      // Do not expose PostgREST / config messages to callers for UI.
      return { data: null, error, fnError: null };
    }

    const successPayload = { success: true };
    if (import.meta.env.DEV) {
      console.info("[Contact flow] messages.insert result — OK", {
        ok: true,
        table: "messages",
        columnsSent: Object.keys(insertPayload),
        insertPayload,
      });
    }
    return {
      data: successPayload,
      error: null,
      fnError: null,
    };
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error("[Contact flow] insert: thrown (e.g. network/TypeError)", err);
      logCredentialDebug("credential snapshot after thrown insert error");
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
    }
    const e = err instanceof Error ? err : new Error("submit_failed");
    return {
      data: null,
      error: e,
      fnError: null,
    };
  }
}
