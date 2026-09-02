import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAID_EVENTS = ["purchase_approved", "payment_approved", "purchase_completed"];
const FAILED_EVENTS = ["purchase_refused", "refund", "chargeback", "purchase_canceled"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const expectedSecret = Deno.env.get("CAKTO_WEBHOOK_SECRET");

    if (expectedSecret && body?.secret !== expectedSecret) {
      console.warn("Cakto webhook: invalid secret");
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const event = String(body?.event || "");
    const data = body?.data || {};
    const paymentId = data?.id ? String(data.id) : null;

    console.log("Cakto webhook received", { event, paymentId, status: data?.status || null });

    let status: string | null = null;
    if (PAID_EVENTS.includes(event) || data?.status === "paid" || data?.status === "approved") status = "paid";
    else if (FAILED_EVENTS.includes(event)) status = "failed";

    if (status && paymentId) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );

      const { error } = await supabase
        .from("transactions")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("horsepay_transaction_id", paymentId);

      if (error) console.error("Cakto webhook: update error", error);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Cakto webhook error", err);
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
