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

    const { amount, description, customer_name, customer_email } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Valor inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Base64 encode credentials for Basic Auth
    const credentials = btoa(`${secretKey}:${companyId}`);

    const response = await fetch(`${NIVUS_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        payment_method: 'pix',
        description: description || 'Engajar Social - Seguidores',
        customer: {
          name: customer_name || 'Cliente',
          email: customer_email || '',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Nivus Pay API error:', JSON.stringify(data));
      throw new Error(`Nivus Pay API error [${response.status}]: ${JSON.stringify(data)}`);
    }

    // Return the PIX data (qr_code, pix_copy_paste, etc.)
    return new Response(JSON.stringify({
      success: true,
      transaction_id: data.id || data.transaction_id,
      pix_code: data.pix?.qr_code_text || data.pix?.copy_paste || data.pix_code || data.qr_code_text || data.copy_paste || data.pix_qrcode,
      qr_code_image: data.pix?.qr_code_image || data.pix?.qr_code || data.qr_code_image || data.qr_code,
      amount: amount,
      status: data.status,
      raw: data, // Include raw response for debugging
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
