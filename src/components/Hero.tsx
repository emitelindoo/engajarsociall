import { Instagram } from "lucide-react";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20" style={{ background: 'var(--hero-gradient)' }}>
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto rounded-2xl border-2 border-foreground/40 flex items-center justify-center">
          <Instagram className="w-14 h-14 text-foreground" />
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">Compre Seguidores</h1>
      <p className="text-2xl md:text-3xl font-bold text-accent mb-2">100% Reais e Brasileiros</p>
      <p className="text-2xl md:text-3xl font-bold text-foreground mb-6">Prontos pra seguir você!</p>
      <p className="text-muted-foreground max-w-lg mb-8">
        Aumente o crescimento, engajamento e credibilidade do seu perfil e veja seu Instagram ou TikTok disparar!
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button onClick={() => scrollTo('instagram-plans')} className="flex items-center gap-2 border-2 border-foreground/50 text-foreground px-8 py-3 rounded-full font-semibold hover:bg-foreground/10 transition-colors">
          <Instagram className="w-5 h-5" /> INSTAGRAM
        </button>
        <button onClick={() => scrollTo('tiktok-plans')} className="flex items-center gap-2 border-2 border-foreground/50 text-foreground px-8 py-3 rounded-full font-semibold hover:bg-foreground/10 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.81.1v-3.51a6.26 6.26 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.88a8.16 8.16 0 0 0 3.76.92V6.69Z"/></svg>
          TIKTOK
        </button>
      </div>
    </section>
  );
};

export default Hero;
