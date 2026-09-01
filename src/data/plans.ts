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

const segFeaturesBR = ["100% Brasileiros", "Perfis reais e ativos", "Entrega imediata", "Garantia de reposição", "Sem informar senha"];
const segFeaturesWW = ["Seguidores mundiais", "Melhor custo-benefício", "Entrega imediata", "Garantia de reposição", "Sem informar senha"];
const curtidaFeaturesBR = ["Curtidas brasileiras", "Distribuídas nos posts", "Entrega rápida", "Sem senha", "Garantia"];
const curtidaFeaturesWW = ["Curtidas mundiais", "Preço mais baixo", "Entrega rápida", "Sem senha", "Garantia"];
const viewFeatures = ["Views brasileiras", "Entrega instantânea", "Sem queda", "Sem senha", "Segurança garantida"];

// ─── PRICING ──────────────────────────────────────────────
// Brasileiros: cada 10 unidades = R$0,15 · Mundiais: cada 10 unidades = R$0,08
const RATE_BR = 0.15;
const RATE_WW = 0.08;
const calcPriceNum = (qty: number, rate: number): number => Math.round((qty / 10) * rate * 100) / 100;

const fmtBRL = (n: number) => `R$${n.toFixed(2).replace(".", ",")}`;
const fmtQty = (n: number) => n.toLocaleString("pt-BR");

const buildScalablePlans = (
  idPrefix: string,
  platform: string,
  serviceType: string,
  unit: string,
  features: string[],
  rate: number = RATE_BR,
): PlanData[] => {
  const steps: number[] = [];
  for (let q = 100; q < 1000; q += 50) steps.push(q);
  for (let q = 1000; q < 10000; q += 100) steps.push(q);
  for (let q = 10000; q < 50000; q += 500) steps.push(q);
  for (let q = 50000; q <= 100000; q += 1000) steps.push(q);

  return steps.map((qty) => {
    const priceNum = calcPriceNum(qty, rate);
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
export const igSeguidores: PlanData[] = buildScalablePlans("ig-seg", "Instagram", "Seguidores Brasileiros", "Seguidores", segFeaturesBR, RATE_BR);
export const igSeguidoresMundiais: PlanData[] = buildScalablePlans("ig-seg-ww", "Instagram", "Seguidores Mundiais", "Seguidores", segFeaturesWW, RATE_WW);
export const igCurtidas: PlanData[] = buildScalablePlans("ig-curt", "Instagram", "Curtidas Brasileiras", "Curtidas", curtidaFeaturesBR, RATE_BR);
export const igCurtidasMundiais: PlanData[] = buildScalablePlans("ig-curt-ww", "Instagram", "Curtidas Mundiais", "Curtidas", curtidaFeaturesWW, RATE_WW);

export const igVisualizacoes: PlanData[] = [
  { id: "ig-views-1k", name: "Starter", platform: "Instagram", serviceType: "Visualizações", originalPrice: "R$19,90", price: "R$9,90", priceNum: 9.9, quantity: "1.000 Visualizações", features: viewFeatures },
  { id: "ig-views-5k", name: "Básico", platform: "Instagram", serviceType: "Visualizações", originalPrice: "R$39,90", price: "R$19,90", priceNum: 19.9, quantity: "5.000 Visualizações", features: viewFeatures },
  { id: "ig-views-10k", name: "Profissional", platform: "Instagram", serviceType: "Visualizações", originalPrice: "R$69,90", price: "R$34,90", priceNum: 34.9, quantity: "10.000 Visualizações", features: viewFeatures, highlighted: true },
  { id: "ig-views-50k", name: "Elite", platform: "Instagram", serviceType: "Visualizações", originalPrice: "R$149,90", price: "R$69,90", priceNum: 69.9, quantity: "50.000 Visualizações", features: viewFeatures },
  { id: "ig-views-100k", name: "Premium", platform: "Instagram", serviceType: "Visualizações", originalPrice: "R$249,90", price: "R$119,90", priceNum: 119.9, quantity: "100.000 Visualizações", features: viewFeatures },
];

// ─── TIKTOK ───────────────────────────────────────────────
export const ttSeguidores: PlanData[] = buildScalablePlans("tt-seg", "TikTok", "Seguidores Brasileiros", "Seguidores", segFeaturesBR, RATE_BR);
export const ttSeguidoresMundiais: PlanData[] = buildScalablePlans("tt-seg-ww", "TikTok", "Seguidores Mundiais", "Seguidores", segFeaturesWW, RATE_WW);
export const ttCurtidas: PlanData[] = buildScalablePlans("tt-curt", "TikTok", "Curtidas Brasileiras", "Curtidas", curtidaFeaturesBR, RATE_BR);
export const ttCurtidasMundiais: PlanData[] = buildScalablePlans("tt-curt-ww", "TikTok", "Curtidas Mundiais", "Curtidas", curtidaFeaturesWW, RATE_WW);

export const ttVisualizacoes: PlanData[] = [
  { id: "tt-views-1k", name: "Starter", platform: "TikTok", serviceType: "Visualizações", originalPrice: "R$19,90", price: "R$9,90", priceNum: 9.9, quantity: "1.000 Visualizações", features: viewFeatures },
  { id: "tt-views-5k", name: "Básico", platform: "TikTok", serviceType: "Visualizações", originalPrice: "R$39,90", price: "R$19,90", priceNum: 19.9, quantity: "5.000 Visualizações", features: viewFeatures },
  { id: "tt-views-10k", name: "Profissional", platform: "TikTok", serviceType: "Visualizações", originalPrice: "R$69,90", price: "R$34,90", priceNum: 34.9, quantity: "10.000 Visualizações", features: viewFeatures, highlighted: true },
  { id: "tt-views-50k", name: "Elite", platform: "TikTok", serviceType: "Visualizações", originalPrice: "R$149,90", price: "R$69,90", priceNum: 69.9, quantity: "50.000 Visualizações", features: viewFeatures },
];

// ─── HELPERS ──────────────────────────────────────────────
const allPlans: PlanData[] = [
  ...igSeguidores, ...igSeguidoresMundiais, ...igCurtidas, ...igCurtidasMundiais, ...igVisualizacoes,
  ...ttSeguidores, ...ttSeguidoresMundiais, ...ttCurtidas, ...ttCurtidasMundiais, ...ttVisualizacoes,
];

// backward compat exports
export const instagramPlans = igSeguidores;
export const tiktokPlans = ttSeguidores;

export function getPlanById(id: string): PlanData | undefined {
  return allPlans.find((p) => p.id === id);
}
