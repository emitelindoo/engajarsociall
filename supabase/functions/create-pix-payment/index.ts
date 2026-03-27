import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PAYFORGE_API = "https://dashboard.payforge.group/api/v1";

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

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: "Valor inválido" }), {
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
        name: customer_name || "Cliente",
        email: customer_email || "cliente@email.com",
        phone: (customer_phone || "11999999999").replace(/\D/g, ""),
        document: formatCpf((customer_cpf || "00000000000").replace(/\D/g, "")),
      },
      products: [
        {
          id: plan_id || "plan",
          name: description || plan_name || "Serviço Engajar Social",
          quantity: 1,
          price: Number(amount),
        },
      ],
      metadata: { plan_id, platform, username },
      callbackUrl,
    };

    console.log("Sending to PayForge:", JSON.stringify(orderBody));

    const orderRes = await fetch(`${PAYFORGE_API}/gateway/pix/receive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-public-key": publicKey,
        "x-secret-key": secretKey,
      },
      body: JSON.stringify(orderBody),
    });

    const orderData = await orderRes.json();
    console.log("PayForge response:", JSON.stringify(orderData));

    if (!orderRes.ok) {
      const reason = orderData.message || orderData.error || "Erro ao criar pedido no gateway";
      return new Response(JSON.stringify({ success: false, error: reason }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pixCode = orderData.pix?.code || null;
    const qrCodeBase64 = orderData.pix?.base64 || null;
    const payforgeTransactionId = orderData.transactionId || null;

    // Save transaction to DB
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
        qr_code_image: qrCodeBase64,
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
