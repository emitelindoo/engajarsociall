import { useState } from "react";
import { Heart, MessageCircle, Eye, Users } from "lucide-react";
import {
  igSeguidores, igCurtidas, igComentarios, igVisualizacoes,
  ttSeguidores, ttCurtidas, ttComentarios, ttVisualizacoes,
  PlanData,
} from "@/data/plans";
import PricingCard from "./PricingCard";

interface ServiceTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  plans: PlanData[];
  startingPrice: string;
}

const igServices: ServiceTab[] = [
  { id: "seg", label: "Seguidores", icon: <Users className="w-5 h-5" />, plans: igSeguidores, startingPrice: "R$29,90" },
  { id: "curt", label: "Curtidas", icon: <Heart className="w-5 h-5" />, plans: igCurtidas, startingPrice: "R$14,90" },
  { id: "views", label: "Visualizações", icon: <Eye className="w-5 h-5" />, plans: igVisualizacoes, startingPrice: "R$9,90" },
  { id: "com", label: "Comentários", icon: <MessageCircle className="w-5 h-5" />, plans: igComentarios, startingPrice: "R$14,90" },
];

const ttServices: ServiceTab[] = [
  { id: "seg", label: "Seguidores", icon: <Users className="w-5 h-5" />, plans: ttSeguidores, startingPrice: "R$29,90" },
  { id: "curt", label: "Curtidas", icon: <Heart className="w-5 h-5" />, plans: ttCurtidas, startingPrice: "R$14,90" },
  { id: "views", label: "Visualizações", icon: <Eye className="w-5 h-5" />, plans: ttVisualizacoes, startingPrice: "R$9,90" },
  { id: "com", label: "Comentários", icon: <MessageCircle className="w-5 h-5" />, plans: ttComentarios, startingPrice: "R$19,90" },
];

const platforms = [
  {
    id: "instagram",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    services: igServices,
    gradient: "from-[hsl(43,96%,56%)] via-[hsl(350,96%,55%)] to-[hsl(316,73%,52%)]",
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.82a4.84 4.84 0 01-1-.13z" />
      </svg>
    ),
    services: ttServices,
    gradient: "from-[hsl(180,80%,50%)] via-[hsl(340,80%,55%)] to-[hsl(0,0%,10%)]",
  },
];

const PlatformPlans = () => {
  const [activePlatform, setActivePlatform] = useState("instagram");
  const [activeService, setActiveService] = useState("seg");

  const currentPlatform = platforms.find((p) => p.id === activePlatform)!;
  const currentService = currentPlatform.services.find((s) => s.id === activeService) || currentPlatform.services[0];

  const handlePlatformChange = (id: string) => {
    setActivePlatform(id);
    setActiveService("seg");
  };

  return (
    <section id="precos" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Audiência de Qualidade a Preços Imbatíveis
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-2">
          Escolha sua <span className="ig-gradient-text">Rede</span> para Impulsionar!
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-10 max-w-lg mx-auto">
          Os melhores serviços para construir sua audiência. 100% brasileiros com entrega rápida.
        </p>

        {/* Platform Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handlePlatformChange(platform.id)}
              className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
                activePlatform === platform.id
                  ? `bg-gradient-to-r ${platform.gradient} text-white shadow-lg scale-105`
                  : "bg-card border border-border text-foreground hover:border-primary/30 hover:shadow-md"
              }`}
            >
              {platform.icon}
              {platform.label}
            </button>
          ))}
        </div>

        {/* Service Type Tabs */}
        <div className="flex justify-center gap-2 flex-wrap mb-10">
          {currentPlatform.services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeService === service.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {service.icon}
              <span>{service.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                activeService === service.id
                  ? "bg-white/20 text-primary-foreground"
                  : "bg-primary/10 text-primary"
              }`}>
                a partir de {service.startingPrice}
              </span>
            </button>
          ))}
        </div>

        {/* Plans Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentService.plans.map((p) => (
            <PricingCard key={p.id} plan={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformPlans;
