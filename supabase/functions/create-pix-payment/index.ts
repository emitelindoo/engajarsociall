import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const NIVUS_API_URL = "https://api.nivuspay.com.br/functions/v1";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const secretKey = Deno.env.get('NIVUS_PAY_API_KEY');
    if (!secretKey) {
      throw new Error('NIVUS_PAY_API_KEY is not configured');
    }

    const companyId = Deno.env.get('NIVUS_PAY_COMPANY_ID');
    if (!companyId) {
      throw new Error('NIVUS_PAY_COMPANY_ID is not configured');
    }

    const { amount, description, customer_name, customer_email, customer_cpf } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Valor inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const credentials = btoa(`${secretKey}:${companyId}`);

    const body = {
      amount: Math.round(amount * 100),
      paymentMethod: "pix",
      customer: {
        name: customer_name || "Cliente",
        email: customer_email || "cliente@email.com",
        document: {
          number: (customer_cpf || "00000000000").replace(/\D/g, ""),
          type: "CPF",
        },
      },
      items: [
        {
          title: description || "Engajar Social",
          unitPrice: Math.round(amount * 100),
          quantity: 1,
          tangible: false,
        },
      ],
    };

    console.log("Sending to Nivus Pay:", JSON.stringify(body));

    const response = await fetch(`${NIVUS_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Nivus Pay response:", JSON.stringify(data));

    if (data.status === "refused" || (!response.ok && response.status !== 200)) {
      console.error('Nivus Pay refused/error:', JSON.stringify(data));
      const reason = data.refusedReason?.description || data.error || "Pagamento recusado";
      return new Response(JSON.stringify({ success: false, error: reason }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract PIX code from response
    const pixCode = data.pix?.qrcode || data.pix?.qr_code_text || data.pix?.copy_paste ||
      data.pix?.emv || data.pix?.pixCopiaECola || data.pixCopiaECola ||
      data.qr_code_text || data.brcode || data.emv;

    const qrImage = data.pix?.qr_code_image || data.pix?.qrcode_image ||
      data.pix?.qr_code || data.qr_code_image || data.qr_code;

    return new Response(JSON.stringify({
      success: true,
      transaction_id: data.id,
      pix_code: pixCode,
      qr_code_image: qrImage,
      amount: amount,
      status: data.status,
      raw: data,
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
