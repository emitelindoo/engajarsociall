import { Check, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { PlanData } from "@/data/plans";

const PricingCard = ({ plan }: { plan: PlanData }) => {
  const navigate = useNavigate();

  return (
    <div className={`relative bg-card rounded-2xl p-5 border transition-all hover:-translate-y-1 hover:card-shadow-hover card-shadow ${
      plan.highlighted ? "border-primary ring-2 ring-primary/20" : "border-border"
    }`}>
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 ig-gradient-bg text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          <Flame className="w-3 h-3" /> Mais Vendido
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-foreground text-base">{plan.name}</h3>
          <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{plan.platform}</span>
        </div>
      </div>

      <div className="mb-3">
        <span className="text-sm line-through mr-2" style={{ color: "hsl(var(--price-old))" }}>{plan.originalPrice}</span>
        <span className="text-2xl font-bold" style={{ color: "hsl(var(--price-current))" }}>{plan.price}</span>
      </div>

      <p className="text-sm font-semibold text-foreground mb-4">{plan.followers}</p>

      <ul className="space-y-2 mb-5">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate(`/checkout/${plan.id}`)}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
          plan.highlighted
            ? "ig-gradient-bg text-primary-foreground hover:opacity-90"
            : "bg-foreground text-background hover:opacity-90"
        }`}
      >
        Comprar Agora
      </button>
    </div>
  );
};

export default PricingCard;
