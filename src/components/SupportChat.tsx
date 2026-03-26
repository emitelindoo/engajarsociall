import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  from: "bot" | "user";
  text: string;
  options?: string[];
}

const AUTO_REPLIES: Record<string, { answer: string; followUp?: string[] }> = {
  "Como funciona?": {
    answer:
      "É simples! 😊\n\n1️⃣ Escolha o serviço e a quantidade\n2️⃣ Adicione ao carrinho\n3️⃣ Preencha seus dados e pague via PIX\n4️⃣ Receba automaticamente!\n\nTodo o processo é seguro e sem necessidade de senha.",
    followUp: ["Quanto tempo demora?", "É seguro?", "Preciso da senha?"],
  },
  "Quanto tempo demora?": {
    answer:
      "⚡ A entrega começa em poucos minutos após a confirmação do pagamento!\n\nSeguidores e curtidas são entregues de forma gradual para parecer natural. O prazo total depende da quantidade escolhida.",
    followUp: ["Como funciona?", "É seguro?", "Quero falar com atendente"],
  },
  "É seguro?": {
    answer:
      "🔒 100% seguro!\n\n✅ Não pedimos sua senha\n✅ Seu perfil não corre nenhum risco\n✅ Pagamento seguro via PIX\n✅ Garantia de reposição inclusa",
    followUp: ["Como funciona?", "Quanto tempo demora?", "Quero falar com atendente"],
  },
  "Preciso da senha?": {
    answer:
      "🔐 NÃO! Jamais pedimos sua senha.\n\nPrecisamos apenas do seu @ (para seguidores) ou do link da publicação (para curtidas, views e comentários).",
    followUp: ["É seguro?", "Como funciona?", "Quero falar com atendente"],
  },
  "Quero falar com atendente": {
    answer:
      "👋 Clique no botão abaixo para entrar no nosso grupo de suporte no WhatsApp!",
    followUp: ["Como funciona?", "É seguro?"],
    action: { label: "Abrir WhatsApp", url: "https://chat.whatsapp.com/G6t4if0sBK0JeRePlp36ic" },
  },
};

const INITIAL_MESSAGE: Message = {
  from: "bot",
  text: "Olá! 👋 Sou o assistente da Engajar Social. Como posso te ajudar?",
  options: ["Como funciona?", "Quanto tempo demora?", "É seguro?", "Preciso da senha?", "Quero falar com atendente"],
};

const SupportChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOption = (option: string) => {
    const userMsg: Message = { from: "user", text: option };
    const reply = AUTO_REPLIES[option];

    if (reply) {
      const botMsg: Message = {
        from: "bot",
        text: reply.answer,
        options: reply.followUp,
      };
      setMessages((prev) => [...prev, userMsg, botMsg]);
    } else {
      setMessages((prev) => [
        ...prev,
        userMsg,
        { from: "bot", text: "Desculpe, não entendi. Tente uma das opções abaixo.", options: INITIAL_MESSAGE.options },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full ig-gradient-bg text-primary-foreground flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-4 left-4 md:left-auto z-50 md:w-[370px] bg-card border border-border rounded-2xl card-shadow overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300 flex flex-col" style={{ maxHeight: "70vh" }}>
          {/* Header */}
          <div className="ig-gradient-bg px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary-foreground">Suporte Engajar</p>
                <p className="text-[10px] text-primary-foreground/70">Online agora</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5 text-primary-foreground/80 hover:text-primary-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.from === "bot"
                      ? "bg-muted text-foreground rounded-bl-md"
                      : "bg-primary text-primary-foreground rounded-br-md ml-auto"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.options && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOption(opt)}
                        className="px-3 py-1.5 text-xs font-medium rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </>
  );
};

export default SupportChat;
