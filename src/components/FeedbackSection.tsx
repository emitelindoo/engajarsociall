import { Star } from "lucide-react";

const feedbacks = [
  {
    name: "Lucas Oliveira",
    username: "@lucasolv_",
    avatar: "LO",
    rating: 5,
    text: "Comprei 5.000 seguidores e recebi tudo em menos de 2 horas! Perfis brasileiros e engajamento real. Super recomendo!",
    date: "Há 2 dias",
  },
  {
    name: "Mariana Santos",
    username: "@mari.santos",
    avatar: "MS",
    rating: 5,
    text: "Terceira vez comprando aqui. Sempre entrega rápida e seguidores de qualidade. Meu perfil cresceu muito!",
    date: "Há 3 dias",
  },
  {
    name: "Pedro Henrique",
    username: "@pedroh_fit",
    avatar: "PH",
    rating: 5,
    text: "Tinha medo no começo, mas foi tudo perfeito. Seguidores reais, sem queda, e o suporte é muito atencioso.",
    date: "Há 5 dias",
  },
  {
    name: "Ana Clara Dias",
    username: "@anaclarad",
    avatar: "AC",
    rating: 5,
    text: "Melhor investimento pro meu negócio! Comprei o plano de 10k seguidores e as vendas aumentaram 40%. Incrível!",
    date: "Há 1 semana",
  },
  {
    name: "Rafael Mendes",
    username: "@rafa.mendes",
    avatar: "RM",
    rating: 5,
    text: "Comprei curtidas e seguidores juntos. Resultado imediato! Meu perfil ganhou muito mais credibilidade.",
    date: "Há 1 semana",
  },
  {
    name: "Beatriz Costa",
    username: "@biacosta.blog",
    avatar: "BC",
    rating: 5,
    text: "Paguei via PIX e em 5 minutos já começaram a chegar os seguidores. Processo super fácil e rápido!",
    date: "Há 2 semanas",
  },
  {
    name: "Gustavo Lima",
    username: "@gustavolima.dj",
    avatar: "GL",
    rating: 4,
    text: "Ótimo serviço! O selo de verificação deu um upgrade absurdo no meu perfil. Valeu cada centavo.",
    date: "Há 2 semanas",
  },
  {
    name: "Fernanda Rodrigues",
    username: "@fe.rodrigues",
    avatar: "FR",
    rating: 5,
    text: "Já testei várias plataformas e essa é disparado a melhor. Seguidores brasileiros de verdade, sem bot!",
    date: "Há 3 semanas",
  },
];

const FeedbackSection = () => (
  <section className="py-16 px-4 bg-muted/50">
    <div className="container mx-auto max-w-5xl">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          O que nossos clientes dizem
        </h2>
        <p className="text-muted-foreground text-sm">
          Mais de 50.000 clientes satisfeitos em todo o Brasil
        </p>
        <div className="flex items-center justify-center gap-1 mt-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-sm font-bold text-foreground ml-2">4.9/5</span>
          <span className="text-xs text-muted-foreground ml-1">(2.847 avaliações)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbacks.map((fb, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border p-5 card-shadow hover:card-shadow-hover transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full ig-gradient-bg flex items-center justify-center text-primary-foreground font-bold text-sm">
                {fb.avatar}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{fb.name}</p>
                <p className="text-xs text-muted-foreground">{fb.username}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">{fb.date}</span>
            </div>
            <div className="flex items-center gap-0.5 mb-2">
              {Array.from({ length: fb.rating }, (_, j) => (
                <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{fb.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeedbackSection;
