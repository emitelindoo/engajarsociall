import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CAKTO_API = "https://api.cakto.com.br/public_api";
const MIN_AMOUNT = 5;

const onlyDigits = (value: string) => value.replace(/\D/g, "");

function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(digits[i]) * (10 - i);
  let first = (sum * 10) % 11;
  if (first === 10) first = 0;
  if (first !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i += 1) sum += Number(digits[i]) * (11 - i);
  let second = (sum * 10) % 11;
  if (second === 10) second = 0;
  return second === Number(digits[10]);
}

async function getToken(): Promise<string> {
  const clientId = Deno.env.get("CAKTO_CLIENT_ID");
  const clientSecret = Deno.env.get("CAKTO_CLIENT_SECRET");
  if (!clientId || !clientSecret) throw new Error("Credenciais da Cakto não configuradas");

  const res = await fetch(`${CAKTO_API}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.access_token) {
    console.error("Cakto token error", { status: res.status, detail: data?.detail || data?.error || null });
    throw new Error("Falha ao autenticar na Cakto");
  }
  return data.access_token as string;
}

async function caktoFetch(token: string, path: string, init: RequestInit = {}) {
  const res = await fetch(`${CAKTO_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = {};
  }
  return { ok: res.ok, status: res.status, json };
}

function caktoError(json: any, fallback: string): string {
  if (!json) return fallback;
  if (typeof json.detail === "string") return json.detail;
  const firstKey = Object.keys(json)[0];
  const value = firstKey ? json[firstKey] : null;
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return fallback;
}

async function getBaseOfferId(): Promise<string> {
  const configured = Deno.env.get("CAKTO_PRODUCT_ID") || Deno.env.get("CAKTO_BASE_OFFER_ID");
  if (configured) return configured;
  // Checkout link informado pelo usuário: https://pay.cakto.com.br/mauxop3_1079808
  return "mauxop3_1079808";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      amount,
      description,
      customer_name,
      customer_email,
      customer_cpf,
      customer_phone,
      plan_id,
      plan_name,
      platform,
      username,
      extras,
    } = await req.json();

    const total = Number(amount);
    if (!total || total <= 0) {
      return json({ success: false, error: "Valor inválido" }, 400);
    }
    if (total < MIN_AMOUNT) {
      return json(
        { success: false, error: `O valor mínimo para pagamento é R$${MIN_AMOUNT.toFixed(2).replace(".", ",")}. Adicione mais itens ao carrinho.` },
        400,
      );
    }

    const cpf = onlyDigits(customer_cpf || "");
    if (!isValidCpf(cpf)) {
      return json({ success: false, error: "CPF inválido. Digite um CPF válido." }, 400);
    }

    const baseOfferId = await getBaseOfferId();
    const reference = crypto.randomUUID();
    const offerName = String(plan_name || description || "Pedido Engajar Social").slice(0, 120);

    let checkoutOfferId = baseOfferId;
    let dynamicPricing = false;

    // Tenta criar uma oferta dinâmica com o valor exato do carrinho.
    // Se a chave de API não tiver escopo de ofertas, usamos o checkout base.
    try {
      const token = await getToken();
      const baseOffer = await caktoFetch(token, `/offers/${encodeURIComponent(baseOfferId)}/`);
      if (baseOffer.ok && baseOffer.json?.product) {
        const offer = await caktoFetch(token, "/offers/", {
          method: "POST",
          body: JSON.stringify({
            name: `${offerName} #${reference.slice(0, 8)}`.slice(0, 255),
            price: Number(total.toFixed(2)),
            product: String(baseOffer.json.product),
            type: "unique",
            status: "active",
            units: 1,
          }),
        });
        if (offer.ok && offer.json?.id) {
          checkoutOfferId = String(offer.json.id);
          dynamicPricing = true;
        } else {
          console.error("Cakto offer create error", { status: offer.status, body: offer.json });
        }
      } else {
        console.error("Cakto base offer error", { status: baseOffer.status, body: baseOffer.json, baseOfferId });
      }
    } catch (e) {
      console.error("Cakto dynamic offer skipped", (e as Error).message);
    }

    const params = new URLSearchParams();
    if (customer_name) params.set("name", String(customer_name));
    if (customer_email) params.set("email", String(customer_email));
    if (customer_phone) params.set("phone", onlyDigits(String(customer_phone)));
    if (cpf) params.set("document", cpf);
    const query = params.toString();
    const checkoutUrl = `https://pay.cakto.com.br/${checkoutOfferId}${query ? `?${query}` : ""}`;


    // Registra a transação para acompanhamento via webhook
    const { data: txRow, error: txError } = await supabase
      .from("transactions")
      .insert({
        horsepay_transaction_id: null, // será preenchido pelo webhook
        cakto_offer_id: newOfferId,
        plan_id: plan_id || "unknown",
        plan_name: plan_name || "Plano",
        platform: platform || "Instagram",
        username: username || "",
        customer_name: customer_name || "Cliente",
        customer_email: customer_email || "",
        amount: total,
        status: "pending",
        pix_code: checkoutUrl,
        extras: extras || [],
      })
      .select("id")
      .single();

    if (txError) console.error("Error saving transaction", txError);

    return json({
      success: true,
      transaction_id: txRow?.id || null,
      checkout_url: checkoutUrl,
    });
  } catch (err) {
    console.error("create-pix-payment error", err);
    return json({ success: false, error: (err as Error).message || "Erro interno" }, 500);
  }
});
