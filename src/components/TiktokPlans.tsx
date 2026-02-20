import PricingCard from "./PricingCard";

const features = ["100% brasileiros", "Entrega imediata", "Garantia de reposição", "Sem precisar informar senha", "Segurança garantida"];

const plans = [
  { name: "Plano Básico", originalPrice: "R$59,90", price: "R$16,90", followers: "5.000 seguidores" },
  { name: "Plano Iniciante", originalPrice: "R$99,90", price: "R$21,90", followers: "10.000 seguidores" },
  { name: "Plano Profissional", originalPrice: "R$150,00", price: "R$29,90", followers: "20.000 seguidores", highlighted: true },
  { name: "Plano Elite", originalPrice: "R$199,90", price: "R$36,90", followers: "30.000 seguidores" },
  { name: "Plano Premium", originalPrice: "R$250,00", price: "R$55,90", followers: "50.000 seguidores" },
  { name: "Plano Super", originalPrice: "R$499,90", price: "R$103,00", followers: "120.000 seguidores" },
];

const TiktokPlans = () => (
  <section id="tiktok-plans" className="py-20 px-4">
    <div className="container mx-auto max-w-7xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">Planos Tiktok</h2>
      <p className="text-center text-muted-foreground mb-12">
        Para os melhores resultados, escolha o pacote mais adequado ao seu perfil e comece a crescer seu público.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((p) => (
          <PricingCard key={p.name} {...p} platform="TikTok" features={features} />
        ))}
      </div>
    </div>
  </section>
);

export default TiktokPlans;
