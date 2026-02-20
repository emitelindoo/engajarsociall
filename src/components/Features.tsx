import { Eye, Shield, Heart, TrendingUp } from "lucide-react";

const items = [
  { icon: Eye, title: "Visibilidade Instantânea", desc: "Aumente sua visibilidade na plataforma e alcance um público maior interessado no seu conteúdo ou negócio." },
  { icon: Shield, title: "Mais Credibilidade", desc: "Perfis com mais seguidores transmitem mais confiança e profissionalismo, atraindo novas oportunidades." },
  { icon: Heart, title: "Maior Engajamento", desc: "Com mais seguidores, suas publicações alcançam mais pessoas, gerando mais curtidas, comentários e compartilhamentos." },
  { icon: TrendingUp, title: "Crescimento Orgânico", desc: "O aumento de seguidores atrai mais seguidores naturalmente, criando um ciclo positivo de crescimento." },
];

const Features = () => (
  <section id="recursos" className="py-20 px-4">
    <div className="container mx-auto max-w-5xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
        Por que investir em seguidores para o Instagram?
      </h2>
      <div className="grid sm:grid-cols-2 gap-8">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl p-6 border border-border/30" style={{ background: 'var(--card-gradient)' }}>
            <item.icon className="w-10 h-10 text-accent mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
