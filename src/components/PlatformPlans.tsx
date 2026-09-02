import { useState, useMemo, useEffect } from "react";
import { Heart, Eye, Users, Globe, Minus, Plus, ShoppingCart, Check, ShieldCheck } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  igSeguidores, igSeguidoresMundiais, igCurtidas, igCurtidasMundiais, igVisualizacoes,
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
  { id: "seg", label: "Seguidores BR", icon: <Users className="w-5 h-5" />, plans: igSeguidores },
  { id: "seg-ww", label: "Seguidores Mundiais", icon: <Globe className="w-5 h-5" />, plans: igSeguidoresMundiais },
  { id: "curt", label: "Curtidas BR", icon: <Heart className="w-5 h-5" />, plans: igCurtidas },
  { id: "curt-ww", label: "Curtidas Mundiais", icon: <Globe className="w-5 h-5" />, plans: igCurtidasMundiais },
  { id: "views", label: "Visualizações", icon: <Eye className="w-5 h-5" />, plans: igVisualizacoes },
];

const ttServices: ServiceConfig[] = [
  { id: "seg", label: "Seguidores BR", icon: <Users className="w-5 h-5" />, plans: ttSeguidores },
  { id: "seg-ww", label: "Seguidores Mundiais", icon: <Globe className="w-5 h-5" />, plans: ttSeguidoresMundiais },
  { id: "curt", label: "Curtidas BR", icon: <Heart className="w-5 h-5" />, plans: ttCurtidas },
  { id: "curt-ww", label: "Curtidas Mundiais", icon: <Globe className="w-5 h-5" />, plans: ttCurtidasMundiais },
  { id: "views", label: "Visualizações", icon: <Eye className="w-5 h-5" />, plans: ttVisualizacoes },
];

const platforms = [
  { id: "instagram", label: "Instagram", services: igServices, gradient: "from-[hsl(43,96%,56%)] via-[hsl(350,96%,55%)] to-[hsl(316,73%,52%)]" },
  { id: "tiktok", label: "TikTok", services: ttServices, gradient: "from-[hsl(180,80%,50%)] via-[hsl(340,80%,55%)] to-[hsl(0,0%,15%)]" },
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
    const platformHandler = (e: Event) => {
      const platformId = (e as CustomEvent).detail;
      handlePlatformChange(platformId);
    };
    window.addEventListener("select-service", handler);
    window.addEventListener("select-platform", platformHandler);
    return () => {
      window.removeEventListener("select-service", handler);
      window.removeEventListener("select-platform", platformHandler);
    };
  }, []);

  const handlePlatformChange = (id: string) => {
    setActivePlatform(id);
    const platform = platforms.find((p) => p.id === id)!;
    setActiveService(platform.services[0].id);
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
      content_ids: [currentPlan.id],
      content_type: "product",
      content_category: currentPlan.platform,
      value: currentPlan.priceNum,
      currency: "BRL",
    });
    addItem(currentPlan);
    toast.success(`${currentPlan.quantity} adicionado ao carrinho!`);
  };

  // Calculate discount
  const discount = useMemo(() => {
    const origNum = parseFloat(currentPlan.originalPrice.replace(/[R$.\s]/g, "").replace(",", "."));
    return Math.round(((origNum - currentPlan.priceNum) / origNum) * 100);
  }, [currentPlan]);

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
        <div className="flex justify-center gap-2 flex-wrap mb-6">
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
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={decrease}
                disabled={selectedPlanIndex === 0}
                className="w-10 h-10 rounded-full border border-border bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-30 transition-all flex-shrink-0"
                aria-label="Diminuir"
              >
                <Minus className="w-4 h-4" />
              </button>
              <Slider
                value={[selectedPlanIndex]}
                min={0}
                max={plans.length - 1}
                step={1}
                onValueChange={(v) => setSelectedPlanIndex(v[0])}
                className="flex-1"
              />
              <button
                onClick={increase}
                disabled={selectedPlanIndex === plans.length - 1}
                className="w-10 h-10 rounded-full border border-border bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-30 transition-all flex-shrink-0"
                aria-label="Aumentar"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-semibold px-1">
              <span>{plans[0].quantity.split(" ")[0]}</span>
              <span className="text-primary">Arraste para ajustar</span>
              <span>{plans[plans.length - 1].quantity.split(" ")[0]}</span>
            </div>
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
