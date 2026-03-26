import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const NIVUSPAY_API = "https://api.nivuspayments.com.br/v1";

function getNivusAuthHeader(): string {
  const publicKey = Deno.env.get("NIVUSPAY_PUBLIC_KEY");
  const secretKey = Deno.env.get("NIVUSPAY_SECRET_KEY");
  if (!publicKey || !secretKey) throw new Error("NivusPay credentials not configured");

  const encoded = btoa(`${publicKey}:${secretKey}`);
  return `Basic ${encoded}`;
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
      customer_cpf,
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

    const authHeader = getNivusAuthHeader();
    const callbackUrl = `${supabaseUrl}/functions/v1/nivuspay-webhook`;
    const externalRef = crypto.randomUUID();

    // NivusPay expects amount in centavos (e.g. 100 = R$1,00)
    const amountInCents = Math.round(amount * 100);

    const orderBody = {
      amount: amountInCents,
      paymentMethod: "pix",
      pix: {
        expirationDate: new Date(Date.now() + 30 * 60 * 1000).toISOString().split("T")[0], // 30 min expiry
      },
      items: [
        {
          title: description || plan_name || "Serviço Engajar Social",
          unitPrice: amountInCents,
          quantity: 1,
          tangible: false,
        },
      ],
      customer: {
        name: customer_name || "Cliente",
        email: customer_email || "cliente@email.com",
        phone: (customer_phone || "11999999999").replace(/\D/g, ""),
        document: {
          type: "cpf",
          number: (customer_cpf || "00000000000").replace(/\D/g, ""),
        },
      },
      postbackUrl: callbackUrl,
      externalRef: externalRef,
      metadata: JSON.stringify({ plan_id, platform, username }),
    };

    console.log("Sending to NivusPay:", JSON.stringify(orderBody));

    const orderRes = await fetch(`${NIVUSPAY_API}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        Accept: "application/json",
      },
      body: JSON.stringify(orderBody),
    });

    const orderData = await orderRes.json();
    console.log("NivusPay response:", JSON.stringify(orderData));

    if (!orderRes.ok) {
      const reason = orderData.message || orderData.error || "Erro ao criar pedido no gateway";
      return new Response(JSON.stringify({ success: false, error: reason }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // NivusPay PIX response: pix.qrcode contains the copia-e-cola code
    const pixCode = orderData.pix?.qrcode || null;
    const nivusTransactionId = orderData.id?.toString() || null;

    // Save transaction to DB
    const { data: txRow, error: txError } = await supabase
      .from("transactions")
      .insert({
        horsepay_transaction_id: nivusTransactionId,
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
        qr_code_image: null, // NivusPay doesn't return base64 QR, we generate on frontend
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
