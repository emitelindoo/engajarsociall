import { Instagram } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-10 px-4 bg-background">
    <div className="container mx-auto max-w-4xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="ig-gradient-border">
            <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
              <Instagram className="w-3 h-3 text-foreground" />
            </div>
          </div>
          <span className="font-bold text-sm text-foreground">Engajar Social</span>
        </div>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <button onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-foreground transition-colors">FAQ</button>
          <button onClick={() => document.getElementById("depoimentos")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-foreground transition-colors">Avaliações</button>
          <a href="https://chat.whatsapp.com/G6t4if0sBK0JeRePlp36ic" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Suporte</a>
        </div>
      </div>
      <div className="border-t border-border pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-muted-foreground text-[11px]">© 2025 Engajar Social. Todos os direitos reservados.</p>
        <p className="text-muted-foreground text-[11px]">Pagamento seguro via PIX</p>
      </div>
    </div>
  </footer>
);

export default Footer;
