import { Check, Flame, Sparkles, ShoppingCart, CheckCircle2 } from "lucide-react";
import { fbEvent } from "@/lib/fbpixel";
import { PlanData } from "@/data/plans";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const PricingCard = ({ plan }: { plan: PlanData }) => {
  const { items, addItem } = useCart();
  const inCart = items.some((i) => i.plan.id === plan.id);

  const discount = Math.round(
    ((parseFloat(plan.originalPrice.replace(/[R$.\s]/g, "").replace(",", ".")) - plan.priceNum) /
      parseFloat(plan.originalPrice.replace(/[R$.\s]/g, "").replace(",", "."))) *
      100
  );

  const handleAdd = () => {
    if (inCart) return;
    fbEvent("AddToCart", {
      content_name: `${plan.serviceType} - ${plan.name}`,
      content_category: plan.platform,
      value: plan.priceNum,
      currency: "BRL",
    });
    addItem(plan);
    toast.success(`${plan.quantity} adicionado ao carrinho!`);
  };

  return (
    <div
      className={`relative bg-card rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:card-shadow-hover card-shadow ${
        plan.highlighted ? "border-primary ring-2 ring-primary/30 scale-[1.02]" : "border-border"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 ig-gradient-bg text-primary-foreground px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
          <Flame className="w-3 h-3" /> Mais Vendido
        </div>
      )}

      <div className="absolute top-3 right-3">
        <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-1 rounded-lg">
          -{discount}% OFF
        </span>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-foreground text-lg">{plan.name}</h3>
        <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
          {plan.serviceType} • {plan.platform}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-base font-bold text-foreground">{plan.quantity}</span>
      </div>

      <div className="mb-5 p-3 rounded-xl bg-muted/50">
        <span className="text-sm line-through mr-2" style={{ color: "hsl(var(--price-old))" }}>
          {plan.originalPrice}
        </span>
        <span className="text-3xl font-bold" style={{ color: "hsl(var(--price-current))" }}>
          {plan.price}
        </span>
      </div>

      <ul className="space-y-2 mb-6">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}
          </li>
        ))}
      </ul>

      <button
        onClick={handleAdd}
        disabled={inCart}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
          inCart
            ? "bg-primary/10 text-primary cursor-default"
            : plan.highlighted
              ? "ig-gradient-bg text-primary-foreground hover:opacity-90 shadow-lg"
              : "bg-foreground text-background hover:opacity-90"
        }`}
      >
        {inCart ? (
          <><CheckCircle2 className="w-4 h-4" /> No Carrinho</>
        ) : (
          <><ShoppingCart className="w-4 h-4" /> Adicionar ao Carrinho</>
        )}
      </button>
    </div>
  );
};

export default PricingCard;
