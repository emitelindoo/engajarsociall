import { Heart, MessageCircle, Star } from "lucide-react";

const testimonials = [
  {
    name: "Juliana Costa",
    badge: "10.000 seguidores",
    text: "Melhor investimento que fiz pro meu perfil! Os seguidores são super engajados e meu alcance aumentou demais. As marcas começaram a me procurar! 💪🏻",
    likes: "2.1k",
    comments: "456",
    time: "3 dias atrás",
    img: "https://i.pinimg.com/236x/e9/35/9f/e9359f176da4d6107833971cda0a5bd1.jpg",
  },
  {
    name: "Carlos Mendes",
    badge: "5.000 seguidores",
    text: "Comprei o pacote Profissional e já recebi todos os seguidores. São todos reais e o suporte é excelente. Super indico! 📸✨",
    likes: "876",
    comments: "234",
    time: "1 semana atrás",
    img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
  {
    name: "Ana Silva",
    badge: "20.000 seguidores",
    text: "Em menos de 24h já estava recebendo. Todos brasileiros e ativos. Meu engajamento explodiu! Super recomendo! 🚀",
    likes: "1.2k",
    comments: "328",
    time: "2 dias atrás",
    img: "https://i.redd.it/b868b89e9rj91.jpg",
  },
];

const Testimonials = () => (
  <section id="depoimentos" className="py-16 px-4" style={{ background: "var(--ig-gradient-soft)" }}>
    <div className="container mx-auto max-w-4xl">
      <h2 className="text-2xl font-bold text-center text-foreground mb-10">O que dizem nossos clientes</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-card rounded-2xl p-5 border border-border card-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="ig-gradient-border">
                <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">{t.name}</h4>
                <span className="text-[11px] text-primary font-semibold">+{t.badge}</span>
              </div>
            </div>
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-accent fill-accent" />)}
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{t.text}</p>
            <div className="flex items-center gap-4 text-muted-foreground text-xs border-t border-border pt-3">
              <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-primary" /> {t.likes}</span>
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
