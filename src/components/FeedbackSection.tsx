import { Star, CheckCircle2 } from "lucide-react";

const feedbacks = [
  {
    name: "Juliana Costa",
    username: "@julianac_",
    rating: 5,
    text: "Comprei 5.000 seguidores pro meu perfil de loja e já notei diferença no alcance dos stories. Recebi tudo em umas 2 horas.",
    date: "3 dias atrás",
    verified: true,
  },
  {
    name: "Carlos Mendes",
    username: "@carlosmendes.foto",
    rating: 5,
    text: "Já é a segunda vez que compro aqui. Sempre entrega certinho e os seguidores não caem. O suporte pelo WhatsApp é rápido.",
    date: "5 dias atrás",
    verified: true,
  },
  {
    name: "Ana Silva",
    username: "@anasilva.beauty",
    rating: 5,
    text: "Tinha receio, mas fiz o teste com 1.000 e deu certo. Depois comprei 10k. Meu perfil parece muito mais profissional agora.",
    date: "1 semana atrás",
    verified: true,
  },
  {
    name: "Pedro Henrique",
    username: "@pedroh_fit",
    rating: 5,
    text: "Comprei curtidas e seguidores juntos. O processo é muito fácil — paguei no PIX e já começou a chegar.",
    date: "1 semana atrás",
    verified: true,
  },
  {
    name: "Fernanda Rodrigues",
    username: "@fe.rodrigues",
    rating: 5,
    text: "Testei 3 sites diferentes antes e esse foi o único que entregou seguidores brasileiros de verdade, sem bot.",
    date: "2 semanas atrás",
    verified: true,
  },
  {
    name: "Gustavo Lima",
    username: "@gustavolima.dj",
    rating: 4,
    text: "Demorou um pouco mais que o esperado (umas 4h), mas veio tudo certinho. O selo de verificação ficou show.",
    date: "2 semanas atrás",
    verified: true,
  },
];

const FeedbackSection = () => (
  <section id="depoimentos" className="py-16 px-4" style={{ background: "var(--ig-gradient-soft)" }}>
    <div className="container mx-auto max-w-4xl">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Avaliações de clientes reais
        </h2>
        <p className="text-muted-foreground text-sm mb-3">
          Veja o que dizem quem já comprou
        </p>
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-4 h-4 fill-accent text-accent" />
          ))}
          <span className="text-sm font-bold text-foreground ml-2">4.9</span>
          <span className="text-xs text-muted-foreground ml-1">· 2.847 avaliações</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbacks.map((fb, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border p-5 card-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-xs">
                {fb.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-foreground text-sm">{fb.name}</p>
                  {fb.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                </div>
                <p className="text-[11px] text-muted-foreground">{fb.username}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">{fb.date}</span>
            </div>
            <div className="flex items-center gap-0.5 mb-2">
              {Array.from({ length: fb.rating }, (_, j) => (
                <Star key={j} className="w-3 h-3 fill-accent text-accent" />
              ))}
              {fb.rating < 5 && Array.from({ length: 5 - fb.rating }, (_, j) => (
                <Star key={`e-${j}`} className="w-3 h-3 text-border" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{fb.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeedbackSection;
