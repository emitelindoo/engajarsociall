import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Os seguidores são realmente brasileiros?", a: "Sim, 100% contas brasileiras reais e ativas. Não utilizamos bots." },
  { q: "Quanto tempo leva para receber?", a: "Iniciamos em até 24h após pagamento. Entrega gradual e natural." },
  { q: "Preciso informar minha senha?", a: "Nunca! Só precisamos do seu @ público." },
  { q: "E se eu perder seguidores?", a: "Garantia de reposição em todos os pacotes." },
  { q: "Pode prejudicar minha conta?", a: "Não. Crescimento natural com seguidores reais." },
  { q: "Quais formas de pagamento?", a: "Pagamento via PIX — rápido e seguro." },
];

const FAQ = () => (
  <section id="faq" className="py-16 px-4 bg-background">
    <div className="container mx-auto max-w-2xl">
      <h2 className="text-2xl font-bold text-center text-foreground mb-10">Perguntas Frequentes</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-xl border border-border px-4 card-shadow">
            <AccordionTrigger className="text-foreground font-semibold text-sm text-left hover:no-underline py-4">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm pb-4">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQ;
