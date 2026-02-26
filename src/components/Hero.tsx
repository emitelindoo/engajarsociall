import { Star, Users, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { fbEvent } from "@/lib/fbpixel";

const Hero = () => {
  useEffect(() => {
    fbEvent("ViewContent", { content_name: "Landing Page", content_category: "Home" });
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-24 pb-20 px-4 overflow-hidden" style={{ background: "var(--brand-gradient-soft)" }}>
      {/* Glow effects */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 w-60 h-60 bg-accent/10 rounded-full blur-[80px]" />

      <div className="container mx-auto max-w-3xl text-center relative z-10">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-border rounded-full px-5 py-2.5 mb-8">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold text-foreground">+50.000 clientes atendidos</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-accent fill-accent" />)}
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight tracking-tight">
          Impulsione suas
          <br />
          <span className="brand-gradient-text">Redes Sociais</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-3">Seguidores · Curtidas · Views · Comentários</p>
        <p className="text-sm text-muted-foreground mb-10 max-w-md mx-auto">
          100% brasileiros, entrega imediata, sem precisar de senha. Instagram e TikTok.
        </p>

        <div className="flex gap-3 justify-center flex-wrap mb-14">
          <button onClick={() => scrollTo("precos")} className="brand-gradient-bg text-primary-foreground px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-opacity glow text-sm">
            <TrendingUp className="w-5 h-5" /> Começar Agora
          </button>
          <button onClick={() => scrollTo("recursos")} className="bg-card border border-border text-foreground px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:border-primary/40 transition-colors text-sm">
            Como Funciona
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-10">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">50k+</p>
            <p className="text-xs text-muted-foreground">Clientes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground flex items-center gap-1 justify-center">
              <Star className="w-4 h-4 text-accent fill-accent" /> 4.9
            </p>
            <p className="text-xs text-muted-foreground">Avaliação</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground flex items-center gap-1 justify-center">
              <Zap className="w-4 h-4 text-accent" /> Rápido
            </p>
            <p className="text-xs text-muted-foreground">Entrega</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
