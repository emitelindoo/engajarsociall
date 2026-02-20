import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";

interface PricingCardProps {
  name: string;
  platform: string;
  originalPrice: string;
  price: string;
  followers: string;
  features: string[];
  highlighted?: boolean;
}

const PricingCard = ({ name, platform, originalPrice, price, followers, features, highlighted }: PricingCardProps) => {
  const [username, setUsername] = useState("");

  return (
    <div
      className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
        highlighted
          ? 'border border-accent/40 glow-gold'
          : 'border border-border/40 hover:border-border'
      }`}
      style={{ background: 'var(--card-gradient)' }}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'var(--highlight-badge)' }}>
          <span className="text-accent-foreground">Mais Vendido</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>{name}</h3>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md font-medium">{platform}</span>
      </div>

      <div className="mb-1 mt-3">
        <span className="text-muted-foreground line-through text-sm mr-2">{originalPrice}</span>
      </div>
      <div className="mb-4">
        <span className="text-4xl font-extrabold text-gradient-gold">{price}</span>
      </div>

      <p className="text-foreground font-semibold mb-5 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary" />
        {followers}
      </p>

      <ul className="space-y-2.5 mb-6 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-accent flex-shrink-0" /> {f}
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground mb-2">
        Digite seu @ do {platform}:
      </p>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="@seuusuario"
        className="w-full rounded-lg bg-background border border-border px-4 py-2.5 text-foreground text-sm mb-4 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
      />
      <button className={`w-full py-3 rounded-xl font-bold transition-all ${
        highlighted
          ? 'bg-accent text-accent-foreground hover:brightness-110'
          : 'bg-primary text-primary-foreground hover:brightness-110'
      }`}>
        Comprar Agora
      </button>
    </div>
  );
};

export default PricingCard;
