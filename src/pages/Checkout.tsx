import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanById } from "@/data/plans";
import { ArrowLeft, ShieldCheck, Lock, Loader2, CheckCircle2, Trash2, ShoppingCart, Zap, Link, AtSign, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { fbEvent, fbSetUserData } from "@/lib/fbpixel";
import { useCart, getTargetLabel } from "@/contexts/CartContext";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const formatCpf = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const isValidCpf = (value: string) => {
  const digits = onlyDigits(value);

  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    sum += Number(digits[index]) * (10 - index);
  }

  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== Number(digits[9])) return false;

  sum = 0;
  for (let index = 0; index < 10; index += 1) {
    sum += Number(digits[index]) * (11 - index);
  }

  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;

  return secondDigit === Number(digits[10]);
};

const Checkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { items, removeItem, updateTarget, total, clearCart, addItem } = useCart();

  useEffect(() => {
    if (planId) {
      const plan = getPlanById(planId);
      if (plan) addItem(plan);
    }
  }, [planId]);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCpf, setCustomerCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length > 0) {
      fbEvent("InitiateCheckout", {
        content_name: items.map((i) => i.plan.quantity).join(", "),
        content_ids: items.map((i) => i.plan.id),
        content_type: "product",
        num_items: items.length,
        value: total,
        currency: "BRL",
      });
    }
  }, []);

  useEffect(() => {
    if (!customerName.trim() && !customerEmail.trim()) return;
    const nameParts = customerName.trim().split(/\s+/);
    fbSetUserData({
      em: customerEmail.trim().toLowerCase() || undefined,
      fn: nameParts[0]?.toLowerCase() || undefined,
      ln: nameParts.length > 1 ? nameParts[nameParts.length - 1].toLowerCase() : undefined,
    });
  }, [customerName, customerEmail]);

  useEffect(() => {
    if (!transactionId) return;
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("transactions")
        .select("status")
        .eq("id", transactionId)
        .single();

      if (data?.status === "paid") {
        clearInterval(interval);
        const firstTarget = items[0]?.target || "";
        const params = new URLSearchParams({
          plan: items.map((i) => i.plan.quantity).join(" + "),
          platform: [...new Set(items.map((i) => i.plan.platform))].join(", "),
          amount: total.toString(),
          username: firstTarget,
          name: customerName,
          email: customerEmail,
        });
        clearCart();
        navigate(`/obrigado?${params.toString()}`);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [transactionId]);

  const cpfDigits = onlyDigits(customerCpf);
  const isCpfValid = cpfDigits.length === 11 && isValidCpf(cpfDigits);
  const allTargetsFilled = items.every((i) => i.target.trim().length > 0);
  const isFormValid = Boolean(customerName.trim() && customerEmail.trim() && isCpfValid && items.length > 0 && allTargetsFilled);

  const handlePayment = async () => {
    if (!isFormValid) return;
    setLoading(true);

    const nameParts = customerName.trim().split(/\s+/);
    fbSetUserData({
      em: customerEmail.trim().toLowerCase(),
      fn: nameParts[0]?.toLowerCase(),
      ln: nameParts.length > 1 ? nameParts[nameParts.length - 1].toLowerCase() : undefined,
    });

    try {
      if (!isCpfValid) {
        throw new Error("Digite um CPF válido para continuar.");
      }

      const itemDescriptions = items.map(
        (i) => `${i.plan.quantity} ${i.plan.serviceType} (${i.plan.platform}) → ${i.target}`
      );
      const firstTarget = items[0]?.target || "";

      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          amount: total,
          description: `Engajar Social: ${itemDescriptions.join(", ")}`,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          customer_cpf: cpfDigits,
          customer_phone: "11999999999",
          plan_id: items[0].plan.id,
          plan_name: items.map((i) => i.plan.name).join(" + "),
          platform: [...new Set(items.map((i) => i.plan.platform))].join(", "),
          username: firstTarget.replace("@", ""),
          extras: items.slice(1).map((i) => `${i.plan.quantity} ${i.plan.serviceType} → ${i.target}`),
        },
      });

      if (error) {
        let backendMessage: string | null = null;

        const errorWithContext = error as { context?: Response; message?: string };
        if (errorWithContext.context) {
          try {
            const errorBody = await errorWithContext.context.json();
            backendMessage = errorBody?.error || null;
          } catch {
            backendMessage = null;
          }
        }

        throw new Error(backendMessage || errorWithContext.message || "Erro ao gerar checkout");
      }
      if (data?.success === false) throw new Error(data.error || "Erro ao gerar checkout");

      if (data?.checkout_url) {
        setCheckoutUrl(data.checkout_url);
        setTransactionId(data.transaction_id || null);
        toast.success("Checkout gerado! Escolha como pagar.");
      } else {
        throw new Error(data?.error || "Erro ao gerar checkout");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.message || "Erro ao gerar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const openCheckout = () => {
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (items.length === 0 && !checkoutUrl) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-foreground font-bold text-lg mb-2">Seu carrinho está vazio</p>
          <p className="text-muted-foreground text-sm mb-4">Adicione serviços para continuar</p>
          <button onClick={() => navigate("/")} className="brand-gradient-bg text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90">
            Ver Serviços
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-10 px-4">
        <div className="container mx-auto max-w-lg">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar aos serviços
          </button>

          {/* Cart Items with per-item targets */}
          {!checkoutUrl && (
            <div className="bg-card rounded-2xl border border-border p-5 card-shadow mb-4">
              <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary" /> Seus itens ({items.length})
              </h3>
              <div className="space-y-4">
                {items.map((item) => {
                  const { label, placeholder } = getTargetLabel(item.plan.serviceType);
                  const isLink = item.plan.serviceType !== "Seguidores";
                  return (
                    <div key={item.plan.id} className="p-4 rounded-xl border border-border bg-secondary/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{item.plan.quantity}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {item.plan.serviceType} • {item.plan.platform}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-accent whitespace-nowrap">{item.plan.price}</span>
                        <button onClick={() => removeItem(item.plan.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Target input */}
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                          {isLink ? <Link className="w-3 h-3" /> : <AtSign className="w-3 h-3" />}
                          {label}
                        </label>
                        <input
                          type={isLink ? "url" : "text"}
                          value={item.target}
                          onChange={(e) => updateTarget(item.plan.id, e.target.value)}
                          placeholder={placeholder}
                          className="w-full rounded-xl bg-muted border border-border px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => navigate("/#precos")} className="w-full mt-3 py-2 text-xs text-primary font-semibold hover:underline">
                + Adicionar mais serviços
              </button>
            </div>
          )}

          {/* Customer info */}
          {!checkoutUrl && (
            <div className="bg-card rounded-2xl border border-border p-5 card-shadow mb-4">
              <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2">
                📋 Seus dados
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Nome completo</label>
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Seu nome completo"
                    className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">E-mail</label>
                  <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="seu@email.com"
                    className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">CPF</label>
                  <input type="text" value={customerCpf} onChange={(e) => setCustomerCpf(formatCpf(e.target.value))} placeholder="000.000.000-00" maxLength={14}
                    className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                  {cpfDigits.length === 11 && !isCpfValid && (
                    <p className="text-xs text-destructive mt-1">Digite um CPF válido.</p>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Nunca pedimos sua senha. Dados protegidos e criptografados.
              </p>
            </div>
          )}

          {/* Checkout Result */}
          {checkoutUrl && (
            <div className="bg-card rounded-2xl border border-primary/30 p-4 card-shadow mb-4">
              <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" /> Checkout pronto! 🚀
              </h3>

              <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl px-3 py-2.5 mb-3">
                <p className="text-[10px] uppercase tracking-wider font-bold text-primary mb-1.5">
                  ✨ Você está adquirindo
                </p>
                <ul className="space-y-0.5 mb-2">
                  {items.map((it) => (
                    <li key={it.plan.id} className="text-xs text-foreground leading-snug">
                      <CheckCircle2 className="w-3 h-3 text-accent inline mr-1 -mt-0.5" />
                      <strong>{it.plan.quantity}</strong>
                      <span className="text-muted-foreground"> · {it.plan.platform}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-1.5 border-t border-border/50">
                  <span className="text-[11px] text-muted-foreground">Total</span>
                  <span className="text-base font-bold text-accent">R${total.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3">
                Você será redirecionado para o checkout seguro da Cakto, onde pode pagar com PIX, cartão, PicPay, Apple Pay, Google Pay e mais.
              </p>

              <button onClick={openCheckout}
                className="w-full brand-gradient-bg text-primary-foreground py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" /> Pagar agora
              </button>

              <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-accent" /> Seguro</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-accent" /> Entrega na hora</span>
                <span>•</span>
                <span>Sem senha</span>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 text-center">
                <p className="text-[11px] text-muted-foreground mb-2">Já pagou? Aguardamos a confirmação automaticamente.</p>
                <div className="flex items-center justify-center gap-2 text-[11px] text-accent">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Aguardando confirmação...
                </div>
              </div>
            </div>
          )}

          {/* Total & CTA */}
          {!checkoutUrl && (
            <div className="bg-card rounded-2xl border border-border p-5 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground text-sm font-medium">Total</span>
                <span className="text-2xl font-bold text-accent">
                  R${total.toFixed(2).replace(".", ",")}
                </span>
              </div>
              {!allTargetsFilled && (
                <p className="text-xs text-destructive mb-3 text-center">Preencha o @ ou link de cada item acima</p>
              )}
              {!isCpfValid && cpfDigits.length === 11 && (
                <p className="text-xs text-destructive mb-3 text-center">Digite um CPF válido para continuar</p>
              )}
              <button onClick={handlePayment} disabled={!isFormValid || loading}
                className="w-full brand-gradient-bg text-primary-foreground py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Gerando checkout...</> : <><Lock className="w-4 h-4" /> Finalizar Compra</>}
              </button>
              <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Pagamento Seguro</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Entrega Imediata</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
