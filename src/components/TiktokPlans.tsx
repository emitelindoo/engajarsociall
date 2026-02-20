import PricingCard from "./PricingCard";
import { tiktokPlans } from "@/data/plans";

const TiktokPlans = () => (
  <section id="tiktok-plans" className="py-16 px-4" style={{ background: "var(--ig-gradient-soft)" }}>
    <div className="container mx-auto max-w-6xl">
      <h2 className="text-2xl font-bold text-center text-foreground mb-2">Planos TikTok</h2>
      <p className="text-center text-muted-foreground text-sm mb-10">Escolha o pacote ideal e comece a crescer agora.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tiktokPlans.map((p) => (
          <PricingCard key={p.id} plan={p} />
        ))}
      </div>
    </div>
  </section>
);

export default TiktokPlans;
