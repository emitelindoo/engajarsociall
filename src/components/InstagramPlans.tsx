import PricingCard from "./PricingCard";
import { instagramPlans } from "@/data/plans";

const InstagramPlans = () => (
  <section id="instagram-plans" className="py-16 px-4 bg-background">
    <div className="container mx-auto max-w-6xl" id="precos">
      <h2 className="text-2xl font-bold text-center text-foreground mb-2">Planos Instagram</h2>
      <p className="text-center text-muted-foreground text-sm mb-10">Escolha o pacote ideal e comece a crescer agora.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {instagramPlans.map((p) => (
          <PricingCard key={p.id} plan={p} />
        ))}
      </div>
    </div>
  </section>
);

export default InstagramPlans;
