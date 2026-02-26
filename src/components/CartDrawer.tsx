import { ShoppingCart, X, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const CartDrawer = () => {
  const { items, removeItem, total, count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const goToCheckout = () => {
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
          <ShoppingCart className="w-5 h-5 text-foreground" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 ig-gradient-bg text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Meu Carrinho ({count})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Seu carrinho está vazio</p>
              <p className="text-muted-foreground text-xs mt-1">Adicione serviços para começar</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {items.map((item) => (
                <div
                  key={item.plan.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {item.plan.quantity}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {item.plan.serviceType} • {item.plan.platform}
                    </p>
                    <div className="mt-1">
                      <span className="text-xs line-through text-muted-foreground mr-1">
                        {item.plan.originalPrice}
                      </span>
                      <span className="text-sm font-bold ig-gradient-text">{item.plan.price}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.plan.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total</span>
                <span className="text-xl font-bold ig-gradient-text">
                  R${total.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <button
                onClick={goToCheckout}
                className="w-full ig-gradient-bg text-primary-foreground py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                Finalizar Pedido <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
