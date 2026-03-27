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
    console.log("PayForge webhook received:", JSON.stringify(payload));

    // PayForge webhook format:
    // { event: "TRANSACTION_PAID", transaction: { id, identifier, status, ... }, ... }
    const event = payload.event;
    const transactionData = payload.transaction;

    if (!transactionData || !transactionData.id) {
      console.error("No transaction data in webhook payload");
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payforgeId = transactionData.id.toString();
    const txStatus = transactionData.status;

    // Map PayForge statuses to internal statuses
    let mappedStatus: string;
    switch (txStatus) {
      case "COMPLETED":
        mappedStatus = "paid";
        break;
      case "FAILED":
      case "CANCELED":
        mappedStatus = "failed";
        break;
      case "REFUNDED":
      case "CHARGED_BACK":
        mappedStatus = "refunded";
        break;
      case "PENDING":
      default:
        mappedStatus = "pending";
        break;
    }

    // Also map by event name as fallback
    if (event === "TRANSACTION_PAID" && mappedStatus !== "paid") {
      mappedStatus = "paid";
    } else if (event === "TRANSACTION_CANCELED" && mappedStatus === "pending") {
      mappedStatus = "failed";
    } else if (event === "TRANSACTION_REFUNDED") {
      mappedStatus = "refunded";
    }

    console.log(`Updating transaction payforge_id=${payforgeId} to status: ${mappedStatus} (event: ${event})`);

    const { error } = await supabase
      .from("transactions")
      .update({ status: mappedStatus })
      .eq("horsepay_transaction_id", payforgeId);

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
