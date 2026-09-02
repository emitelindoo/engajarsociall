import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PAYFORGE_API = Deno.env.get("PAYFORGE_API") || "https://dashboard.payforge.group/api/v1";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

function formatCpf(cpf: string): string {
  const digits = onlyDigits(cpf);
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf);

  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    sum += Number(digits[index]) * (10 - index);
  }

  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== Number(digits[9])) {
    return false;
  }

  sum = 0;
  for (let index = 0; index < 10; index += 1) {
    sum += Number(digits[index]) * (11 - index);
  }

  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;

  return secondDigit === Number(digits[10]);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const publicKey = Deno.env.get("PAYFORGE_PUBLIC_KEY");
    const secretKey = Deno.env.get("PAYFORGE_SECRET_KEY");
    if (!publicKey || !secretKey) throw new Error("PayForge credentials not configured");

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

    if (!amount || Number(amount) <= 0) {
      return new Response(JSON.stringify({ success: false, error: "Valor inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedCpf = onlyDigits(customer_cpf || "");
    if (!isValidCpf(normalizedCpf)) {
      return new Response(JSON.stringify({ success: false, error: "CPF inválido. Digite um CPF válido." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const identifier = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const callbackUrl = `${supabaseUrl}/functions/v1/payforge-webhook`;

    const orderBody = {
      identifier,
      amount: Number(amount),
      client: {
        name: String(customer_name || "Cliente").trim().slice(0, 120),
        email: String(customer_email || "cliente@email.com").trim().slice(0, 255),
        phone: onlyDigits(customer_phone || "11999999999").slice(0, 11),
        document: formatCpf(normalizedCpf),
      },
      products: [
        {
          id: String(plan_id || "plan").slice(0, 100),
          name: String(description || plan_name || "Serviço Engajar Social").trim().slice(0, 255),
          quantity: 1,
          price: Number(amount),
        },
      ],
      metadata: {
        plan_id: String(plan_id || "").slice(0, 100),
        platform: String(platform || "").slice(0, 100),
        username: String(username || "").slice(0, 100),
      },
      callbackUrl,
    };

    console.log("Creating PayForge PIX transaction", {
      identifier,
      amount: Number(amount),
      plan_id: plan_id || null,
      platform: platform || null,
    });

    const orderRes = await fetch(`${PAYFORGE_API}/gateway/pix/receive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-public-key": publicKey,
        "x-secret-key": secretKey,
      },
      body: JSON.stringify(orderBody),
    });

    const responseText = await orderRes.text();
    let orderData: Record<string, unknown> = {};

    try {
      orderData = responseText ? JSON.parse(responseText) : {};
    } catch {
      orderData = {};
    }

    console.log("PayForge create PIX response", {
      status: orderRes.status,
      contentType: orderRes.headers.get("content-type"),
      gatewayStatus: orderData?.status || null,
      errorCode: orderData?.errorCode || null,
    });

    if (!orderRes.ok) {
      const isHtmlResponse = responseText.trim().startsWith("<!doctype") || responseText.trim().startsWith("<html");
      const reason = isHtmlResponse
        ? "A PayForge bloqueou esta requisição por localização/IP do servidor. Libere o acesso da API no painel deles ou peça ao suporte a liberação do ambiente."
        : String(orderData.message || orderData.error || "Erro ao criar pedido no gateway");

      return new Response(JSON.stringify({ success: false, error: reason }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pixCode = orderData.pix?.code || null;
    const qrCodeBase64 = orderData.pix?.base64 || null;
    const payforgeTransactionId = orderData.transactionId || null;

    const { data: txRow, error: txError } = await supabase
      .from("transactions")
      .insert({
        horsepay_transaction_id: payforgeTransactionId,
        plan_id: plan_id || "unknown",
        plan_name: plan_name || "Plano",
        platform: platform || "Instagram",
        username: username || "",
        customer_name: customer_name || "Cliente",
        customer_email: customer_email || "",
        amount: amount,
        status: "pending",
        pix_code: pixCode || null,
        extras: extras || [],
      })
      .select("id")
      .single();

    if (txError) {
      console.error("Error saving transaction", txError);
    }

    if (!pixCode) {
      return new Response(
        JSON.stringify({
          success: false,
          transaction_id: txRow?.id || null,
          error: "PIX não gerado pelo gateway. Tente novamente.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: txRow?.id || null,
        pix_code: pixCode,
        qr_code_image: qrCodeBase64,
        amount,
        status: "pending",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error: unknown) {
    console.error("Error creating PIX payment", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
