import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanById } from "@/data/plans";
import { ArrowLeft, ShieldCheck, ShoppingCart, Zap, Trash2, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { fbEvent } from "@/lib/fbpixel";
import { useCart } from "@/contexts/CartContext";
import { openWhatsAppOrder } from "@/lib/whatsapp";

const Checkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { items, removeItem, total, addItem } = useCart();

  useEffect(() => {
    if (planId) {
      const plan = getPlanById(planId);
      if (plan) addItem(plan);
    }
  }, [planId]);

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

  const finalizar = () => {
    fbEvent("Contact", { value: total, currency: "BRL" });
    openWhatsAppOrder(items, total);
  };

  if (items.length === 0) {
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

          <div className="bg-card rounded-2xl border border-border p-5 card-shadow mb-4">
            <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" /> Seus itens ({items.length})
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.plan.id} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-secondary/50">
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
              ))}
            </div>
            <button onClick={() => navigate("/#precos")} className="w-full mt-3 py-2 text-xs text-primary font-semibold hover:underline">
              + Adicionar mais serviços
            </button>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium">Total</span>
              <span className="text-2xl font-bold text-accent">
                R${total.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <button onClick={finalizar}
              className="w-full brand-gradient-bg text-primary-foreground py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" /> Finalizar Compra no WhatsApp
            </button>
            <p className="text-[11px] text-muted-foreground mt-3 text-center">
              Você será direcionado ao WhatsApp com o resumo do seu pedido para combinar o pagamento.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Atendimento Seguro</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Entrega Imediata</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
