import { useState, useMemo, useEffect } from "react";
import { Heart, MessageCircle, Eye, Users, Minus, Plus, ShoppingCart, Check, ShieldCheck } from "lucide-react";
import {
  igSeguidores, igCurtidas, igComentarios, igVisualizacoes,
  ttSeguidores, ttCurtidas, ttComentarios, ttVisualizacoes,
  ytInscritos, ytCurtidas, ytVisualizacoes, ytComentarios,
  kwSeguidores, kwCurtidas, kwVisualizacoes,
  fbSeguidores, fbCurtidas, fbVisualizacoes, fbComentarios,
  PlanData,
} from "@/data/plans";
import { useCart } from "@/contexts/CartContext";
import { fbEvent } from "@/lib/fbpixel";
import { toast } from "sonner";

interface ServiceConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  plans: PlanData[];
}

const igServices: ServiceConfig[] = [
  { id: "seg", label: "Seguidores", icon: <Users className="w-5 h-5" />, plans: igSeguidores },
  { id: "curt", label: "Curtidas", icon: <Heart className="w-5 h-5" />, plans: igCurtidas },
  { id: "views", label: "Visualizações", icon: <Eye className="w-5 h-5" />, plans: igVisualizacoes },
  { id: "com", label: "Comentários", icon: <MessageCircle className="w-5 h-5" />, plans: igComentarios },
];

const ttServices: ServiceConfig[] = [
  { id: "seg", label: "Seguidores", icon: <Users className="w-5 h-5" />, plans: ttSeguidores },
  { id: "curt", label: "Curtidas", icon: <Heart className="w-5 h-5" />, plans: ttCurtidas },
  { id: "views", label: "Visualizações", icon: <Eye className="w-5 h-5" />, plans: ttVisualizacoes },
  { id: "com", label: "Comentários", icon: <MessageCircle className="w-5 h-5" />, plans: ttComentarios },
];

const ytServices: ServiceConfig[] = [
  { id: "seg", label: "Inscritos", icon: <Users className="w-5 h-5" />, plans: ytInscritos },
  { id: "curt", label: "Likes", icon: <Heart className="w-5 h-5" />, plans: ytCurtidas },
  { id: "views", label: "Visualizações", icon: <Eye className="w-5 h-5" />, plans: ytVisualizacoes },
  { id: "com", label: "Comentários", icon: <MessageCircle className="w-5 h-5" />, plans: ytComentarios },
];

const kwServices: ServiceConfig[] = [
  { id: "seg", label: "Seguidores", icon: <Users className="w-5 h-5" />, plans: kwSeguidores },
  { id: "curt", label: "Curtidas", icon: <Heart className="w-5 h-5" />, plans: kwCurtidas },
  { id: "views", label: "Visualizações", icon: <Eye className="w-5 h-5" />, plans: kwVisualizacoes },
];

const fbServices: ServiceConfig[] = [
  { id: "seg", label: "Seguidores", icon: <Users className="w-5 h-5" />, plans: fbSeguidores },
  { id: "curt", label: "Curtidas", icon: <Heart className="w-5 h-5" />, plans: fbCurtidas },
  { id: "views", label: "Visualizações", icon: <Eye className="w-5 h-5" />, plans: fbVisualizacoes },
  { id: "com", label: "Comentários", icon: <MessageCircle className="w-5 h-5" />, plans: fbComentarios },
];

const platforms = [
  { id: "instagram", label: "Instagram", services: igServices, gradient: "from-[hsl(43,96%,56%)] via-[hsl(350,96%,55%)] to-[hsl(316,73%,52%)]" },
  { id: "tiktok", label: "TikTok", services: ttServices, gradient: "from-[hsl(180,80%,50%)] via-[hsl(340,80%,55%)] to-[hsl(0,0%,15%)]" },
  { id: "youtube", label: "YouTube", services: ytServices, gradient: "from-[hsl(0,100%,50%)] to-[hsl(0,80%,40%)]" },
  { id: "kwai", label: "Kwai", services: kwServices, gradient: "from-[hsl(30,100%,50%)] to-[hsl(15,100%,45%)]" },
  { id: "facebook", label: "Facebook", services: fbServices, gradient: "from-[hsl(220,80%,50%)] to-[hsl(220,70%,40%)]" },
];

const PlatformPlans = () => {
  const [activePlatform, setActivePlatform] = useState("instagram");
  const [activeService, setActiveService] = useState("seg");
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const { items, addItem } = useCart();

  const currentPlatform = platforms.find((p) => p.id === activePlatform)!;
  const currentService = currentPlatform.services.find((s) => s.id === activeService) || currentPlatform.services[0];
  const plans = currentService.plans;
  const currentPlan = plans[selectedPlanIndex] || plans[0];
  const inCart = items.some((i) => i.plan.id === currentPlan.id);

  // Listen for hero circle clicks
  useEffect(() => {
    const handler = (e: Event) => {
      const serviceId = (e as CustomEvent).detail;
      setActiveService(serviceId);
      setSelectedPlanIndex(0);
    };
    window.addEventListener("select-service", handler);
    return () => window.removeEventListener("select-service", handler);
  }, []);

  const handlePlatformChange = (id: string) => {
    setActivePlatform(id);
    setActiveService("seg");
    setSelectedPlanIndex(0);
  };

  const handleServiceChange = (id: string) => {
    setActiveService(id);
    setSelectedPlanIndex(0);
    setTimeout(() => {
      document.getElementById("seletor-plano")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const decrease = () => {
    if (selectedPlanIndex > 0) setSelectedPlanIndex(selectedPlanIndex - 1);
  };

  const increase = () => {
    if (selectedPlanIndex < plans.length - 1) setSelectedPlanIndex(selectedPlanIndex + 1);
  };

  const handleAdd = () => {
    if (inCart) return;
    fbEvent("AddToCart", {
      content_name: `${currentPlan.serviceType} - ${currentPlan.name}`,
      content_category: currentPlan.platform,
      value: currentPlan.priceNum,
      currency: "BRL",
    });
    addItem(currentPlan);
    toast.success(`${currentPlan.quantity} adicionado ao carrinho!`);
  };

  // Calculate discount
  const origNum = parseFloat(currentPlan.originalPrice.replace(/[R$.\s]/g, "").replace(",", "."));
  const discount = Math.round(((origNum - currentPlan.priceNum) / origNum) * 100);

  return (
    <section id="precos" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Escolha e Personalize
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-2">
          Monte seu <span className="ig-gradient-text">Pacote</span>
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-10 max-w-lg mx-auto">
          Selecione a plataforma, o serviço e ajuste a quantidade. Simples e rápido.
        </p>

        {/* Platform Tabs */}
        <div className="flex justify-start md:justify-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handlePlatformChange(platform.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                activePlatform === platform.id
                  ? `bg-gradient-to-r ${platform.gradient} text-white shadow-lg`
                  : "bg-card border border-border text-foreground hover:border-primary/30"
              }`}
            >
              {platform.label}
            </button>
          ))}
        </div>

        {/* Service Type Tabs */}
        <div className="flex justify-center gap-2 flex-wrap mb-8">
          {currentPlatform.services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceChange(service.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeService === service.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {service.icon}
              {service.label}
            </button>
          ))}
        </div>

        {/* Interactive Selector Card */}
        <div id="seletor-plano" className="bg-card rounded-3xl border border-border p-8 card-shadow max-w-md mx-auto">
          {/* Quantity display */}
          <div className="text-center mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">
              {currentPlan.serviceType} · {currentPlan.platform}
            </p>
            <p className="text-4xl font-bold text-foreground mb-1">{currentPlan.quantity}</p>
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
              -{discount}% OFF
            </span>
          </div>

          {/* Slider-like quantity control */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={decrease}
              disabled={selectedPlanIndex === 0}
              className="w-12 h-12 rounded-full border border-border bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-30 disabled:hover:bg-muted disabled:hover:text-foreground disabled:hover:border-border transition-all"
            >
              <Minus className="w-5 h-5" />
            </button>

            {/* Step indicators */}
            <div className="flex items-center gap-1.5">
              {plans.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPlanIndex(i)}
                  className={`rounded-full transition-all ${
                    i === selectedPlanIndex
                      ? "w-8 h-3 ig-gradient-bg"
                      : i < selectedPlanIndex
                        ? "w-3 h-3 bg-primary/40"
                        : "w-3 h-3 bg-border"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={increase}
              disabled={selectedPlanIndex === plans.length - 1}
              className="w-12 h-12 rounded-full border border-border bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-30 disabled:hover:bg-muted disabled:hover:text-foreground disabled:hover:border-border transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Quick select buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {plans.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlanIndex(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  i === selectedPlanIndex
                    ? "ig-gradient-bg text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.quantity.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Price */}
          <div className="text-center mb-6 p-4 rounded-2xl bg-muted/50">
            <span className="text-sm line-through text-muted-foreground mr-2">{currentPlan.originalPrice}</span>
            <span className="text-4xl font-bold ig-gradient-text">{currentPlan.price}</span>
          </div>

          {/* Features */}
          <ul className="space-y-2 mb-6">
            {currentPlan.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            disabled={inCart}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
              inCart
                ? "bg-primary/10 text-primary cursor-default"
                : "ig-gradient-bg text-primary-foreground hover:opacity-90 shadow-lg"
            }`}
          >
            {inCart ? (
              <><Check className="w-5 h-5" /> Adicionado ao Carrinho</>
            ) : (
              <><ShoppingCart className="w-5 h-5" /> Adicionar ao Carrinho — {currentPlan.price}</>
            )}
          </button>

          <div className="flex items-center justify-center gap-3 mt-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Seguro</span>
            <span>•</span>
            <span>Entrega Imediata</span>
            <span>•</span>
            <span>Sem Senha</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformPlans;
