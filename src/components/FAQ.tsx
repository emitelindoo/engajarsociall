import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Os seguidores são realmente brasileiros?", a: "Sim, garantimos que 100% dos seguidores são contas brasileiras reais e ativas. Não utilizamos bots ou contas falsas em nosso serviço." },
  { q: "Quanto tempo leva para começar a receber os seguidores?", a: "Iniciamos a entrega em até 24 horas após a confirmação do pagamento. A velocidade de entrega varia de acordo com o pacote escolhido, mas sempre priorizamos um crescimento natural para não violar as políticas do Instagram." },
  { q: "Preciso fornecer minha senha do Instagram?", a: "Não! Nunca pedimos sua senha. Nosso sistema funciona apenas com seu nome de usuário público, sem necessidade de acesso à sua conta." },
  { q: "O que acontece se eu perder seguidores depois?", a: "Oferecemos garantia de reposição em todos os nossos pacotes. Se você perder seguidores dentro do período de garantia (que varia conforme o plano), repomos gratuitamente." },
  { q: "Isso pode prejudicar minha conta no Instagram?", a: "Não. Nosso serviço segue todas as diretrizes do Instagram e prioriza o crescimento natural. Trabalhamos com seguidores reais e entrega gradual para garantir a segurança da sua conta." },
  { q: "Quais formas de pagamento são aceitas?", a: "Aceitamos pagamento via PIX, que é a forma mais rápida e segura para concluir sua compra." },
];

const FAQ = () => (
  <section id="faq" className="py-20 px-4">
    <div className="container mx-auto max-w-3xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">Perguntas Frequentes</h2>
      <p className="text-center text-muted-foreground mb-12">
        Encontre respostas para as dúvidas mais comuns sobre nossos serviços.
      </p>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-border/30 px-4" style={{ background: 'var(--card-gradient)' }}>
            <AccordionTrigger className="text-foreground font-semibold text-left hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQ;
