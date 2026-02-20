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

    // Nivus Pay sends transaction updates - extract the transaction ID and status
    // payload.id is the webhook event ID, payload.data.id is the actual transaction ID
    const nivusId = payload.data?.id?.toString() || payload.objectId?.toString() || payload.transaction_id?.toString();
    const newStatus = payload.status || payload.current_status || payload.data?.status;

    if (!nivusId) {
      console.error("No transaction ID in webhook payload");
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Map Nivus Pay statuses to our statuses
    let mappedStatus = 'pending';
    const statusLower = (newStatus || '').toLowerCase();
    if (statusLower === 'paid' || statusLower === 'approved' || statusLower === 'captured') {
      mappedStatus = 'paid';
    } else if (statusLower === 'refused' || statusLower === 'refunded' || statusLower === 'cancelled' || statusLower === 'canceled') {
      mappedStatus = 'failed';
    } else if (statusLower === 'waiting_payment' || statusLower === 'pending') {
      mappedStatus = 'pending';
    }

    console.log(`Updating transaction ${nivusId} to status: ${mappedStatus}`);

    const { error } = await supabase
      .from('transactions')
      .update({ status: mappedStatus })
      .eq('nivus_transaction_id', nivusId);

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
