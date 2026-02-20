import { Package, UserCheck, Rocket } from "lucide-react";

const steps = [
  { icon: Package, num: "01", title: "Escolha o seu pacote", desc: "Escolha o pacote de seguidores que mais se adequa ao seu perfil e objetivos." },
  { icon: UserCheck, num: "02", title: "Insira seu @usuário", desc: "Digite seu nome de usuário (nunca solicitaremos sua senha) e faça o pagamento via PIX." },
  { icon: Rocket, num: "03", title: "Veja os resultados!", desc: "Relaxe e observe seus novos seguidores chegando automaticamente ao seu perfil. É fácil assim 🚀" },
];

const HowItWorks = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <p className="text-accent font-semibold text-sm text-center mb-3 uppercase tracking-widest">Como funciona</p>
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Simples, rápido e seguro
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">Veja abaixo como é prático comprar seguidores reais.</p>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((s) => (
            <div key={s.num} className="relative rounded-2xl p-8 border border-border/40 text-center transition-all hover:border-border" style={{ background: 'var(--card-gradient)' }}>
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-accent font-bold tracking-widest">{s.num}</span>
              <h3 className="text-lg font-bold text-foreground mt-2 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={() => scrollTo('precos')} className="bg-accent text-accent-foreground px-8 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all">
            Escolher pacotes
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
