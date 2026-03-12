import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const INVICTUS_API_URL = "https://api.invictuspay.app.br/api/public/v1";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get('INVICTUS_PAY_API_TOKEN');
    if (!apiToken) throw new Error('INVICTUS_PAY_API_TOKEN is not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { amount, description, customer_name, customer_email, customer_cpf, customer_phone, plan_id, plan_name, platform, username, extras } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Valor inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = {
      api_token: apiToken,
      offer_hash: "i9mh7xwr5z",
      payment_method: "pix",
      customer: {
        name: customer_name || "Cliente",
        email: customer_email || "cliente@email.com",
        phone: (customer_phone || "11999999999").replace(/\D/g, ""),
        document: (customer_cpf || "00000000000").replace(/\D/g, ""),
      },
      cart: [
        {
          title: description || "Engajar Social",
          amount: Math.round(amount * 100),
          quantity: 1,
        },
      ],
    };

    console.log("Sending to InvictusPay:", JSON.stringify(body));

    const response = await fetch(`${INVICTUS_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("InvictusPay response:", JSON.stringify(data));

    if (!response.ok) {
      const reason = data.message || data.error || "Pagamento recusado";
      return new Response(JSON.stringify({ success: false, error: reason }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract PIX code and QR image from response
    const pixCode = data.pix?.qrcode || data.pix?.qr_code_text || data.pix?.copy_paste ||
      data.pix?.emv || data.pix?.pixCopiaECola || data.pixCopiaECola ||
      data.qr_code_text || data.brcode || data.emv || data.pix_code;

    const qrImage = data.pix?.qr_code_image || data.pix?.qrcode_image ||
      data.qr_code_image || data.qr_code;

    const transactionHash = data.hash || data.transaction_hash || data.id?.toString();

    // Save transaction to DB
    const { data: txRow, error: txError } = await supabase.from('transactions').insert({
      nivus_transaction_id: transactionHash || null,
      plan_id: plan_id || 'unknown',
      plan_name: plan_name || 'Plano',
      platform: platform || 'Instagram',
      username: username || '',
      customer_name: customer_name || 'Cliente',
      customer_email: customer_email || '',
      amount: amount,
      status: 'pending',
      pix_code: pixCode || null,
      extras: extras || [],
    }).select('id').single();

    if (txError) {
      console.error("Error saving transaction:", txError);
    }

    return new Response(JSON.stringify({
      success: true,
      transaction_id: txRow?.id || null,
      invictus_transaction_hash: transactionHash,
      pix_code: pixCode,
      qr_code_image: qrImage,
      amount: amount,
      status: data.status,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error creating PIX payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
