import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Os seguidores são realmente brasileiros?", a: "Sim. Trabalhamos exclusivamente com perfis brasileiros reais e ativos. Você vai notar que são contas com foto, posts e atividade normal — não são bots." },
  { q: "Quanto tempo leva para receber?", a: "A maioria dos pedidos começa a ser entregue em até 30 minutos após a confirmação do PIX. Pedidos maiores (acima de 10k) podem levar até 24h para entrega completa, pois é feita de forma gradual." },
  { q: "Preciso informar minha senha?", a: "Nunca. Para seguidores, precisamos apenas do seu @ (e o perfil precisa estar público). Para curtidas e views, basta o link do post." },
  { q: "E se eu perder seguidores?", a: "Todos os planos incluem garantia de reposição por 30 dias. Se houver queda, repomos automaticamente sem custo adicional." },
  { q: "Minha conta pode ser prejudicada?", a: "Não. O processo simula crescimento natural — os seguidores chegam gradualmente. Nunca tivemos nenhum caso de penalização." },
  { q: "Quais formas de pagamento vocês aceitam?", a: "No momento, aceitamos pagamento via PIX. É instantâneo e a entrega começa assim que confirmamos o pagamento." },
  { q: "Posso comprar para TikTok, YouTube e outras redes?", a: "Sim! Temos pacotes para Instagram, TikTok, YouTube, Kwai e Facebook. Basta selecionar a plataforma na hora da compra." },
];

const FAQ = () => (
  <section id="faq" className="py-16 px-4 bg-background">
    <div className="container mx-auto max-w-2xl">
      <h2 className="text-2xl font-bold text-center text-foreground mb-2">Dúvidas frequentes</h2>
      <p className="text-center text-muted-foreground text-sm mb-10">Tire suas dúvidas antes de comprar</p>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-xl border border-border px-4 card-shadow">
            <AccordionTrigger className="text-foreground font-semibold text-sm text-left hover:no-underline py-4">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm pb-4 leading-relaxed">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQ;
