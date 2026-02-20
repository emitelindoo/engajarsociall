import { Heart, MessageCircle } from "lucide-react";

const testimonials = [
  {
    name: "Juliana Costa",
    badge: "Ganhou 10.000 seguidores",
    text: "Melhor investimento que fiz pro meu perfil! Comprei o pacote Elite de 10k seguidores e o resultado foi incrível. Os seguidores são super engajados e meu alcance aumentou muito. As marcas começaram a me procurar e agora estou fechando várias parcerias! 💪🏻",
    likes: "2.1k",
    comments: "456",
    time: "3 dias atrás",
    img: "https://i.pinimg.com/236x/e9/35/9f/e9359f176da4d6107833971cda0a5bd1.jpg",
  },
  {
    name: "Carlos Mendes",
    badge: "Ganhou 5.000 seguidores",
    text: "Incrível! Comprei o pacote Profissional e já recebi todos os 5k seguidores. São todos reais, interagem com o conteúdo e o suporte é excelente. Vou indicar para todos os amigos! 📸✨",
    likes: "876",
    comments: "234",
    time: "1 semana atrás",
    img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
  {
    name: "Ana Silva",
    badge: "Ganhou 20.000 seguidores",
    text: "Melhor serviço que já usei! Adquiri o pacote Premium de 20k seguidores e em menos de 24h já estava recebendo. Todos brasileiros e ativos. Meu engajamento aumentou muito e as parcerias começaram a aparecer. Super recomendo! 🚀",
    likes: "1.2k",
    comments: "328",
    time: "2 dias atrás",
    img: "https://i.redd.it/b868b89e9rj91.jpg",
  },
];

const Testimonials = () => (
  <section id="depoimentos" className="py-20 px-4">
    <div className="container mx-auto max-w-5xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">O Que Dizem Nossos Clientes</h2>
      <p className="text-center text-muted-foreground mb-12">
        Veja os resultados reais de quem já utilizou nossos serviços e transformou sua presença no Instagram
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-2xl p-6 border border-border/30" style={{ background: 'var(--card-gradient)' }}>
            <div className="flex items-center gap-3 mb-4">
              <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-foreground text-sm">{t.name}</h4>
                <span className="text-xs text-accent font-semibold">{t.badge}</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4">{t.text}</p>
            <div className="flex items-center gap-4 text-muted-foreground text-xs">
              <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {t.likes}</span>
              <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {t.comments}</span>
              <span className="ml-auto">{t.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
