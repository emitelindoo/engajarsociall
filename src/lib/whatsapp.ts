import { CartItem } from "@/contexts/CartContext";

export const WHATSAPP_NUMBER = "5521985374068";

export const buildOrderMessage = (items: CartItem[], total: number) => {
  const lines = items.map(
    (i) => `• ${i.plan.quantity} — ${i.plan.serviceType} (${i.plan.platform}) — ${i.plan.price}`
  );

  return [
    "Olá! Quero finalizar meu pedido 🚀",
    "",
    ...lines,
    "",
    `Total: R$${total.toFixed(2).replace(".", ",")}`,
  ].join("\n");
};

export const openWhatsAppOrder = (items: CartItem[], total: number) => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildOrderMessage(items, total)
  )}`;
  window.open(url, "_blank", "noopener,noreferrer");
};
