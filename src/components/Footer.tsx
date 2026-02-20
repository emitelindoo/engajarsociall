import { Zap } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/30 py-10 px-4">
    <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="font-bold text-foreground text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>Engajar Social</span>
      </div>
      <p className="text-muted-foreground text-sm">© 2025 Engajar Social. Todos os direitos reservados.</p>
    </div>
  </footer>
);

export default Footer;
