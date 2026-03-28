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
    <section className="pt-24 pb-14 px-4" style={{ background: "var(--ig-gradient-soft)" }}>
      <div className="container mx-auto max-w-xl text-center">
        {/* Social proof pill */}
        <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 mb-6 card-shadow">
          <div className="w-2 h-2 rounded-full bg-[hsl(142,70%,45%)] animate-pulse" />
          <span className="text-xs font-semibold text-foreground">1.247 pedidos hoje</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-accent fill-accent" />)}
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          Turbine seu perfil com <span className="ig-gradient-text">seguidores reais</span>
        </h1>
        <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          Seguidores brasileiros, entrega rápida e sem precisar da sua senha.
          Funciona no Instagram, TikTok, YouTube e mais.
        </p>

        <div className="flex gap-3 justify-center flex-wrap mb-10">
          <button onClick={() => scrollTo("precos")} className="ig-gradient-bg text-primary-foreground px-7 py-3.5 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg text-sm">
            <Instagram className="w-5 h-5" /> Ver Planos e Preços
          </button>
        </div>

        {/* Quick service links */}
        <div className="flex justify-center gap-5 mb-10">
          {[
            { label: "Seguidores", serviceId: "seg", icon: <Users className="w-5 h-5 text-foreground" /> },
            { label: "Curtidas", serviceId: "curt", icon: <span className="text-lg">❤️</span> },
            { label: "Views", serviceId: "views", icon: <span className="text-lg">👁️</span> },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                window.dispatchEvent(new CustomEvent("select-service", { detail: item.serviceId }));
                setTimeout(() => {
                  document.getElementById("seletor-plano")?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100);
              }}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="ig-gradient-border group-hover:scale-105 transition-transform">
                <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 text-center">
          <div>
            <p className="text-lg font-bold text-foreground">50.000+</p>
            <p className="text-[11px] text-muted-foreground">clientes atendidos</p>
          </div>
          <div className="w-px bg-border" />
          <div>
            <p className="text-lg font-bold text-foreground">4.9/5</p>
            <p className="text-[11px] text-muted-foreground">nota dos clientes</p>
          </div>
          <div className="w-px bg-border" />
          <div>
            <p className="text-lg font-bold text-foreground flex items-center gap-1">
              <Zap className="w-4 h-4 text-accent" /> Imediata
            </p>
            <p className="text-[11px] text-muted-foreground">entrega garantida</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
