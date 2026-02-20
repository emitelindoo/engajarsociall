const steps = [
  { num: 1, title: "Escolha o seu pacote de seguidores", desc: "Escolha o pacote de seguidores no Instagram que mais se adequa a você." },
  { num: 2, title: "Insira seu @usuário do Instagram e conclua o pedido", desc: "Digite seu nome de usuário (nunca solicitaremos sua senha) e faça o pagamento via PIX." },
  { num: 3, title: "Veja o seu Instagram decolar!", desc: "Relaxe na poltrona e observe seus novos seguidores chegando automaticamente ao seu perfil. É fácil assim 🚀" },
];

const HowItWorks = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Como comprar seguidores no Instagram passo a passo
        </h2>
        <p className="text-center text-muted-foreground mb-12">Veja abaixo como é simples, rápido e prático.</p>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {s.num}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={() => scrollTo('precos')} className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
            Escolher pacotes
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
