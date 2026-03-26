import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    console.log("NivusPay webhook received:", JSON.stringify(payload));

    // NivusPay postback format: { type: "transaction", objectId: "...", data: { id, status, ... } }
    const transactionData = payload.data;
    if (!transactionData || !transactionData.id) {
      console.error("No transaction data in webhook payload");
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const nivusId = transactionData.id.toString();
    const nivusStatus = transactionData.status;

    // Map NivusPay statuses to our internal statuses
    let mappedStatus: string;
    switch (nivusStatus) {
      case "paid":
      case "approved":
        mappedStatus = "paid";
        break;
      case "refused":
      case "cancelled":
      case "chargeback":
        mappedStatus = "failed";
        break;
      case "refunded":
        mappedStatus = "refunded";
        break;
      case "waiting_payment":
      case "pending":
      default:
        mappedStatus = "pending";
        break;
    }

    console.log(`Updating transaction nivus_id=${nivusId} to status: ${mappedStatus}`);

    const { error } = await supabase
      .from("transactions")
      .update({ status: mappedStatus })
      .eq("horsepay_transaction_id", nivusId);

    if (error) {
      console.error("Error updating transaction:", error);
    }

    return new Response(JSON.stringify({ received: true, status: mappedStatus }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
