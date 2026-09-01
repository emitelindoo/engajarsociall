export interface PlanData {
  id: string;
  name: string;
  platform: string;
  serviceType: string;
  originalPrice: string;
  price: string;
  priceNum: number;
  quantity: string;
  features: string[];
  highlighted?: boolean;
}

// Keep backward compat
export type { PlanData as PlanDataType };

const segFeatures = ["100% Brasileiros", "Entrega imediata", "Garantia de reposição", "Sem informar senha", "Segurança garantida"];
const curtidaFeatures = ["Curtidas brasileiras", "Distribuídas nos posts", "Entrega rápida", "Sem senha", "Garantia"];
const viewFeatures = ["Views brasileiras", "Entrega instantânea", "Sem queda", "Sem senha", "Segurança garantida"];

// ─── PRICING ──────────────────────────────────────────────
// Cada 10 unidades = R$0,15 (R$0,015 por unidade)
const calcSegPriceNum = (qty: number): number => Math.round((qty / 10) * 0.15 * 100) / 100;

const fmtBRL = (n: number) => `R$${n.toFixed(2).replace(".", ",")}`;
const fmtQty = (n: number) => n.toLocaleString("pt-BR");

const buildScalablePlans = (
  idPrefix: string,
  platform: string,
  serviceType: string,
  unit: string,
  features: string[],
): PlanData[] => {
  const steps: number[] = [];
  for (let q = 100; q < 1000; q += 50) steps.push(q);
  for (let q = 1000; q < 10000; q += 100) steps.push(q);
  for (let q = 10000; q < 50000; q += 500) steps.push(q);
  for (let q = 50000; q <= 100000; q += 1000) steps.push(q);

  return steps.map((qty) => {
    const priceNum = calcSegPriceNum(qty);
    const originalNum = Math.round(priceNum * 2 * 100) / 100;
    return {
      id: `${idPrefix}-${qty}`,
      name: qty >= 100000 ? "VIP" : qty >= 25000 ? "Premium" : qty >= 10000 ? "Profissional" : qty >= 2000 ? "Avançado" : "Básico",
      platform,
      serviceType,
      originalPrice: fmtBRL(originalNum),
      price: fmtBRL(priceNum),
      priceNum,
      quantity: `${fmtQty(qty)} ${unit}`,
      features,
      highlighted: qty === 10000,
    };
  });
};

// ─── INSTAGRAM ────────────────────────────────────────────
export const igSeguidores: PlanData[] = buildScalablePlans("ig-seg", "Instagram", "Seguidores", "Seguidores", segFeatures);
export const igCurtidas: PlanData[] = buildScalablePlans("ig-curt", "Instagram", "Curtidas", "Curtidas", curtidaFeatures);

export const igComentarios: PlanData[] = [
  { id: "ig-com-10", name: "Starter", platform: "Instagram", serviceType: "Comentários", originalPrice: "R$29,90", price: "R$14,90", priceNum: 14.9, quantity: "10 Comentários", features: commentFeatures },
  { id: "ig-com-25", name: "Básico", platform: "Instagram", serviceType: "Comentários", originalPrice: "R$49,90", price: "R$29,90", priceNum: 29.9, quantity: "25 Comentários", features: commentFeatures },
  { id: "ig-com-50", name: "Profissional", platform: "Instagram", serviceType: "Comentários", originalPrice: "R$89,90", price: "R$49,90", priceNum: 49.9, quantity: "50 Comentários", features: commentFeatures, highlighted: true },
  { id: "ig-com-100", name: "Elite", platform: "Instagram", serviceType: "Comentários", originalPrice: "R$149,90", price: "R$79,90", priceNum: 79.9, quantity: "100 Comentários", features: commentFeatures },
];

export const igVisualizacoes: PlanData[] = [
  { id: "ig-views-1k", name: "Starter", platform: "Instagram", serviceType: "Visualizações", originalPrice: "R$19,90", price: "R$9,90", priceNum: 9.9, quantity: "1.000 Visualizações", features: viewFeatures },
  { id: "ig-views-5k", name: "Básico", platform: "Instagram", serviceType: "Visualizações", originalPrice: "R$39,90", price: "R$19,90", priceNum: 19.9, quantity: "5.000 Visualizações", features: viewFeatures },
  { id: "ig-views-10k", name: "Profissional", platform: "Instagram", serviceType: "Visualizações", originalPrice: "R$69,90", price: "R$34,90", priceNum: 34.9, quantity: "10.000 Visualizações", features: viewFeatures, highlighted: true },
  { id: "ig-views-50k", name: "Elite", platform: "Instagram", serviceType: "Visualizações", originalPrice: "R$149,90", price: "R$69,90", priceNum: 69.9, quantity: "50.000 Visualizações", features: viewFeatures },
  { id: "ig-views-100k", name: "Premium", platform: "Instagram", serviceType: "Visualizações", originalPrice: "R$249,90", price: "R$119,90", priceNum: 119.9, quantity: "100.000 Visualizações", features: viewFeatures },
];

// ─── TIKTOK ───────────────────────────────────────────────
export const ttSeguidores: PlanData[] = buildScalablePlans("tt-seg", "TikTok", "Seguidores", "Seguidores", segFeatures);
export const ttCurtidas: PlanData[] = buildScalablePlans("tt-curt", "TikTok", "Curtidas", "Curtidas", curtidaFeatures);

export const ttComentarios: PlanData[] = [
  { id: "tt-com-10", name: "Starter", platform: "TikTok", serviceType: "Comentários", originalPrice: "R$34,90", price: "R$19,90", priceNum: 19.9, quantity: "10 Comentários", features: commentFeatures },
  { id: "tt-com-25", name: "Básico", platform: "TikTok", serviceType: "Comentários", originalPrice: "R$59,90", price: "R$34,90", priceNum: 34.9, quantity: "25 Comentários", features: commentFeatures },
  { id: "tt-com-50", name: "Profissional", platform: "TikTok", serviceType: "Comentários", originalPrice: "R$99,90", price: "R$54,90", priceNum: 54.9, quantity: "50 Comentários", features: commentFeatures, highlighted: true },
  { id: "tt-com-100", name: "Elite", platform: "TikTok", serviceType: "Comentários", originalPrice: "R$169,90", price: "R$89,90", priceNum: 89.9, quantity: "100 Comentários", features: commentFeatures },
];

export const ttVisualizacoes: PlanData[] = [
  { id: "tt-views-1k", name: "Starter", platform: "TikTok", serviceType: "Visualizações", originalPrice: "R$19,90", price: "R$9,90", priceNum: 9.9, quantity: "1.000 Visualizações", features: viewFeatures },
  { id: "tt-views-5k", name: "Básico", platform: "TikTok", serviceType: "Visualizações", originalPrice: "R$39,90", price: "R$19,90", priceNum: 19.9, quantity: "5.000 Visualizações", features: viewFeatures },
  { id: "tt-views-10k", name: "Profissional", platform: "TikTok", serviceType: "Visualizações", originalPrice: "R$69,90", price: "R$34,90", priceNum: 34.9, quantity: "10.000 Visualizações", features: viewFeatures, highlighted: true },
  { id: "tt-views-50k", name: "Elite", platform: "TikTok", serviceType: "Visualizações", originalPrice: "R$149,90", price: "R$69,90", priceNum: 69.9, quantity: "50.000 Visualizações", features: viewFeatures },
];

// ─── HELPERS ──────────────────────────────────────────────
const allPlans: PlanData[] = [
  ...igSeguidores, ...igCurtidas, ...igComentarios, ...igVisualizacoes,
  ...ttSeguidores, ...ttCurtidas, ...ttComentarios, ...ttVisualizacoes,
];

// backward compat exports
export const instagramPlans = igSeguidores;
export const tiktokPlans = ttSeguidores;

export function getPlanById(id: string): PlanData | undefined {
  return allPlans.find((p) => p.id === id);
}
