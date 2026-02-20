const Navbar = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-foreground">Engajar Social</span>
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollTo('precos')} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Preços</button>
          <button onClick={() => scrollTo('recursos')} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Recursos</button>
          <button onClick={() => scrollTo('depoimentos')} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Depoimentos</button>
          <button onClick={() => scrollTo('faq')} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">FAQ</button>
          <button onClick={() => scrollTo('precos')} className="ml-4 bg-accent text-accent-foreground px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
            Começar Agora
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
