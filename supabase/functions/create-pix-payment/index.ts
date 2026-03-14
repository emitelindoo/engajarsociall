import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const HORSEPAY_API = "https://api.horsepay.io";

async function getAccessToken(): Promise<string> {
  const clientKey = Deno.env.get("HORSEPAY_CLIENT_KEY");
  const clientSecret = Deno.env.get("HORSEPAY_CLIENT_SECRET");
  if (!clientKey || !clientSecret) throw new Error("HorsePay credentials not configured");

  const res = await fetch(`${HORSEPAY_API}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_key: clientKey, client_secret: clientSecret }),
  });

  const data = await res.json();
  console.log("HorsePay auth response status:", res.status);

  if (!res.ok || !data.access_token) {
    throw new Error(data.message || data.error || "Falha na autenticação HorsePay");
  }

  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      amount,
      description,
      customer_name,
      customer_email,
      customer_phone,
      plan_id,
      plan_name,
      platform,
      username,
      extras,
    } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: "Valor inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Authenticate with HorsePay
    const accessToken = await getAccessToken();

    // 2. Build the webhook callback URL
    const callbackUrl = `${supabaseUrl}/functions/v1/horsepay-webhook`;

    // 3. Create a unique reference to link callback to our DB
    const clientReferenceId = crypto.randomUUID();

    // 4. Create order on HorsePay
    const orderBody = {
      payer_name: customer_name || "Cliente",
      amount: amount, // HorsePay expects value in reais (not cents)
      callback_url: callbackUrl,
      client_reference_id: clientReferenceId,
      phone: (customer_phone || "11999999999").replace(/\D/g, ""),
    };

    console.log("Sending to HorsePay:", JSON.stringify(orderBody));

    const orderRes = await fetch(`${HORSEPAY_API}/transaction/neworder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderBody),
    });

    const orderData = await orderRes.json();
    console.log("HorsePay response:", JSON.stringify(orderData));

    if (!orderRes.ok) {
      const reason = orderData.message || orderData.error || "Erro ao criar pedido no gateway";
      return new Response(JSON.stringify({ success: false, error: reason }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // HorsePay response: { copy_past, external_id, payer_name, payment (base64 QR), status }
    const pixCode = orderData.copy_past || orderData.copy_paste || null;
    const qrImage = orderData.payment || null; // base64 data URI
    const externalId = orderData.external_id?.toString() || null;

    // 5. Save transaction to DB
    const { data: txRow, error: txError } = await supabase
      .from("transactions")
      .insert({
        nivus_transaction_id: externalId,
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
      console.error("Error saving transaction:", txError);
    }

    // Also store client_reference_id mapping so the webhook can find this tx
    // We'll use the nivus_transaction_id field to store external_id for lookup

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
        qr_code_image: qrImage,
        amount: amount,
        status: "pending",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error: unknown) {
    console.error("Error creating PIX payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
