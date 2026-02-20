import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanById, PlanData } from "@/data/plans";
import { ArrowLeft, ShieldCheck, Check, Heart, Eye, MessageCircle, Zap, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";

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
];

const Checkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const plan = getPlanById(planId || "");

  const [username, setUsername] = useState("");
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);

  const toggleBump = (id: string) => {
    setSelectedBumps((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const total = useMemo(() => {
    if (!plan) return 0;
    const bumpsTotal = orderBumps
      .filter((b) => selectedBumps.includes(b.id))
      .reduce((sum, b) => sum + b.price, 0);
    return plan.priceNum + bumpsTotal;
  }, [plan, selectedBumps]);

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
          {/* Back */}
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

          {/* Username input */}
          <div className="bg-card rounded-2xl border border-border p-5 card-shadow mb-4">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Seu @ do {plan.platform}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@seuusuario"
              className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Nunca pedimos sua senha. Apenas o @ público.
            </p>
          </div>

          {/* Order Bumps */}
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

          {/* Total & CTA */}
          <div className="bg-card rounded-2xl border border-border p-5 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium">Total</span>
              <span className="text-2xl font-bold ig-gradient-text">
                R${total.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <button
              disabled={!username.trim()}
              className="w-full ig-gradient-bg text-primary-foreground py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Finalizar Compra via PIX
            </button>

            <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Pagamento Seguro</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Entrega Imediata</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
