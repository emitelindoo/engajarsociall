import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CAKTO_API = "https://api.cakto.com.br/public_api";
const PRODUCT_NAME = "Engajar Social";
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
    console.error("Cakto token error", { status: res.status, detail: data?.detail || null });
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

async function ensureProductId(_token: string): Promise<string> {
  const configuredProductId = Deno.env.get("CAKTO_PRODUCT_ID");
  if (configuredProductId) return configuredProductId;
  // ID numérico do produto informado pelo usuário
  return "1079808";
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

    const token = await getToken();
    const productId = await ensureProductId(token);

    const reference = crypto.randomUUID();
    const offerName = String(plan_name || description || "Pedido Engajar Social").slice(0, 120);

    const offer = await caktoFetch(token, "/offers/", {
      method: "POST",
      body: JSON.stringify({
        name: `${offerName} #${reference.slice(0, 8)}`.slice(0, 255),
        price: Number(total.toFixed(2)),
        product: productId,
        type: "unique",
        status: "active",
        units: 1,
      }),
    });

    if (!offer.ok || !offer.json?.id) {
      console.error("Cakto offer create error", { status: offer.status, body: offer.json });
      return json({ success: false, error: caktoError(offer.json, "Não foi possível criar a cobrança") }, 400);
    }

    const offerId = String(offer.json.id);
    const phone = onlyDigits(customer_phone || "11999999999").slice(-11);

    const payment = await caktoFetch(token, "/payments/", {
      method: "POST",
      headers: { "X-Idempotency-Key": reference },
      body: JSON.stringify({
        paymentMethod: "pix",
        customer: {
          name: String(customer_name || "Cliente").trim().slice(0, 120),
          email: String(customer_email || "cliente@email.com").trim().slice(0, 255),
          phone: `55${phone}`,
          fingerprint: `fp_${reference}`,
          docType: "cpf",
          docNumber: cpf,
        },
        items: [{ offerId, quantity: 1, offerType: "main" }],
        metadata: {
          plan_id: String(plan_id || ""),
          platform: String(platform || ""),
          username: String(username || ""),
        },
        pixExpiresIn: 3600,
        antifraudProfilingAttemptReference: reference,
      }),
    });

    console.log("Cakto PIX response", { status: payment.status, id: payment.json?.id || null });

    if (!payment.ok) {
      return json({ success: false, error: caktoError(payment.json, "Erro ao gerar PIX na Cakto") }, 400);
    }

    const pixCode = payment.json?.pix?.qrCode || null;
    const qrCodeBase64 = payment.json?.pix?.qrCodeBase64 || null;
    const caktoPaymentId = payment.json?.id ? String(payment.json.id) : null;

    const { data: txRow, error: txError } = await supabase
      .from("transactions")
      .insert({
        horsepay_transaction_id: caktoPaymentId,
        plan_id: plan_id || "unknown",
        plan_name: plan_name || "Plano",
        platform: platform || "Instagram",
        username: username || "",
        customer_name: customer_name || "Cliente",
        customer_email: customer_email || "",
        amount: total,
        status: "pending",
        pix_code: pixCode,
        extras: extras || [],
      })
      .select("id")
      .single();

    if (txError) console.error("Error saving transaction", txError);

    if (!pixCode) {
      return json({ success: false, transaction_id: txRow?.id || null, error: "PIX não gerado. Tente novamente." }, 400);
    }

    return json({
      success: true,
      transaction_id: txRow?.id || null,
      pix_code: pixCode,
      qr_code_image: qrCodeBase64,
      cakto_payment_id: caktoPaymentId,
    });
  } catch (err) {
    console.error("create-pix-payment error", err);
    return json({ success: false, error: (err as Error).message || "Erro interno" }, 500);
  }
});
