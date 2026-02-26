export interface PlanData {
  id: string;
  name: string;
  platform: string;
  originalPrice: string;
  price: string;
  priceNum: number;
  followers: string;
  features: string[];
  highlighted?: boolean;
}

const features = ["100% Brasileiros", "Entrega imediata", "Garantia de reposição", "Sem informar senha", "Segurança garantida"];

export const instagramPlans: PlanData[] = [
  { id: "ig-basico", name: "Básico", platform: "Instagram", originalPrice: "R$49,90", price: "R$29,90", priceNum: 29.9, followers: "1.000 Seguidores", features },
  { id: "ig-iniciante", name: "Iniciante", platform: "Instagram", originalPrice: "R$79,90", price: "R$39,90", priceNum: 39.9, followers: "2.500 Seguidores", features },
  { id: "ig-profissional", name: "Profissional", platform: "Instagram", originalPrice: "R$119,90", price: "R$59,90", priceNum: 59.9, followers: "5.000 Seguidores", features },
  { id: "ig-elite", name: "Elite", platform: "Instagram", originalPrice: "R$199,90", price: "R$89,90", priceNum: 89.9, followers: "10.000 Seguidores", features, highlighted: true },
  { id: "ig-premium", name: "Premium", platform: "Instagram", originalPrice: "R$349,90", price: "R$149,90", priceNum: 149.9, followers: "20.000 Seguidores", features },
  { id: "ig-super", name: "Super", platform: "Instagram", originalPrice: "R$499,90", price: "R$199,90", priceNum: 199.9, followers: "30.000 Seguidores", features },
  { id: "ig-vip", name: "VIP", platform: "Instagram", originalPrice: "R$699,90", price: "R$299,90", priceNum: 299.9, followers: "50.000 Seguidores", features },
  { id: "ig-master", name: "Master", platform: "Instagram", originalPrice: "R$1.199,90", price: "R$499,90", priceNum: 499.9, followers: "120.000 Seguidores", features },
  { id: "ig-ultimate", name: "Ultimate", platform: "Instagram", originalPrice: "R$1.999,90", price: "R$799,90", priceNum: 799.9, followers: "200.000 Seguidores", features },
];

export const tiktokPlans: PlanData[] = [
  { id: "tt-basico", name: "Básico", platform: "TikTok", originalPrice: "R$119,90", price: "R$59,90", priceNum: 59.9, followers: "5.000 seguidores", features },
  { id: "tt-iniciante", name: "Iniciante", platform: "TikTok", originalPrice: "R$199,90", price: "R$89,90", priceNum: 89.9, followers: "10.000 seguidores", features },
  { id: "tt-profissional", name: "Profissional", platform: "TikTok", originalPrice: "R$349,90", price: "R$149,90", priceNum: 149.9, followers: "20.000 seguidores", features, highlighted: true },
  { id: "tt-elite", name: "Elite", platform: "TikTok", originalPrice: "R$499,90", price: "R$199,90", priceNum: 199.9, followers: "30.000 seguidores", features },
  { id: "tt-premium", name: "Premium", platform: "TikTok", originalPrice: "R$699,90", price: "R$299,90", priceNum: 299.9, followers: "50.000 seguidores", features },
  { id: "tt-super", name: "Super", platform: "TikTok", originalPrice: "R$1.199,90", price: "R$499,90", priceNum: 499.9, followers: "120.000 seguidores", features },
];

export function getPlanById(id: string): PlanData | undefined {
  return [...instagramPlans, ...tiktokPlans].find((p) => p.id === id);
}
