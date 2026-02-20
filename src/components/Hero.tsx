import { Instagram, Star, Users, CheckCircle2 } from "lucide-react";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
      {/* Subtle decorative circles */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 bg-secondary border border-border rounded-full px-4 py-2 mb-8">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground font-medium">+50.000 clientes satisfeitos</span>
          <div className="flex -space-x-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-accent fill-accent" />)}
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-4 leading-tight">
          Compre Seguidores
        </h1>
        <p className="text-3xl md:text-4xl font-bold text-gradient-gold mb-3">100% Reais e Brasileiros</p>
        <p className="text-xl md:text-2xl font-semibold text-foreground/80 mb-8">Prontos pra seguir você!</p>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg leading-relaxed">
          Aumente o crescimento, engajamento e credibilidade do seu perfil e veja seu Instagram ou TikTok disparar!
        </p>

        <div className="flex gap-4 flex-wrap justify-center mb-16">
          <button onClick={() => scrollTo('instagram-plans')} className="flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:brightness-110 transition-all glow-blue">
            <Instagram className="w-5 h-5" /> INSTAGRAM
          </button>
          <button onClick={() => scrollTo('tiktok-plans')} className="flex items-center gap-3 border-2 border-border text-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-secondary transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.81.1v-3.51a6.26 6.26 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.88a8.16 8.16 0 0 0 3.76.92V6.69Z"/></svg>
            TIKTOK
          </button>
        </div>

        {/* Social proof stats */}
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">50k+</p>
            <p className="text-xs text-muted-foreground">Clientes</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-2xl font-bold text-foreground">4.9</p>
            <p className="text-xs text-muted-foreground">Avaliação</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">24h</p>
            <p className="text-xs text-muted-foreground">Entrega</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
