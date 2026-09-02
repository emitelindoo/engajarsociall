import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAID_EVENTS = ["purchase_approved", "payment_approved", "purchase_completed"];
const FAILED_EVENTS = ["purchase_refused", "refund", "chargeback", "purchase_canceled"];
const PENDING_PAYMENT_EVENTS = ["pix_gerado", "boleto_gerado", "picpay_gerado", "openfinance_nubank_gerado"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const expectedSecret = Deno.env.get("CAKTO_WEBHOOK_SECRET");
    if (expectedSecret && body?.secret !== expectedSecret) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const event = String(body?.event || "");
    const data = body?.data || {};
    const paymentId = data?.id ? String(data.id) : null;
    const offerId = data?.offer?.id ? String(data.offer.id) : null;
    const status = PAID_EVENTS.includes(event) || data?.status === "paid" || data?.status === "approved"
      ? "paid"
      : FAILED_EVENTS.includes(event)
        ? "failed"
        : PENDING_PAYMENT_EVENTS.includes(event) || data?.status === "waiting_payment"
          ? "pending"
          : null;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
    );

    if (status && (paymentId || offerId)) {
      let update = null;
      if (paymentId) {
        update = await supabase
          .from("transactions")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("horsepay_transaction_id", paymentId);
      }

      if ((!update || update.count === 0) && offerId) {
        update = await supabase
          .from("transactions")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("cakto_offer_id", offerId)
          .eq("status", "pending");
      }

      if (update?.error) console.error("Cakto webhook update error", update.error);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Cakto webhook error", error);
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
