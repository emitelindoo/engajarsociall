import { Instagram, Shield, Zap } from "lucide-react";

const Navbar = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Engajar Social</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('precos')} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Preços</button>
          <button onClick={() => scrollTo('recursos')} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Recursos</button>
          <button onClick={() => scrollTo('depoimentos')} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Depoimentos</button>
          <button onClick={() => scrollTo('faq')} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">FAQ</button>
        </div>
        <button onClick={() => scrollTo('precos')} className="bg-accent text-accent-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:brightness-110 transition-all flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Começar Agora
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
