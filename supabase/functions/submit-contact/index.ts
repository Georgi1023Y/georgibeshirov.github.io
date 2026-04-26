// @ts-nocheck
// Supabase Edge Function: validate → insert (service role) → Resend (optional)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.0";

type Body = { name?: string; email?: string; message?: string; timestamp?: string };

const MAX_NAME = 100;
const MAX_MSG = 5000;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

function validate(
  body: Body,
):
  | { ok: true; name: string; email: string; message: string }
  | { ok: false; err: string } {
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (name.length < 2) {
    return { ok: false, err: "Name must be at least 2 characters." };
  }
  if (name.length > MAX_NAME) {
    return { ok: false, err: "Name is too long." };
  }
  if (!email || !emailRe.test(email)) {
    return { ok: false, err: "Invalid email." };
  }
  if (message.length < 10) {
    return { ok: false, err: "Message must be at least 10 characters." };
  }
  if (message.length > MAX_MSG) {
    return { ok: false, err: "Message is too long." };
  }

  return { ok: true, name, email, message };
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function sendResend(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string
) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    return { ok: false, detail: await res.text() };
  }
  return { ok: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const v = validate(body);
  if (!v.ok) {
    return json({ error: v.err }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return json({ error: "Server configuration error" }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const safeTimestamp =
    typeof body.timestamp === "string" && !Number.isNaN(Date.parse(body.timestamp))
      ? new Date(body.timestamp).toISOString()
      : new Date().toISOString();

  const { data: row, error: dbError } = await admin
    .from("contact_messages")
    .insert({
      name: v.name,
      email: v.email,
      message: v.message,
      created_at: safeTimestamp,
    })
    .select("id")
    .single();

  if (dbError) {
    console.error("DB insert", dbError);
    return json({ error: "Could not save your message. Try again later." }, 500);
  }

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const to = Deno.env.get("NOTIFY_TO_EMAIL");
  const from = Deno.env.get("RESEND_FROM") ?? "onboarding@resend.dev";

  if (!resendKey || !to) {
    console.warn("RESEND_API_KEY or NOTIFY_TO_EMAIL not set; skipping email");
    return json(
      {
        success: true,
        id: row.id,
        emailNotificationSent: false,
        warning: "Message stored; email not configured in project.",
      },
      201
    );
  }

  const fromHeader = from.includes("<") ? from : `Portfolio <${from}>`;
  const r = await sendResend(
    resendKey,
    fromHeader,
    to,
    `New message from ${v.name} (portfolio)`,
    `
      <div style="font-family:system-ui,Segoe UI,sans-serif;max-width:560px;margin:0 auto;line-height:1.5">
        <p style="color:#4f46e5;font-size:12px;letter-spacing:0.05em;font-weight:600">PORTFOLIO CONTACT</p>
        <h1 style="font-size:18px;font-weight:600;margin:0 0 12px">New message</h1>
        <p><strong>From</strong> ${escapeHtml(v.name)} &lt;${escapeHtml(v.email)}&gt;</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0" />
        <p style="white-space:pre-wrap;font-size:15px;color:#334155">${escapeHtml(v.message)}</p>
        <p style="font-size:12px;color:#94a3b8;margin-top:24px">Id: ${row.id}</p>
      </div>
    `
  );

  if (!r.ok) {
    console.error("Resend", r.detail);
    return json(
      {
        success: true,
        id: row.id,
        emailNotificationSent: false,
        warning: "Message saved; email notification could not be sent.",
      },
      201
    );
  }

  return json(
    { success: true, id: row.id, emailNotificationSent: true },
    201
  );
});
