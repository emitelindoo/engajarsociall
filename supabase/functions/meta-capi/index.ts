// Meta Conversions API — server-side event forwarding with deduplication
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PIXEL_ID = "1974107703363237";
const GRAPH = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`;

const sha256 = async (value: string) => {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const hashOrUndefined = async (v?: string | null) =>
  v && v.trim() ? await sha256(v) : undefined;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const token = Deno.env.get("META_CAPI_ACCESS_TOKEN");
    if (!token) {
      return new Response(JSON.stringify({ error: "missing_token" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      event_name,
      event_id,
      event_source_url,
      custom_data = {},
      user_data = {},
      test_event_code,
    } = body ?? {};

    if (!event_name || !event_id) {
      return new Response(JSON.stringify({ error: "event_name and event_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("cf-connecting-ip") ??
      undefined;

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name,
          event_id,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url,
          user_data: {
            em: await hashOrUndefined(user_data.email),
            ph: await hashOrUndefined(
              user_data.phone ? user_data.phone.replace(/\D/g, "") : undefined,
            ),
            fn: await hashOrUndefined(user_data.first_name),
            ln: await hashOrUndefined(user_data.last_name),
            external_id: await hashOrUndefined(user_data.external_id),
            client_ip_address: ip,
            client_user_agent: req.headers.get("user-agent") ?? undefined,
            fbp: user_data.fbp,
            fbc: user_data.fbc,
          },
          custom_data,
        },
      ],
    };
    if (test_event_code) payload.test_event_code = test_event_code;

    const res = await fetch(`${GRAPH}?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (!res.ok) console.error("Meta CAPI error", JSON.stringify(result));

    return new Response(JSON.stringify({ ok: res.ok, result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("meta-capi failure", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
