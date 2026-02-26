import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanById } from "@/data/plans";
import { ArrowLeft, ShieldCheck, Check, Heart, Eye, MessageCircle, Zap, Lock, BadgeCheck, Copy, CheckCircle2, Loader2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { QRCodeSVG } from "qrcode.react";
import { fbEvent, fbSetUserData } from "@/lib/fbpixel";

interface OrderBump {
  id: string;
  title: string;
  desc: string;
  price: number;
  priceLabel: string;
  icon: React.ReactNode;
}

const orderBumps: OrderBump[] = [
  {
    id: "curtidas",
    title: "Pacote de Curtidas",
    desc: "+1.000 curtidas distribuídas nos seus últimos posts",
    price: 9.9,
    priceLabel: "R$9,90",
    icon: <Heart className="w-5 h-5 text-primary" />,
  },
  {
    id: "stories",
    title: "Visualizações de Stories",
    desc: "+5.000 views nos seus próximos 10 stories",
    price: 7.9,
    priceLabel: "R$7,90",
    icon: <Eye className="w-5 h-5 text-primary" />,
  },
  {
    id: "comentarios",
    title: "Comentários Brasileiros",
    desc: "+50 comentários positivos e relevantes nos seus posts",
    price: 14.9,
    priceLabel: "R$14,90",
    icon: <MessageCircle className="w-5 h-5 text-primary" />,
  },
  {
    id: "selo",
    title: "Selo de Verificação ✓",
    desc: "Selo azul de verificado no seu perfil — mais credibilidade e autoridade",
    price: 29.9,
    priceLabel: "R$29,90",
    icon: <BadgeCheck className="w-5 h-5 text-[hsl(210,90%,55%)]" />,
  },
];

const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const Checkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const plan = getPlanById(planId || "");

  const [username, setUsername] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const toggleBump = (id: string) => {
    setSelectedBumps((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // Track InitiateCheckout when page loads
  useEffect(() => {
    if (plan) {
      fbEvent("InitiateCheckout", {
        content_name: plan.name,
        content_category: plan.platform,
        value: plan.priceNum,
        currency: "BRL",
      });
    }
  }, [plan]);

  // Send Advanced Matching data as soon as user fills form fields
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

  const total = useMemo(() => {
    if (!plan) return 0;
    const bumpsTotal = orderBumps
      .filter((b) => selectedBumps.includes(b.id))
      .reduce((sum, b) => sum + b.price, 0);
    return plan.priceNum + bumpsTotal;
  }, [plan, selectedBumps]);

  // Poll for payment confirmation
  useEffect(() => {
    if (!transactionId || !plan) return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('transactions')
        .select('status')
        .eq('id', transactionId)
        .single();

      if (data?.status === 'paid') {
        clearInterval(interval);
        const params = new URLSearchParams({
          plan: plan.name,
          platform: plan.platform,
          amount: total.toString(),
          username: username,
          name: customerName,
          email: customerEmail,
        });
        navigate(`/obrigado?${params.toString()}`);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [transactionId, plan, total, username, navigate]);


  const isFormValid = username.trim() && customerName.trim() && customerEmail.trim();

  const handlePayment = async () => {
    if (!isFormValid || !plan) return;
    setLoading(true);

    // Advanced Matching: send user data to Meta Pixel
    const nameParts = customerName.trim().split(/\s+/);
    fbSetUserData({
      em: customerEmail.trim().toLowerCase(),
      fn: nameParts[0]?.toLowerCase(),
      ln: nameParts.length > 1 ? nameParts[nameParts.length - 1].toLowerCase() : undefined,
      external_id: username.replace("@", "").toLowerCase(),
    });

    try {
      const selectedExtras = orderBumps
        .filter((b) => selectedBumps.includes(b.id))
        .map((b) => b.title);

      const items = [
        `${plan.name} - ${plan.followers} (${plan.platform})`,
        ...selectedExtras,
      ];

      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          amount: total,
          description: `Engajar Social: ${items.join(", ")} | @${username.replace("@", "")}`,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_cpf: String(Math.floor(10000000000 + Math.random() * 89999999999)),
          customer_phone: "11999999999",
          plan_id: plan.id,
          plan_name: plan.name,
          platform: plan.platform,
          username: username,
          extras: selectedExtras,
        },
      });

      if (error) throw error;

      if (data?.success === false) {
        throw new Error(data.error || "Erro ao gerar PIX");
      }

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

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground font-bold text-lg mb-4">Plano não encontrado</p>
          <button onClick={() => navigate("/")} className="text-primary font-semibold underline">Voltar aos planos</button>
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
            <ArrowLeft className="w-4 h-4" /> Voltar aos planos
          </button>

          {/* Plan summary */}
          <div className="bg-card rounded-2xl border border-border p-5 card-shadow mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-bold text-foreground text-lg">{plan.name}</h2>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{plan.platform}</span>
              </div>
              <div className="text-right">
                <span className="text-xs line-through text-muted-foreground block">{plan.originalPrice}</span>
                <span className="text-xl font-bold ig-gradient-text">{plan.price}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="font-semibold">{plan.followers}</span>
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-card rounded-2xl border border-border p-5 card-shadow mb-4">
            <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Seus dados
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Seu @ do {plan.platform}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@seuusuario"
                  className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Nunca pedimos sua senha. Dados protegidos e criptografados.
            </p>
          </div>

          {/* Order Bumps */}
          {!pixCode && (
            <div className="bg-card rounded-2xl border border-border p-5 card-shadow mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-foreground text-sm">Turbine seus resultados!</h3>
              </div>
              <div className="space-y-3">
                {orderBumps.map((bump) => {
                  const selected = selectedBumps.includes(bump.id);
                  return (
                    <button
                      key={bump.id}
                      onClick={() => toggleBump(bump.id)}
                      className={`w-full text-left rounded-xl border p-4 transition-all ${
                        selected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          selected ? "bg-primary border-primary" : "border-border"
                        }`}>
                          {selected && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {bump.icon}
                              <span className="font-semibold text-foreground text-sm">{bump.title}</span>
                            </div>
                            <span className="text-sm font-bold ig-gradient-text">+{bump.priceLabel}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{bump.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
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

              <button
                onClick={copyPix}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  copied
                    ? "bg-green-500 text-white"
                    : "ig-gradient-bg text-primary-foreground hover:opacity-90"
                }`}
              >
                {copied ? (
                  <><CheckCircle2 className="w-4 h-4" /> Copiado!</>
                ) : (
                  <><Copy className="w-4 h-4" /> Copiar Código PIX</>
                )}
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

              <button
                onClick={handlePayment}
                disabled={!isFormValid || loading}
                className="w-full ig-gradient-bg text-primary-foreground py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Gerando PIX...</>
                ) : (
                  <><Lock className="w-4 h-4" /> Finalizar Compra via PIX</>
                )}
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
