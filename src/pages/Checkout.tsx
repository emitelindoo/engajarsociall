import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanById } from "@/data/plans";
import { ArrowLeft, ShieldCheck, Lock, Loader2, User, CheckCircle2, Copy, Trash2, ShoppingCart, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { QRCodeSVG } from "qrcode.react";
import { fbEvent, fbSetUserData } from "@/lib/fbpixel";
import { useCart } from "@/contexts/CartContext";

const Checkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { items, removeItem, total, clearCart } = useCart();

  // If arriving via direct link /checkout/:planId, auto-add to cart
  const { addItem } = useCart();
  useEffect(() => {
    if (planId) {
      const plan = getPlanById(planId);
      if (plan) addItem(plan);
    }
  }, [planId]);

  const [username, setUsername] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Track InitiateCheckout
  useEffect(() => {
    if (items.length > 0) {
      fbEvent("InitiateCheckout", {
        content_name: items.map((i) => i.plan.quantity).join(", "),
        value: total,
        currency: "BRL",
      });
    }
  }, []);

  // Advanced Matching
  useEffect(() => {
    if (!customerName.trim() && !customerEmail.trim() && !username.trim()) return;
    const nameParts = customerName.trim().split(/\s+/);
    fbSetUserData({
      em: customerEmail.trim().toLowerCase() || undefined,
      fn: nameParts[0]?.toLowerCase() || undefined,
      ln: nameParts.length > 1 ? nameParts[nameParts.length - 1].toLowerCase() : undefined,
      external_id: username.replace("@", "").toLowerCase() || undefined,
    });
  }, [customerName, customerEmail, username]);

  // Poll for payment confirmation
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
        const params = new URLSearchParams({
          plan: items.map((i) => i.plan.quantity).join(" + "),
          platform: [...new Set(items.map((i) => i.plan.platform))].join(", "),
          amount: total.toString(),
          username,
          name: customerName,
          email: customerEmail,
        });
        clearCart();
        navigate(`/obrigado?${params.toString()}`);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [transactionId]);

  const isFormValid = username.trim() && customerName.trim() && customerEmail.trim() && items.length > 0;

  const handlePayment = async () => {
    if (!isFormValid) return;
    setLoading(true);

    const nameParts = customerName.trim().split(/\s+/);
    fbSetUserData({
      em: customerEmail.trim().toLowerCase(),
      fn: nameParts[0]?.toLowerCase(),
      ln: nameParts.length > 1 ? nameParts[nameParts.length - 1].toLowerCase() : undefined,
      external_id: username.replace("@", "").toLowerCase(),
    });

    try {
      const itemDescriptions = items.map(
        (i) => `${i.plan.quantity} ${i.plan.serviceType} (${i.plan.platform})`
      );

      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          amount: total,
          description: `Engajar Social: ${itemDescriptions.join(", ")} | @${username.replace("@", "")}`,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_cpf: String(Math.floor(10000000000 + Math.random() * 89999999999)),
          customer_phone: "11999999999",
          plan_id: items[0].plan.id,
          plan_name: items.map((i) => i.plan.name).join(" + "),
          platform: [...new Set(items.map((i) => i.plan.platform))].join(", "),
          username,
          extras: items.slice(1).map((i) => `${i.plan.quantity} ${i.plan.serviceType}`),
        },
      });

      if (error) throw error;
      if (data?.success === false) throw new Error(data.error || "Erro ao gerar PIX");

      if (data?.pix_code) {
        setPixCode(data.pix_code);
        setQrCodeImage(data.qr_code_image || null);
        setTransactionId(data.transaction_id || null);
        toast.success("PIX gerado com sucesso!");
      } else {
        throw new Error("Erro ao gerar PIX");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.message || "Erro ao gerar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copyPix = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (items.length === 0 && !pixCode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-foreground font-bold text-lg mb-2">Seu carrinho está vazio</p>
          <p className="text-muted-foreground text-sm mb-4">Adicione serviços para continuar</p>
          <button onClick={() => navigate("/")} className="ig-gradient-bg text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90">
            Ver Serviços
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-20 pb-10 px-4">
        <div className="container mx-auto max-w-lg">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar aos serviços
          </button>

          {/* Cart Items */}
          {!pixCode && (
            <div className="bg-card rounded-2xl border border-border p-5 card-shadow mb-4">
              <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary" /> Seus itens ({items.length})
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.plan.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{item.plan.quantity}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {item.plan.serviceType} • {item.plan.platform}
                      </p>
                    </div>
                    <span className="text-sm font-bold ig-gradient-text whitespace-nowrap">{item.plan.price}</span>
                    <button onClick={() => removeItem(item.plan.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/#precos")} className="w-full mt-3 py-2 text-xs text-primary font-semibold hover:underline">
                + Adicionar mais serviços
              </button>
            </div>
          )}

          {/* Customer info */}
          {!pixCode && (
            <div className="bg-card rounded-2xl border border-border p-5 card-shadow mb-4">
              <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Seus dados
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Seu @ da rede social</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@seuusuario"
                    className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                </div>
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
              </div>
              <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Nunca pedimos sua senha. Dados protegidos e criptografados.
              </p>
            </div>
          )}

          {/* PIX Result */}
          {pixCode && (
            <div className="bg-card rounded-2xl border border-primary/30 p-5 card-shadow mb-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">PIX Gerado!</h3>
              </div>
              <div className="flex justify-center mb-4">
                <div className="bg-white p-3 rounded-xl">
                  <QRCodeSVG value={pixCode} size={200} level="M" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Código PIX Copia e Cola:</p>
              <div className="bg-muted rounded-xl p-3 mb-3 break-all">
                <p className="text-xs text-foreground font-mono leading-relaxed">{pixCode}</p>
              </div>
              <button onClick={copyPix}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  copied ? "bg-green-500 text-white" : "ig-gradient-bg text-primary-foreground hover:opacity-90"
                }`}>
                {copied ? <><CheckCircle2 className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar Código PIX</>}
              </button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Abra o app do seu banco, escolha pagar com PIX e cole o código acima.
              </p>
            </div>
          )}

          {/* Total & CTA */}
          {!pixCode && (
            <div className="bg-card rounded-2xl border border-border p-5 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground text-sm font-medium">Total</span>
                <span className="text-2xl font-bold ig-gradient-text">
                  R${total.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <button onClick={handlePayment} disabled={!isFormValid || loading}
                className="w-full ig-gradient-bg text-primary-foreground py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Gerando PIX...</> : <><Lock className="w-4 h-4" /> Finalizar Compra via PIX</>}
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
