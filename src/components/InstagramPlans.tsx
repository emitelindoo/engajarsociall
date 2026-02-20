import PricingCard from "./PricingCard";

const features = ["100% Brasileiros", "Entrega imediata", "Garantia de reposição", "Não precisa informar senha", "Segurança garantida"];

const plans = [
  { name: "Básico", originalPrice: "R$19,90", price: "R$12,90", followers: "2.500 Seguidores" },
  { name: "Iniciante", originalPrice: "R$39,90", price: "R$14,90", followers: "3.500 Seguidores" },
  { name: "Profissional", originalPrice: "R$59,90", price: "R$16,90", followers: "5.000 Seguidores" },
  { name: "Elite", originalPrice: "R$99,90", price: "R$20,99", followers: "10.000 Seguidores", highlighted: true },
  { name: "Premium", originalPrice: "R$149,90", price: "R$29,90", followers: "20.000 Seguidores" },
  { name: "Super", originalPrice: "R$199,90", price: "R$35,90", followers: "30.000 Seguidores" },
  { name: "VIP", originalPrice: "R$249,90", price: "R$54,90", followers: "50.000 Seguidores" },
  { name: "Master", originalPrice: "R$499,90", price: "R$99,90", followers: "120.000 Seguidores" },
  { name: "Ultimate", originalPrice: "R$799,90", price: "R$149,90", followers: "200.000 Seguidores" },
];

const InstagramPlans = () => (
  <section id="instagram-plans" className="py-20 px-4">
    <div className="container mx-auto max-w-7xl" id="precos">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">Planos Instagram</h2>
      <p className="text-center text-muted-foreground mb-12">
        Para os melhores resultados, escolha o pacote mais adequado ao seu perfil e comece a crescer seu público.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((p) => (
          <PricingCard key={p.name} {...p} platform="Instagram" features={features} />
        ))}
      </div>
    </div>
  </section>
);

export default InstagramPlans;
