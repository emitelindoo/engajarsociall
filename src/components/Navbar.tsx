import { Instagram, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    setOpen(false);
    navigate("/");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="ig-gradient-border">
            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
              <Instagram className="w-4 h-4 text-foreground" />
            </div>
          </div>
          <span className="font-bold text-foreground text-base">Engajar Social</span>
        </button>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <button onClick={() => scrollTo("precos")} className="text-muted-foreground hover:text-foreground transition-colors font-medium">Preços</button>
          <button onClick={() => scrollTo("recursos")} className="text-muted-foreground hover:text-foreground transition-colors font-medium">Recursos</button>
          <button onClick={() => scrollTo("depoimentos")} className="text-muted-foreground hover:text-foreground transition-colors font-medium">Depoimentos</button>
          <button onClick={() => scrollTo("faq")} className="text-muted-foreground hover:text-foreground transition-colors font-medium">FAQ</button>
          <button onClick={() => scrollTo("precos")} className="ig-gradient-bg text-primary-foreground px-5 py-2 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
            Começar Agora
          </button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <button onClick={() => scrollTo("precos")} className="block w-full text-left text-sm font-medium text-foreground">Preços</button>
          <button onClick={() => scrollTo("recursos")} className="block w-full text-left text-sm font-medium text-foreground">Recursos</button>
          <button onClick={() => scrollTo("depoimentos")} className="block w-full text-left text-sm font-medium text-foreground">Depoimentos</button>
          <button onClick={() => scrollTo("faq")} className="block w-full text-left text-sm font-medium text-foreground">FAQ</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
