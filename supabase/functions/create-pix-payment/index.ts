import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CAKTO_API = "https://api.cakto.com.br/public_api";
const MIN_AMOUNT = 5;
const DEFAULT_OFFER_ID = "mauxop3";

type CaktoResponse = Record<string, any>;

const onlyDigits = (value: string) => value.replace(/\D/g, "");

function formatCpf(cpf: string): string {
  const digits = onlyDigits(cpf);
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let index = 0; index < 9; index += 1) sum += Number(digits[index]) * (10 - index);
  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== Number(digits[9])) return false;

  sum = 0;
  for (let index = 0; index < 10; index += 1) sum += Number(digits[index]) * (11 - index);
  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;
  return secondDigit === Number(digits[10]);
}

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function caktoError(body: CaktoResponse, fallback: string): string {
  if (typeof body?.detail === "string") return body.detail;
  if (typeof body?.message === "string") return body.message;

  const firstKey = body && Object.keys(body)[0];
  const value = firstKey ? body[firstKey] : null;
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return fallback;
}

async function getCaktoToken(): Promise<string> {
  const clientId = Deno.env.get("CAKTO_CLIENT_ID");
  const clientSecret = Deno.env.get("CAKTO_CLIENT_SECRET");
  if (!clientId || !clientSecret) throw new Error("Credenciais da Cakto não configuradas.");

  const tokenResponse = await fetch(`${CAKTO_API}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret }),
  });
  const body = await tokenResponse.json().catch(() => ({}));

  if (!tokenResponse.ok || typeof body?.access_token !== "string") {
    console.error("Cakto token error", { status: tokenResponse.status });
    throw new Error("Não foi possível autenticar o pagamento na Cakto.");
  }

  return body.access_token;
}

async function caktoFetch(token: string, path: string, init: RequestInit = {}) {
  const result = await fetch(`${CAKTO_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await result.text();
  let body: CaktoResponse = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = {};
  }
  return { ok: result.ok, status: result.status, body };
}

function resolveOfferId(): string {
  // ID real da oferta (extraído do link de checkout https://pay.cakto.com.br/mauxop3_1079808)
  return DEFAULT_OFFER_ID;
}


serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return response({ success: false, error: "Método não permitido" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) throw new Error("Backend não configurado.");

    const body = await req.json();
    const amount = Number(body?.amount);
    const customerName = String(body?.customer_name || "").trim();
    const customerEmail = String(body?.customer_email || "").trim().toLowerCase();
    const customerCpf = onlyDigits(String(body?.customer_cpf || ""));
    const customerPhone = onlyDigits(String(body?.customer_phone || "11999999999")).slice(-11);

    if (!Number.isFinite(amount) || amount < MIN_AMOUNT) {
      return response({ success: false, error: `O valor mínimo para pagamento é R$${MIN_AMOUNT.toFixed(2).replace(".", ",")}.` }, 400);
    }
    if (!customerName || customerName.length < 3) {
      return response({ success: false, error: "Informe seu nome completo." }, 400);
    }
    if (!customerEmail || !/^\S+@\S+\.\S+$/.test(customerEmail)) {
      return response({ success: false, error: "Informe um e-mail válido." }, 400);
    }
    if (!isValidCpf(customerCpf)) {
      return response({ success: false, error: "CPF inválido. Digite um CPF válido." }, 400);
    }

    const token = await getCaktoToken();
    const reference = crypto.randomUUID();
    const offerId = resolveOfferId();
    const antifraudReference = `engajar_${reference}`;

    const payment = await caktoFetch(token, "/payments/", {
      method: "POST",
      headers: { "X-Idempotency-Key": reference },
      body: JSON.stringify({
        paymentMethod: "pix",
        customer: {
          name: customerName.slice(0, 120),
          email: customerEmail.slice(0, 255),
          phone: `55${customerPhone || "11999999999"}`,
          fingerprint: antifraudReference,
          docType: "cpf",
          docNumber: customerCpf,
        },
        items: [{ offerId, quantity: 1, offerType: "main" }],
        metadata: {
          plan_id: String(body?.plan_id || ""),
          platform: String(body?.platform || "Instagram"),
          username: String(body?.username || ""),
        },
        pixExpiresIn: 3600,
      }),
    });

    console.log("Cakto PIX response", {
      status: payment.status,
      paymentId: payment.body?.id || null,
      offerId,
      body: payment.ok ? undefined : payment.body,
    });


    if (!payment.ok) {
      const permissionError = payment.status === 401 || payment.status === 403;
      const error = permissionError
        ? "A chave da Cakto precisa ter o escopo 'write payments' habilitado."
        : caktoError(payment.body, "A Cakto não conseguiu gerar o PIX.");
      // Provider/configuration failures are returned as an application result so
      // the checkout can show a useful message instead of a FunctionsHttpError.
      return response({
        success: false,
        error,
        code: permissionError ? "CAKTO_SCOPE_MISSING" : "CAKTO_PAYMENT_FAILED",
      });
    }

    const pixCode = payment.body?.pix?.qrCode;
    const qrCodeImage = payment.body?.pix?.qrCodeBase64 || null;
    const caktoPaymentId = payment.body?.id ? String(payment.body.id) : null;
    if (typeof pixCode !== "string" || !pixCode.trim() || !caktoPaymentId) {
      return response({ success: false, error: "A Cakto não retornou os dados do PIX. Tente novamente." }, 502);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        horsepay_transaction_id: caktoPaymentId,
        cakto_offer_id: offerId,
        plan_id: String(body?.plan_id || "unknown"),
        plan_name: String(body?.plan_name || "Plano"),
        platform: String(body?.platform || "Instagram"),
        username: String(body?.username || ""),
        customer_name: customerName,
        customer_email: customerEmail,
        amount: Number(amount.toFixed(2)),
        status: "pending",
        pix_code: pixCode,
        extras: Array.isArray(body?.extras) ? body.extras : [],
      })
      .select("id")
      .single();

    if (transactionError) console.error("Error saving transaction", transactionError);

    return response({
      success: true,
      transaction_id: transaction?.id || null,
      pix_code: pixCode,
      qr_code_image: qrCodeImage,
      cakto_payment_id: caktoPaymentId,
      status: "pending",
    });
  } catch (error) {
    console.error("Error creating Cakto PIX payment", error);
    return response({
      success: false,
      error: error instanceof Error ? error.message : "Erro interno ao gerar o PIX.",
    }, 500);
  }
});
