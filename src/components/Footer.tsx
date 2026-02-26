import { Rocket } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-8 px-4 bg-background">
    <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md brand-gradient-bg flex items-center justify-center">
          <Rocket className="w-3 h-3 text-primary-foreground" />
        </div>
        <span className="font-bold text-sm text-foreground">Engajar Social</span>
      </div>
      <p className="text-muted-foreground text-xs">© 2025 Engajar Social. Todos os direitos reservados.</p>
    </div>
  </footer>
);

export default Footer;
