import { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Eye, Users, Minus, Plus, ShoppingCart, Check, ShieldCheck, Clock, MapPin, Lock, Star, Zap, ChevronDown } from "lucide-react";
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
  { id: "instagram", label: "Instagram", services: igServices, gradient: "from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]", accent: "#ee2a7b" },
  { id: "tiktok", label: "TikTok", services: ttServices, gradient: "from-[#25f4ee] via-[#fe2c55] to-[#000]", accent: "#fe2c55" },
  { id: "youtube", label: "YouTube", services: ytServices, gradient: "from-[#ff0000] to-[#cc0000]", accent: "#ff0000" },
  { id: "kwai", label: "Kwai", services: kwServices, gradient: "from-[#ff6a00] to-[#ee0979]", accent: "#ff6a00" },
  { id: "facebook", label: "Facebook", services: fbServices, gradient: "from-[#1877f2] to-[#0a5dc2]", accent: "#1877f2" },
];

const serviceInfoItems = [
  { icon: <Clock className="w-5 h-5" />, title: "Entrega rápida", desc: "Seu pedido é concluído entre 1h a 24h após a confirmação do pagamento." },
  { icon: <MapPin className="w-5 h-5" />, title: "Perfis brasileiros reais", desc: "Perfis reais de pessoas que engajam. Aumenta a interação no seu conteúdo." },
  { icon: <Lock className="w-5 h-5" />, title: "Sem informar senha", desc: "Sua senha é pessoal e jamais será solicitada em nenhum serviço." },
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Garantia de reposição", desc: "Enviamos quantidade adicional e garantimos reposição em caso de queda." },
];

const PlatformPlans = () => {
  const [activePlatform, setActivePlatform] = useState("instagram");
  const [activeService, setActiveService] = useState("seg");
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { items, addItem } = useCart();

  const currentPlatform = platforms.find((p) => p.id === activePlatform)!;
  const currentService = currentPlatform.services.find((s) => s.id === activeService) || currentPlatform.services[0];
  const plans = currentService.plans;
  const currentPlan = plans[selectedPlanIndex] || plans[0];
  const inCart = items.some((i) => i.plan.id === currentPlan.id);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const origNum = parseFloat(currentPlan.originalPrice.replace(/[R$.\s]/g, "").replace(",", "."));
  const discount = Math.round(((origNum - currentPlan.priceNum) / origNum) * 100);

  // Extract just the number from quantity
  const qtyNumber = currentPlan.quantity.split(" ")[0];

  return (
    <section id="precos" className="relative py-20 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)" }}>
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[150px] opacity-20" style={{ background: `radial-gradient(circle, ${currentPlatform.accent}, transparent)` }} />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-3">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
            Usuários de qualidade, preços baixos
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-white mb-2">
          Revelamos o Segredo da{" "}
          <span className={`bg-gradient-to-r ${currentPlatform.gradient} bg-clip-text text-transparent`}>
            Influência Online!
          </span>
        </h2>
        <p className="text-center text-white/50 text-sm mb-3 flex items-center justify-center gap-1">
          <ShieldCheck className="w-4 h-4" /> Os Melhores Serviços Para Construir Sua Audiência!
        </p>

        {/* Star rating */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="flex gap-0.5">
            {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
            <Star className="w-4 h-4 fill-yellow-400/50 text-yellow-400/50" />
          </div>
          <span className="text-white/60 text-xs">4.8 (6.839+ avaliações)</span>
        </div>

        {/* Platform Tabs */}
        <div className="flex justify-center gap-2 flex-wrap mb-6">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handlePlatformChange(platform.id)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all border ${
                activePlatform === platform.id
                  ? `bg-gradient-to-r ${platform.gradient} text-white border-transparent shadow-lg shadow-white/5`
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {platform.label}
            </button>
          ))}
        </div>

        {/* Service Type Tabs */}
        <div className="flex justify-center gap-2 flex-wrap mb-10">
          {currentPlatform.services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceChange(service.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                activeService === service.id
                  ? "bg-white text-gray-900 border-white shadow-lg shadow-white/10"
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              {service.icon}
              {service.label}
            </button>
          ))}
        </div>

        {/* Main Product Card */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left - Product selector */}
          <div id="seletor-plano" className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 md:p-8">
            <h3 className="text-xl font-bold text-white mb-1">
              {currentPlan.serviceType} {currentPlan.platform}
            </h3>
            <p className="text-white/40 text-xs mb-6">Contas reais · Entrega rápida · Garantia</p>

            {/* Quantity Stepper */}
            <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">
              Quantidade
            </label>
            <div className="relative mb-6" ref={dropdownRef}>
              <div className="flex items-center rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <button
                  onClick={decrease}
                  disabled={selectedPlanIndex === 0}
                  className="w-14 h-14 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent transition-all border-r border-white/10 text-lg font-bold"
                >
                  −
                </button>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex-1 h-14 flex items-center justify-center gap-2 text-white font-bold text-xl hover:bg-white/5 transition-all"
                >
                  <span>{qtyNumber}</span>
                  <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                </button>
                <button
                  onClick={increase}
                  disabled={selectedPlanIndex === plans.length - 1}
                  className="w-14 h-14 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent transition-all border-l border-white/10 text-lg font-bold"
                >
                  +
                </button>
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl max-h-60 overflow-y-auto scrollbar-hide">
                  {plans.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => { setSelectedPlanIndex(i); setShowDropdown(false); }}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-white/10 transition-all ${
                        i === selectedPlanIndex ? "bg-white/10 text-white" : "text-white/70"
                      }`}
                    >
                      <span className="font-semibold">{p.quantity}</span>
                      <span className="text-sm">{p.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price display */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-5 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-white/30 line-through text-lg">{currentPlan.originalPrice}</span>
                <span className={`text-4xl font-black bg-gradient-to-r ${currentPlatform.gradient} bg-clip-text text-transparent`}>
                  {currentPlan.price}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  -{discount}% OFF
                </span>
                <span className="text-white/30 text-xs">Economia de R${(origNum - currentPlan.priceNum).toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2.5 mb-6">
              {currentPlan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-white/60">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>

            {/* Add to Cart */}
            <button
              onClick={handleAdd}
              disabled={inCart}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                inCart
                  ? "bg-green-500/20 text-green-400 cursor-default border border-green-500/30"
                  : `bg-gradient-to-r ${currentPlatform.gradient} text-white hover:opacity-90 shadow-lg shadow-black/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]`
              }`}
            >
              {inCart ? (
                <><Check className="w-5 h-5" /> Adicionado ao Carrinho</>
              ) : (
                <><Zap className="w-5 h-5" /> Turbinar Agora — {currentPlan.price}</>
              )}
            </button>

            <div className="flex items-center justify-center gap-3 mt-4 text-[11px] text-white/30">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Seguro</span>
              <span>•</span>
              <span>Entrega Imediata</span>
              <span>•</span>
              <span>Sem Senha</span>
            </div>
          </div>

          {/* Right - Service info cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">
              Informações sobre esse serviço
            </h3>
            {serviceInfoItems.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0" style={{ color: currentPlatform.accent }}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-0.5">{item.title}</h4>
                  <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { num: "50k+", label: "Clientes" },
                { num: "4.8", label: "Avaliação" },
                { num: "24h", label: "Entrega" },
              ].map((b, i) => (
                <div key={i} className="text-center p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                  <p className={`font-black text-lg bg-gradient-to-r ${currentPlatform.gradient} bg-clip-text text-transparent`}>{b.num}</p>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider">{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformPlans;
