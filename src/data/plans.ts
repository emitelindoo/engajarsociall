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
  { id: "ig-seg-500", name: "Starter", platform: "Instagram", serviceType: "Seguidores", originalPrice: "R$39,90", price: "R$19,90", priceNum: 19.9, quantity: "500 Seguidores", features: segFeatures },
  { id: "ig-seg-1k", name: "Básico", platform: "Instagram", serviceType: "Seguidores", originalPrice: "R$49,90", price: "R$29,90", priceNum: 29.9, quantity: "1.000 Seguidores", features: segFeatures },
  { id: "ig-seg-2500", name: "Intermediário", platform: "Instagram", serviceType: "Seguidores", originalPrice: "R$79,90", price: "R$39,90", priceNum: 39.9, quantity: "2.500 Seguidores", features: segFeatures },
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

// ─── YOUTUBE ──────────────────────────────────────────────
const ytSegFeatures = ["Inscritos reais", "Entrega gradual", "Sem queda", "Sem senha", "Garantia de reposição"];
const ytCurtFeatures = ["Likes reais", "Distribuídos nos vídeos", "Entrega rápida", "Sem senha", "Garantia"];
const ytViewFeatures = ["Views reais", "Entrega instantânea", "Sem queda", "Sem senha", "Segurança garantida"];
const ytCommentFeatures = ["Comentários positivos", "Perfis reais", "Entrega em até 24h", "Sem senha", "Garantia"];

export const ytInscritos: PlanData[] = [
  { id: "yt-ins-500", name: "Starter", platform: "YouTube", serviceType: "Inscritos", originalPrice: "R$49,90", price: "R$29,90", priceNum: 29.9, quantity: "500 Inscritos", features: ytSegFeatures },
  { id: "yt-ins-1k", name: "Básico", platform: "YouTube", serviceType: "Inscritos", originalPrice: "R$89,90", price: "R$49,90", priceNum: 49.9, quantity: "1.000 Inscritos", features: ytSegFeatures },
  { id: "yt-ins-2500", name: "Profissional", platform: "YouTube", serviceType: "Inscritos", originalPrice: "R$149,90", price: "R$79,90", priceNum: 79.9, quantity: "2.500 Inscritos", features: ytSegFeatures, highlighted: true },
  { id: "yt-ins-5k", name: "Elite", platform: "YouTube", serviceType: "Inscritos", originalPrice: "R$249,90", price: "R$129,90", priceNum: 129.9, quantity: "5.000 Inscritos", features: ytSegFeatures },
  { id: "yt-ins-10k", name: "Premium", platform: "YouTube", serviceType: "Inscritos", originalPrice: "R$449,90", price: "R$229,90", priceNum: 229.9, quantity: "10.000 Inscritos", features: ytSegFeatures },
  { id: "yt-ins-25k", name: "VIP", platform: "YouTube", serviceType: "Inscritos", originalPrice: "R$899,90", price: "R$449,90", priceNum: 449.9, quantity: "25.000 Inscritos", features: ytSegFeatures },
];

export const ytCurtidas: PlanData[] = [
  { id: "yt-curt-500", name: "Starter", platform: "YouTube", serviceType: "Likes", originalPrice: "R$29,90", price: "R$14,90", priceNum: 14.9, quantity: "500 Likes", features: ytCurtFeatures },
  { id: "yt-curt-1k", name: "Básico", platform: "YouTube", serviceType: "Likes", originalPrice: "R$49,90", price: "R$24,90", priceNum: 24.9, quantity: "1.000 Likes", features: ytCurtFeatures },
  { id: "yt-curt-2500", name: "Profissional", platform: "YouTube", serviceType: "Likes", originalPrice: "R$89,90", price: "R$44,90", priceNum: 44.9, quantity: "2.500 Likes", features: ytCurtFeatures, highlighted: true },
  { id: "yt-curt-5k", name: "Elite", platform: "YouTube", serviceType: "Likes", originalPrice: "R$149,90", price: "R$69,90", priceNum: 69.9, quantity: "5.000 Likes", features: ytCurtFeatures },
  { id: "yt-curt-10k", name: "Premium", platform: "YouTube", serviceType: "Likes", originalPrice: "R$249,90", price: "R$119,90", priceNum: 119.9, quantity: "10.000 Likes", features: ytCurtFeatures },
];

export const ytVisualizacoes: PlanData[] = [
  { id: "yt-views-1k", name: "Starter", platform: "YouTube", serviceType: "Visualizações", originalPrice: "R$24,90", price: "R$12,90", priceNum: 12.9, quantity: "1.000 Visualizações", features: ytViewFeatures },
  { id: "yt-views-5k", name: "Básico", platform: "YouTube", serviceType: "Visualizações", originalPrice: "R$49,90", price: "R$24,90", priceNum: 24.9, quantity: "5.000 Visualizações", features: ytViewFeatures },
  { id: "yt-views-10k", name: "Profissional", platform: "YouTube", serviceType: "Visualizações", originalPrice: "R$89,90", price: "R$44,90", priceNum: 44.9, quantity: "10.000 Visualizações", features: ytViewFeatures, highlighted: true },
  { id: "yt-views-50k", name: "Elite", platform: "YouTube", serviceType: "Visualizações", originalPrice: "R$199,90", price: "R$99,90", priceNum: 99.9, quantity: "50.000 Visualizações", features: ytViewFeatures },
  { id: "yt-views-100k", name: "Premium", platform: "YouTube", serviceType: "Visualizações", originalPrice: "R$349,90", price: "R$179,90", priceNum: 179.9, quantity: "100.000 Visualizações", features: ytViewFeatures },
];

export const ytComentarios: PlanData[] = [
  { id: "yt-com-10", name: "Starter", platform: "YouTube", serviceType: "Comentários", originalPrice: "R$34,90", price: "R$19,90", priceNum: 19.9, quantity: "10 Comentários", features: ytCommentFeatures },
  { id: "yt-com-25", name: "Básico", platform: "YouTube", serviceType: "Comentários", originalPrice: "R$59,90", price: "R$34,90", priceNum: 34.9, quantity: "25 Comentários", features: ytCommentFeatures },
  { id: "yt-com-50", name: "Profissional", platform: "YouTube", serviceType: "Comentários", originalPrice: "R$99,90", price: "R$54,90", priceNum: 54.9, quantity: "50 Comentários", features: ytCommentFeatures, highlighted: true },
  { id: "yt-com-100", name: "Elite", platform: "YouTube", serviceType: "Comentários", originalPrice: "R$169,90", price: "R$89,90", priceNum: 89.9, quantity: "100 Comentários", features: ytCommentFeatures },
];

// ─── KWAI ─────────────────────────────────────────────────
const kwSegFeatures = ["Seguidores reais", "Entrega gradual", "Sem queda", "Sem senha", "Garantia de reposição"];
const kwCurtFeatures = ["Curtidas reais", "Distribuídas nos vídeos", "Entrega rápida", "Sem senha", "Garantia"];
const kwViewFeatures = ["Views reais", "Entrega instantânea", "Sem queda", "Sem senha", "Segurança garantida"];

export const kwSeguidores: PlanData[] = [
  { id: "kw-seg-1k", name: "Starter", platform: "Kwai", serviceType: "Seguidores", originalPrice: "R$39,90", price: "R$19,90", priceNum: 19.9, quantity: "1.000 Seguidores", features: kwSegFeatures },
  { id: "kw-seg-2500", name: "Básico", platform: "Kwai", serviceType: "Seguidores", originalPrice: "R$69,90", price: "R$34,90", priceNum: 34.9, quantity: "2.500 Seguidores", features: kwSegFeatures },
  { id: "kw-seg-5k", name: "Profissional", platform: "Kwai", serviceType: "Seguidores", originalPrice: "R$99,90", price: "R$49,90", priceNum: 49.9, quantity: "5.000 Seguidores", features: kwSegFeatures, highlighted: true },
  { id: "kw-seg-10k", name: "Elite", platform: "Kwai", serviceType: "Seguidores", originalPrice: "R$179,90", price: "R$79,90", priceNum: 79.9, quantity: "10.000 Seguidores", features: kwSegFeatures },
  { id: "kw-seg-25k", name: "Premium", platform: "Kwai", serviceType: "Seguidores", originalPrice: "R$349,90", price: "R$149,90", priceNum: 149.9, quantity: "25.000 Seguidores", features: kwSegFeatures },
];

export const kwCurtidas: PlanData[] = [
  { id: "kw-curt-500", name: "Starter", platform: "Kwai", serviceType: "Curtidas", originalPrice: "R$24,90", price: "R$12,90", priceNum: 12.9, quantity: "500 Curtidas", features: kwCurtFeatures },
  { id: "kw-curt-1k", name: "Básico", platform: "Kwai", serviceType: "Curtidas", originalPrice: "R$39,90", price: "R$19,90", priceNum: 19.9, quantity: "1.000 Curtidas", features: kwCurtFeatures },
  { id: "kw-curt-5k", name: "Profissional", platform: "Kwai", serviceType: "Curtidas", originalPrice: "R$79,90", price: "R$39,90", priceNum: 39.9, quantity: "5.000 Curtidas", features: kwCurtFeatures, highlighted: true },
  { id: "kw-curt-10k", name: "Elite", platform: "Kwai", serviceType: "Curtidas", originalPrice: "R$149,90", price: "R$59,90", priceNum: 59.9, quantity: "10.000 Curtidas", features: kwCurtFeatures },
];

export const kwVisualizacoes: PlanData[] = [
  { id: "kw-views-1k", name: "Starter", platform: "Kwai", serviceType: "Visualizações", originalPrice: "R$19,90", price: "R$9,90", priceNum: 9.9, quantity: "1.000 Visualizações", features: kwViewFeatures },
  { id: "kw-views-5k", name: "Básico", platform: "Kwai", serviceType: "Visualizações", originalPrice: "R$39,90", price: "R$19,90", priceNum: 19.9, quantity: "5.000 Visualizações", features: kwViewFeatures },
  { id: "kw-views-10k", name: "Profissional", platform: "Kwai", serviceType: "Visualizações", originalPrice: "R$59,90", price: "R$29,90", priceNum: 29.9, quantity: "10.000 Visualizações", features: kwViewFeatures, highlighted: true },
  { id: "kw-views-50k", name: "Elite", platform: "Kwai", serviceType: "Visualizações", originalPrice: "R$129,90", price: "R$59,90", priceNum: 59.9, quantity: "50.000 Visualizações", features: kwViewFeatures },
];

// ─── FACEBOOK ─────────────────────────────────────────────
const fbSegFeatures = ["Seguidores reais", "Entrega gradual", "Sem queda", "Sem senha", "Garantia de reposição"];
const fbCurtFeatures = ["Curtidas reais", "Distribuídas nos posts", "Entrega rápida", "Sem senha", "Garantia"];
const fbViewFeatures = ["Views reais", "Entrega instantânea", "Sem queda", "Sem senha", "Segurança garantida"];
const fbCommentFeatures = ["Comentários positivos", "Perfis reais", "Entrega em até 24h", "Sem senha", "Garantia"];

export const fbSeguidores: PlanData[] = [
  { id: "fb-seg-1k", name: "Starter", platform: "Facebook", serviceType: "Seguidores", originalPrice: "R$49,90", price: "R$24,90", priceNum: 24.9, quantity: "1.000 Seguidores", features: fbSegFeatures },
  { id: "fb-seg-2500", name: "Básico", platform: "Facebook", serviceType: "Seguidores", originalPrice: "R$79,90", price: "R$39,90", priceNum: 39.9, quantity: "2.500 Seguidores", features: fbSegFeatures },
  { id: "fb-seg-5k", name: "Profissional", platform: "Facebook", serviceType: "Seguidores", originalPrice: "R$129,90", price: "R$59,90", priceNum: 59.9, quantity: "5.000 Seguidores", features: fbSegFeatures, highlighted: true },
  { id: "fb-seg-10k", name: "Elite", platform: "Facebook", serviceType: "Seguidores", originalPrice: "R$219,90", price: "R$99,90", priceNum: 99.9, quantity: "10.000 Seguidores", features: fbSegFeatures },
  { id: "fb-seg-25k", name: "Premium", platform: "Facebook", serviceType: "Seguidores", originalPrice: "R$449,90", price: "R$199,90", priceNum: 199.9, quantity: "25.000 Seguidores", features: fbSegFeatures },
];

export const fbCurtidas: PlanData[] = [
  { id: "fb-curt-500", name: "Starter", platform: "Facebook", serviceType: "Curtidas", originalPrice: "R$24,90", price: "R$12,90", priceNum: 12.9, quantity: "500 Curtidas", features: fbCurtFeatures },
  { id: "fb-curt-1k", name: "Básico", platform: "Facebook", serviceType: "Curtidas", originalPrice: "R$44,90", price: "R$22,90", priceNum: 22.9, quantity: "1.000 Curtidas", features: fbCurtFeatures },
  { id: "fb-curt-2500", name: "Profissional", platform: "Facebook", serviceType: "Curtidas", originalPrice: "R$79,90", price: "R$39,90", priceNum: 39.9, quantity: "2.500 Curtidas", features: fbCurtFeatures, highlighted: true },
  { id: "fb-curt-5k", name: "Elite", platform: "Facebook", serviceType: "Curtidas", originalPrice: "R$139,90", price: "R$64,90", priceNum: 64.9, quantity: "5.000 Curtidas", features: fbCurtFeatures },
];

export const fbVisualizacoes: PlanData[] = [
  { id: "fb-views-1k", name: "Starter", platform: "Facebook", serviceType: "Visualizações", originalPrice: "R$19,90", price: "R$9,90", priceNum: 9.9, quantity: "1.000 Visualizações", features: fbViewFeatures },
  { id: "fb-views-5k", name: "Básico", platform: "Facebook", serviceType: "Visualizações", originalPrice: "R$39,90", price: "R$19,90", priceNum: 19.9, quantity: "5.000 Visualizações", features: fbViewFeatures },
  { id: "fb-views-10k", name: "Profissional", platform: "Facebook", serviceType: "Visualizações", originalPrice: "R$69,90", price: "R$34,90", priceNum: 34.9, quantity: "10.000 Visualizações", features: fbViewFeatures, highlighted: true },
  { id: "fb-views-50k", name: "Elite", platform: "Facebook", serviceType: "Visualizações", originalPrice: "R$149,90", price: "R$69,90", priceNum: 69.9, quantity: "50.000 Visualizações", features: fbViewFeatures },
];

export const fbComentarios: PlanData[] = [
  { id: "fb-com-10", name: "Starter", platform: "Facebook", serviceType: "Comentários", originalPrice: "R$29,90", price: "R$14,90", priceNum: 14.9, quantity: "10 Comentários", features: fbCommentFeatures },
  { id: "fb-com-25", name: "Básico", platform: "Facebook", serviceType: "Comentários", originalPrice: "R$54,90", price: "R$29,90", priceNum: 29.9, quantity: "25 Comentários", features: fbCommentFeatures },
  { id: "fb-com-50", name: "Profissional", platform: "Facebook", serviceType: "Comentários", originalPrice: "R$94,90", price: "R$49,90", priceNum: 49.9, quantity: "50 Comentários", features: fbCommentFeatures, highlighted: true },
  { id: "fb-com-100", name: "Elite", platform: "Facebook", serviceType: "Comentários", originalPrice: "R$159,90", price: "R$84,90", priceNum: 84.9, quantity: "100 Comentários", features: fbCommentFeatures },
];

// ─── HELPERS ──────────────────────────────────────────────
const allPlans: PlanData[] = [
  ...igSeguidores, ...igCurtidas, ...igComentarios, ...igVisualizacoes,
  ...ttSeguidores, ...ttCurtidas, ...ttComentarios, ...ttVisualizacoes,
  ...ytInscritos, ...ytCurtidas, ...ytVisualizacoes, ...ytComentarios,
  ...kwSeguidores, ...kwCurtidas, ...kwVisualizacoes,
  ...fbSeguidores, ...fbCurtidas, ...fbVisualizacoes, ...fbComentarios,
];

// backward compat exports
export const instagramPlans = igSeguidores;
export const tiktokPlans = ttSeguidores;

export function getPlanById(id: string): PlanData | undefined {
  return allPlans.find((p) => p.id === id);
}
