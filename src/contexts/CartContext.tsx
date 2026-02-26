import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { PlanData } from "@/data/plans";

export interface CartItem {
  plan: PlanData;
  qty: number;
  target: string; // @ for followers, post link for likes/views/comments
}

interface CartCtx {
  items: CartItem[];
  addItem: (plan: PlanData) => void;
  removeItem: (planId: string) => void;
  updateTarget: (planId: string, target: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartCtx | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

/** Returns the input label/placeholder based on service type */
export const getTargetLabel = (serviceType: string) => {
  if (serviceType === "Seguidores") return { label: "@ do perfil", placeholder: "@seuusuario" };
  return { label: "Link da publicação", placeholder: "https://instagram.com/p/..." };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((plan: PlanData) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.plan.id === plan.id);
      if (existing) return prev;
      return [...prev, { plan, qty: 1, target: "" }];
    });
  }, []);

  const removeItem = useCallback((planId: string) => {
    setItems((prev) => prev.filter((i) => i.plan.id !== planId));
  }, []);

  const updateTarget = useCallback((planId: string, target: string) => {
    setItems((prev) =>
      prev.map((i) => (i.plan.id === planId ? { ...i, target } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = useMemo(() => items.reduce((s, i) => s + i.plan.priceNum * i.qty, 0), [items]);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateTarget, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
};
