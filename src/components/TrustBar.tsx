import { ShieldCheck, Clock, Lock, RefreshCw } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "Compra 100% Segura" },
  { icon: Clock, label: "Entrega em Minutos" },
  { icon: Lock, label: "Sem Pedir Senha" },
  { icon: RefreshCw, label: "Garantia de Reposição" },
];

const TrustBar = () => (
  <section className="py-5 px-4 border-b border-border bg-card">
    <div className="container mx-auto max-w-4xl">
      <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
        {badges.map((b) => (
          <div key={b.label} className="flex items-center gap-2 text-muted-foreground">
            <b.icon className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBar;
