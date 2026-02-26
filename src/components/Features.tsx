import { Eye, Shield, Heart, TrendingUp } from "lucide-react";

const items = [
  { icon: Eye, title: "Visibilidade Instantânea", desc: "Alcance um público maior interessado no seu conteúdo." },
  { icon: Shield, title: "Mais Credibilidade", desc: "Perfis maiores transmitem confiança e profissionalismo." },
  { icon: Heart, title: "Maior Engajamento", desc: "Mais curtidas, comentários e compartilhamentos." },
  { icon: TrendingUp, title: "Crescimento Orgânico", desc: "Seguidores atraem mais seguidores naturalmente." },
];

const Features = () => (
  <section id="recursos" className="py-20 px-4 bg-background">
    <div className="container mx-auto max-w-4xl">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12 tracking-tight">Por que investir em engajamento?</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.title} className="bg-card rounded-2xl p-6 border border-border card-shadow hover:border-primary/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:brand-gradient-bg transition-colors">
              <item.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
