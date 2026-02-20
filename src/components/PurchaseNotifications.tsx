import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

const names = [
  "Lucas M.", "Ana Clara S.", "Pedro H.", "Mariana L.", "João V.",
  "Beatriz R.", "Gabriel F.", "Isabela C.", "Rafael A.", "Larissa P.",
  "Thiago B.", "Camila O.", "Felipe D.", "Juliana N.", "Matheus G.",
  "Fernanda K.", "Bruno T.", "Amanda W.", "Diego S.", "Carolina M.",
  "Gustavo R.", "Letícia F.", "André L.", "Natália B.", "Vinícius C.",
  "Bruna A.", "Leonardo P.", "Aline D.", "Caio H.", "Patrícia S.",
];

const cities = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Salvador",
  "Fortaleza", "Recife", "Porto Alegre", "Brasília", "Goiânia",
  "Manaus", "Campinas", "Florianópolis", "Vitória", "Belém",
];

const plans = [
  "2.500 Seguidores", "5.000 Seguidores", "10.000 Seguidores",
  "1.000 Curtidas", "Selo de Verificação", "Visualizações de Stories",
];

const timeAgo = () => {
  const mins = Math.floor(Math.random() * 15) + 1;
  return `${mins} min atrás`;
};

const PurchaseNotifications = () => {
  const [notification, setNotification] = useState<{
    name: string;
    city: string;
    plan: string;
    time: string;
  } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      const n = {
        name: names[Math.floor(Math.random() * names.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        plan: plans[Math.floor(Math.random() * plans.length)],
        time: timeAgo(),
      };
      setNotification(n);
      setVisible(true);

      setTimeout(() => setVisible(false), 4000);
    };

    // First notification after 5s
    const initialTimeout = setTimeout(showNotification, 5000);

    // Then every 8-15s
    const interval = setInterval(showNotification, Math.random() * 7000 + 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!notification || !visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500 max-w-[320px]">
      <div className="bg-card border border-border rounded-2xl p-4 card-shadow flex items-start gap-3">
        <div className="w-10 h-10 rounded-full ig-gradient-bg flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {notification.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Comprou <span className="font-medium text-foreground">{notification.plan}</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {notification.city} • {notification.time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseNotifications;
