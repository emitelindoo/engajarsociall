import { Instagram, Star, Users, ShieldCheck, Zap } from "lucide-react";
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
    <section className="pt-20 pb-16 px-4" style={{ background: "var(--ig-gradient-soft)" }}>
      <div className="container mx-auto max-w-2xl text-center">
        <div className="flex justify-center gap-4 mb-8">
          {["Seguidores", "Curtidas", "Views"].map((label) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="ig-gradient-border">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center">
                  {label === "Seguidores" && <Users className="w-6 h-6 text-foreground" />}
                  {label === "Curtidas" && <span className="text-xl">❤️</span>}
                  {label === "Views" && <span className="text-xl">👁️</span>}
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{label}</span>
            </div>
          ))}
        </div>

        <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 mb-6 card-shadow">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">+50.000 clientes</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-accent fill-accent" />)}
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
          Compre <span className="ig-gradient-text">Seguidores Reais</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-2">100% Brasileiros · Entrega Imediata · Sem Senha</p>
        <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
          Aumente o crescimento, engajamento e credibilidade do seu perfil e veja seu Instagram ou TikTok disparar!
        </p>

        <div className="flex gap-3 justify-center flex-wrap mb-10">
          <button onClick={() => scrollTo("precos")} className="ig-gradient-bg text-primary-foreground px-7 py-3 rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity card-shadow">
            <Instagram className="w-5 h-5" /> Começar Agora
          </button>
        </div>

        <div className="flex justify-center gap-8">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">50k+</p>
            <p className="text-xs text-muted-foreground">Clientes</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">⭐ 4.9</p>
            <p className="text-xs text-muted-foreground">Avaliação</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">
              <Zap className="w-4 h-4 inline text-accent" /> Imediata
            </p>
            <p className="text-xs text-muted-foreground">Entrega</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
