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
const commentFeatures = ["Comentários positivos", "Perfis brasileiros reais", "Entrega em até 24h", "Sem senha", "Garantia"];
const viewFeatures = ["Views brasileiras", "Entrega instantânea", "Sem queda", "Sem senha", "Segurança garantida"];

// ─── INSTAGRAM ────────────────────────────────────────────
export const igSeguidores: PlanData[] = [
  { id: "ig-seg-1k", name: "Starter", platform: "Instagram", serviceType: "Seguidores", originalPrice: "R$49,90", price: "R$29,90", priceNum: 29.9, quantity: "1.000 Seguidores", features: segFeatures },
  { id: "ig-seg-2500", name: "Básico", platform: "Instagram", serviceType: "Seguidores", originalPrice: "R$79,90", price: "R$39,90", priceNum: 39.9, quantity: "2.500 Seguidores", features: segFeatures },
  { id: "ig-seg-5k", name: "Profissional", platform: "Instagram", serviceType: "Seguidores", originalPrice: "R$119,90", price: "R$59,90", priceNum: 59.9, quantity: "5.000 Seguidores", features: segFeatures },
  { id: "ig-seg-10k", name: "Elite", platform: "Instagram", serviceType: "Seguidores", originalPrice: "R$199,90", price: "R$89,90", priceNum: 89.9, quantity: "10.000 Seguidores", features: segFeatures, highlighted: true },
  { id: "ig-seg-20k", name: "Premium", platform: "Instagram", serviceType: "Seguidores", originalPrice: "R$349,90", price: "R$149,90", priceNum: 149.9, quantity: "20.000 Seguidores", features: segFeatures },
  { id: "ig-seg-50k", name: "VIP", platform: "Instagram", serviceType: "Seguidores", originalPrice: "R$699,90", price: "R$299,90", priceNum: 299.9, quantity: "50.000 Seguidores", features: segFeatures },
  { id: "ig-seg-100k", name: "Master", platform: "Instagram", serviceType: "Seguidores", originalPrice: "R$1.199,90", price: "R$499,90", priceNum: 499.9, quantity: "100.000 Seguidores", features: segFeatures },
];

export const igCurtidas: PlanData[] = [
  { id: "ig-curt-500", name: "Starter", platform: "Instagram", serviceType: "Curtidas", originalPrice: "R$29,90", price: "R$14,90", priceNum: 14.9, quantity: "500 Curtidas", features: curtidaFeatures },
  { id: "ig-curt-1k", name: "Básico", platform: "Instagram", serviceType: "Curtidas", originalPrice: "R$49,90", price: "R$24,90", priceNum: 24.9, quantity: "1.000 Curtidas", features: curtidaFeatures },
  { id: "ig-curt-2500", name: "Profissional", platform: "Instagram", serviceType: "Curtidas", originalPrice: "R$79,90", price: "R$39,90", priceNum: 39.9, quantity: "2.500 Curtidas", features: curtidaFeatures, highlighted: true },
  { id: "ig-curt-5k", name: "Elite", platform: "Instagram", serviceType: "Curtidas", originalPrice: "R$129,90", price: "R$59,90", priceNum: 59.9, quantity: "5.000 Curtidas", features: curtidaFeatures },
  { id: "ig-curt-10k", name: "Premium", platform: "Instagram", serviceType: "Curtidas", originalPrice: "R$199,90", price: "R$89,90", priceNum: 89.9, quantity: "10.000 Curtidas", features: curtidaFeatures },
];

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
export const ttSeguidores: PlanData[] = [
  { id: "tt-seg-1k", name: "Starter", platform: "TikTok", serviceType: "Seguidores", originalPrice: "R$49,90", price: "R$29,90", priceNum: 29.9, quantity: "1.000 Seguidores", features: segFeatures },
  { id: "tt-seg-5k", name: "Básico", platform: "TikTok", serviceType: "Seguidores", originalPrice: "R$119,90", price: "R$59,90", priceNum: 59.9, quantity: "5.000 Seguidores", features: segFeatures },
  { id: "tt-seg-10k", name: "Profissional", platform: "TikTok", serviceType: "Seguidores", originalPrice: "R$199,90", price: "R$89,90", priceNum: 89.9, quantity: "10.000 Seguidores", features: segFeatures, highlighted: true },
  { id: "tt-seg-20k", name: "Elite", platform: "TikTok", serviceType: "Seguidores", originalPrice: "R$349,90", price: "R$149,90", priceNum: 149.9, quantity: "20.000 Seguidores", features: segFeatures },
  { id: "tt-seg-50k", name: "Premium", platform: "TikTok", serviceType: "Seguidores", originalPrice: "R$699,90", price: "R$299,90", priceNum: 299.9, quantity: "50.000 Seguidores", features: segFeatures },
  { id: "tt-seg-100k", name: "VIP", platform: "TikTok", serviceType: "Seguidores", originalPrice: "R$1.199,90", price: "R$499,90", priceNum: 499.9, quantity: "100.000 Seguidores", features: segFeatures },
];

export const ttCurtidas: PlanData[] = [
  { id: "tt-curt-500", name: "Starter", platform: "TikTok", serviceType: "Curtidas", originalPrice: "R$29,90", price: "R$14,90", priceNum: 14.9, quantity: "500 Curtidas", features: curtidaFeatures },
  { id: "tt-curt-1k", name: "Básico", platform: "TikTok", serviceType: "Curtidas", originalPrice: "R$49,90", price: "R$24,90", priceNum: 24.9, quantity: "1.000 Curtidas", features: curtidaFeatures },
  { id: "tt-curt-5k", name: "Profissional", platform: "TikTok", serviceType: "Curtidas", originalPrice: "R$99,90", price: "R$49,90", priceNum: 49.9, quantity: "5.000 Curtidas", features: curtidaFeatures, highlighted: true },
  { id: "tt-curt-10k", name: "Elite", platform: "TikTok", serviceType: "Curtidas", originalPrice: "R$179,90", price: "R$79,90", priceNum: 79.9, quantity: "10.000 Curtidas", features: curtidaFeatures },
];

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
