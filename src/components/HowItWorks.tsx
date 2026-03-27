const steps = [
  { num: "1", title: "Escolha o serviço", desc: "Selecione a plataforma (Instagram, TikTok, etc.) e o tipo: seguidores, curtidas ou views." },
  { num: "2", title: "Informe seu @", desc: "Para seguidores, basta o @. Para curtidas e views, cole o link do post. Sem senha." },
  { num: "3", title: "Pague via PIX", desc: "Pagamento instantâneo. Assim que confirmado, a entrega começa automaticamente." },
];

const HowItWorks = () => (
  <section className="py-16 px-4 bg-background">
    <div className="container mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold text-center text-foreground mb-2">Como funciona</h2>
      <p className="text-center text-muted-foreground text-sm mb-10">Processo simples em 3 passos</p>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div key={s.num} className="relative bg-card rounded-2xl p-6 border border-border card-shadow text-center">
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              {s.num}
            </div>
            <h3 className="font-bold text-foreground mb-2 text-sm">{s.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
