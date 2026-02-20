import { Eye, Shield, Heart, TrendingUp } from "lucide-react";

const items = [
  { icon: Eye, title: "Visibilidade Instantânea", desc: "Aumente sua visibilidade na plataforma e alcance um público maior interessado no seu conteúdo ou negócio." },
  { icon: Shield, title: "Mais Credibilidade", desc: "Perfis com mais seguidores transmitem mais confiança e profissionalismo, atraindo novas oportunidades." },
  { icon: Heart, title: "Maior Engajamento", desc: "Com mais seguidores, suas publicações alcançam mais pessoas, gerando mais curtidas, comentários e compartilhamentos." },
  { icon: TrendingUp, title: "Crescimento Orgânico", desc: "O aumento de seguidores atrai mais seguidores naturalmente, criando um ciclo positivo de crescimento." },
];

const Features = () => (
  <section id="recursos" className="py-24 px-4">
    <div className="container mx-auto max-w-5xl">
      <p className="text-accent font-semibold text-sm text-center mb-3 uppercase tracking-widest">Vantagens</p>
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
        Por que investir em seguidores?
      </h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl p-8 border border-border/40 transition-all hover:border-border group" style={{ background: 'var(--card-gradient)' }}>
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors">
              <item.icon className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
