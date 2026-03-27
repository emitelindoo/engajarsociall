import { Eye, Shield, Heart, TrendingUp } from "lucide-react";

const items = [
  { icon: Eye, title: "Mais Visibilidade", desc: "Perfis maiores aparecem mais no explore e nas sugestões do algoritmo." },
  { icon: Shield, title: "Credibilidade Real", desc: "Marcas e seguidores confiam mais em perfis com números expressivos." },
  { icon: Heart, title: "Engajamento Maior", desc: "Quanto mais seguidores, mais curtidas e comentários orgânicos você recebe." },
  { icon: TrendingUp, title: "Efeito Bola de Neve", desc: "Seguidores atraem novos seguidores — o crescimento se acelera naturalmente." },
];

const Features = () => (
  <section id="recursos" className="py-16 px-4 bg-muted/30">
    <div className="container mx-auto max-w-4xl">
      <h2 className="text-2xl font-bold text-center text-foreground mb-2">Por que funciona?</h2>
      <p className="text-center text-muted-foreground text-sm mb-10">Entenda o impacto real no seu perfil</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.title} className="bg-card rounded-2xl p-6 border border-border card-shadow hover:card-shadow-hover transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-1 text-sm">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
