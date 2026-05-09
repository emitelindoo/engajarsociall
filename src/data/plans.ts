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
// Preço linear: cada 10 seguidores = R$0,15 (R$0,015 por seguidor).
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
  for (let q = 500; q < 2000; q += 50) steps.push(q);
  for (let q = 2000; q < 10000; q += 100) steps.push(q);
  for (let q = 10000; q < 50000; q += 500) steps.push(q);
  for (let q = 50000; q <= 500000; q += 5000) steps.push(q);

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

// ─── YOUTUBE ──────────────────────────────────────────────
const ytSegFeatures = ["Inscritos reais", "Entrega gradual", "Sem queda", "Sem senha", "Garantia de reposição"];
const ytCurtFeatures = ["Likes reais", "Distribuídos nos vídeos", "Entrega rápida", "Sem senha", "Garantia"];
const ytViewFeatures = ["Views reais", "Entrega instantânea", "Sem queda", "Sem senha", "Segurança garantida"];
const ytCommentFeatures = ["Comentários positivos", "Perfis reais", "Entrega em até 24h", "Sem senha", "Garantia"];

export const ytInscritos: PlanData[] = buildScalablePlans("yt-ins", "YouTube", "Inscritos", "Inscritos", ytSegFeatures);
export const ytCurtidas: PlanData[] = buildScalablePlans("yt-curt", "YouTube", "Likes", "Likes", ytCurtFeatures);

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

export const kwSeguidores: PlanData[] = buildScalablePlans("kw-seg", "Kwai", "Seguidores", "Seguidores", kwSegFeatures);
export const kwCurtidas: PlanData[] = buildScalablePlans("kw-curt", "Kwai", "Curtidas", "Curtidas", kwCurtFeatures);

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

export const fbSeguidores: PlanData[] = buildScalablePlans("fb-seg", "Facebook", "Seguidores", "Seguidores", fbSegFeatures);
export const fbCurtidas: PlanData[] = buildScalablePlans("fb-curt", "Facebook", "Curtidas", "Curtidas", fbCurtFeatures);

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

// ─── SELO DE VERIFICAÇÃO ──────────────────────────────────
const seloFeatures = ["Selo azul verificado", "Ativação em até 24h", "Suporte prioritário", "Sem senha necessária", "Garantia de permanência"];

export const seloVerificacao: PlanData[] = [
  { id: "selo-mensal", name: "Mensal", platform: "Verificação", serviceType: "Selo Verificado", originalPrice: "R$59,90", price: "R$29,90", priceNum: 29.9, quantity: "Selo Mensal", features: seloFeatures },
  { id: "selo-trimestral", name: "Trimestral", platform: "Verificação", serviceType: "Selo Verificado", originalPrice: "R$99,90", price: "R$49,90", priceNum: 49.9, quantity: "Selo Trimestral", features: [...seloFeatures, "Economia de 44%"], highlighted: true },
  { id: "selo-anual", name: "Anual", platform: "Verificação", serviceType: "Selo Verificado", originalPrice: "R$179,90", price: "R$84,90", priceNum: 84.9, quantity: "Selo Anual", features: [...seloFeatures, "Economia de 52%", "Melhor custo-benefício"] },
];

// ─── HELPERS ──────────────────────────────────────────────
const allPlans: PlanData[] = [
  ...igSeguidores, ...igCurtidas, ...igComentarios, ...igVisualizacoes,
  ...ttSeguidores, ...ttCurtidas, ...ttComentarios, ...ttVisualizacoes,
  ...ytInscritos, ...ytCurtidas, ...ytVisualizacoes, ...ytComentarios,
  ...kwSeguidores, ...kwCurtidas, ...kwVisualizacoes,
  ...fbSeguidores, ...fbCurtidas, ...fbVisualizacoes, ...fbComentarios,
  ...seloVerificacao,
];

// backward compat exports
export const instagramPlans = igSeguidores;
export const tiktokPlans = ttSeguidores;

export function getPlanById(id: string): PlanData | undefined {
  return allPlans.find((p) => p.id === id);
}
