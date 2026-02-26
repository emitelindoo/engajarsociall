import { Package, UserCheck, Rocket } from "lucide-react";

const steps = [
  { icon: Package, num: "1", title: "Escolha seu pacote", desc: "Selecione o serviço e ajuste a quantidade desejada." },
  { icon: UserCheck, num: "2", title: "Informe seu @ ou link", desc: "Seguidores pedem @, curtidas e views pedem o link do post." },
  { icon: Rocket, num: "3", title: "Receba e decole!", desc: "Seus seguidores começam a chegar em minutos. 🚀" },
];

const HowItWorks = () => (
  <section className="py-16 px-4 bg-background">
    <div className="container mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold text-center text-foreground mb-10">Como funciona</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div key={s.num} className="bg-card rounded-2xl p-6 border border-border card-shadow text-center">
            <div className="w-10 h-10 rounded-full ig-gradient-bg text-primary-foreground flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              {s.num}
            </div>
            <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
