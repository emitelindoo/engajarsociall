import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    console.log("Webhook received:", JSON.stringify(payload));

    // InvictusPay webhook payload: { transaction_hash, status, amount, payment_method, paid_at }
    const transactionHash = payload.transaction_hash || payload.hash || payload.id?.toString();
    const newStatus = payload.status;

    if (!transactionHash) {
      console.error("No transaction hash in webhook payload");
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Map InvictusPay statuses
    let mappedStatus = 'pending';
    const statusLower = (newStatus || '').toLowerCase();
    if (statusLower === 'paid' || statusLower === 'approved' || statusLower === 'captured') {
      mappedStatus = 'paid';
    } else if (statusLower === 'refused' || statusLower === 'refunded' || statusLower === 'cancelled' || statusLower === 'canceled' || statusLower === 'chargeback') {
      mappedStatus = 'failed';
    } else if (statusLower === 'waiting_payment' || statusLower === 'pending') {
      mappedStatus = 'pending';
    }

    console.log(`Updating transaction ${transactionHash} to status: ${mappedStatus}`);

    const { error } = await supabase
      .from('transactions')
      .update({ status: mappedStatus })
      .eq('nivus_transaction_id', transactionHash);

    if (error) {
      console.error("Error updating transaction:", error);
    }

    return new Response(JSON.stringify({ received: true, status: mappedStatus }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
