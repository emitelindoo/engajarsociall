import { useState } from "react";
import { Check } from "lucide-react";

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
    <div className={`relative rounded-2xl p-6 flex flex-col ${highlighted ? 'border-2 border-accent shadow-lg shadow-accent/20' : 'border border-border/50'}`} style={{ background: 'var(--card-gradient)' }}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--highlight-badge)' }}>
          <span className="text-accent-foreground">SOMENTE HOJE!</span>
        </div>
      )}
      <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
      <p className="text-muted-foreground text-sm mb-4">({platform})</p>
      <div className="mb-4">
        <span className="text-muted-foreground line-through text-sm mr-2">{originalPrice}</span>
        <span className="text-3xl font-extrabold text-accent">{price}</span>
      </div>
      <p className="text-foreground font-semibold mb-4">{followers}</p>
      <ul className="space-y-2 mb-6 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-accent flex-shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground mb-2">
        Digite seu @ do {platform} ou cole o link do seu perfil abaixo:
      </p>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="@seuusuario"
        className="w-full rounded-lg bg-secondary/50 border border-border/50 px-4 py-2 text-foreground text-sm mb-4 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <button className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
        Comprar Agora
      </button>
    </div>
  );
};

export default PricingCard;
