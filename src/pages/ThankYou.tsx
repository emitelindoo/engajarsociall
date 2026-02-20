import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, PartyPopper, Zap, ShieldCheck } from "lucide-react";
import { fbEvent } from "@/lib/fbpixel";
import Navbar from "@/components/Navbar";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planName = searchParams.get("plan") || "Plano";
  const platform = searchParams.get("platform") || "Instagram";
  const amount = searchParams.get("amount") || "0";
  const username = searchParams.get("username") || "";

  useEffect(() => {
    // Fire Purchase event ONLY here, after confirmed payment
    fbEvent("Purchase", {
      content_name: planName,
      content_category: platform,
      value: parseFloat(amount),
      currency: "BRL",
    });
  }, [planName, platform, amount]);

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-lg text-center">
          <div className="bg-card rounded-2xl border border-primary/30 p-8 card-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
              Pagamento Confirmado! <PartyPopper className="w-6 h-6 text-accent" />
            </h1>

            <p className="text-muted-foreground mb-6">
              Seu pedido foi aprovado e já estamos processando a entrega.
            </p>

            <div className="bg-muted rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plano:</span>
                <span className="font-semibold text-foreground">{planName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plataforma:</span>
                <span className="font-semibold text-foreground">{platform}</span>
              </div>
              {username && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Perfil:</span>
                  <span className="font-semibold text-foreground">@{username.replace("@", "")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-semibold ig-gradient-text">R${parseFloat(amount).toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mb-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-accent" /> Entrega em até 24h</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> 100% Seguro</span>
            </div>

            <button
              onClick={() => navigate("/")}
              className="ig-gradient-bg text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
