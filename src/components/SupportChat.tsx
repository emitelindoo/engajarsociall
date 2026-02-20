import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  role: "bot" | "user";
  text: string;
}

const quickReplies = [
  "É seguro comprar aqui?",
  "Como funciona a entrega?",
  "Preciso informar minha senha?",
  "Os seguidores são reais?",
  "Quanto tempo demora?",
  "Tem garantia?",
];

const getAutoReply = (input: string): string => {
  const lower = input.toLowerCase();

  if (lower.includes("seguro") || lower.includes("confiável") || lower.includes("confiavel") || lower.includes("golpe") || lower.includes("fraude")) {
    return "Sim, somos 100% seguros! 🔒 Trabalhamos com criptografia de ponta a ponta e já atendemos mais de 50.000 clientes satisfeitos. Seus dados estão totalmente protegidos. Quer aproveitar e garantir seu plano agora?";
  }
  if (lower.includes("entrega") || lower.includes("demora") || lower.includes("tempo") || lower.includes("prazo") || lower.includes("quando")) {
    return "A entrega começa em até 5 minutos após a confirmação do pagamento! ⚡ Geralmente em menos de 1 hora você já percebe os resultados. É instantâneo! Quer garantir o seu agora?";
  }
  if (lower.includes("senha") || lower.includes("login") || lower.includes("acesso")) {
    return "Nunca pedimos sua senha! 🔐 Precisamos apenas do seu @ público. Sua conta fica 100% segura o tempo todo. Pode comprar tranquilamente!";
  }
  if (lower.includes("real") || lower.includes("reais") || lower.includes("fake") || lower.includes("bot") || lower.includes("robô")) {
    return "Nossos seguidores são perfis brasileiros de alta qualidade! 🇧🇷 Eles interagem naturalmente com seu conteúdo, aumentando seu engajamento real. Mais de 50.000 clientes podem confirmar!";
  }
  if (lower.includes("garantia") || lower.includes("reembolso") || lower.includes("devol")) {
    return "Oferecemos garantia de reposição! Se houver qualquer queda, repomos gratuitamente em até 30 dias. 💎 Você não tem nada a perder! Aproveite agora!";
  }
  if (lower.includes("preço") || lower.includes("preco") || lower.includes("valor") || lower.includes("desconto") || lower.includes("promoção") || lower.includes("promocao")) {
    return "Nossos preços são os mais competitivos do mercado! 🔥 E hoje temos uma promoção especial com até 60% de desconto. Essa oferta é por tempo limitado — aproveite agora antes que acabe!";
  }
  if (lower.includes("pix") || lower.includes("pagamento") || lower.includes("pagar")) {
    return "Aceitamos PIX para pagamento instantâneo! ✅ É rápido, seguro e sem burocracia. Após a confirmação, a entrega começa imediatamente. Vamos lá?";
  }
  if (lower.includes("funciona") || lower.includes("como")) {
    return "É super simples! 📱 1) Escolha seu plano, 2) Informe seu @, 3) Pague via PIX, 4) Pronto! Os seguidores começam a chegar em minutos. Quer começar agora?";
  }
  if (lower.includes("oi") || lower.includes("olá") || lower.includes("ola") || lower.includes("bom dia") || lower.includes("boa tarde") || lower.includes("boa noite") || lower.includes("eae") || lower.includes("hey") || lower.includes("hello")) {
    return "Olá! 👋 Seja bem-vindo(a) à Engajar Social! Como posso te ajudar? Estamos aqui para tirar todas as suas dúvidas e te ajudar a crescer nas redes sociais!";
  }
  if (lower.includes("obrigad") || lower.includes("valeu") || lower.includes("thanks")) {
    return "Por nada! 😊 Estamos sempre aqui para ajudar. Se precisar de qualquer coisa, é só chamar. Aproveite nossa promoção e garanta seu crescimento agora!";
  }

  return "Ótima pergunta! 😊 Somos a plataforma #1 em crescimento de redes sociais no Brasil, com mais de 50.000 clientes satisfeitos. Oferecemos entrega rápida, garantia de reposição e total segurança. Quer aproveitar nossos planos com desconto exclusivo?";
};

const SupportChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Olá! 👋 Sou a assistente da Engajar Social. Como posso te ajudar? Escolha uma opção abaixo ou digite sua dúvida!",
    },
  ]);
  const [input, setInput] = useState("");
  const [showPulse, setShowPulse] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const reply: Message = { role: "bot", text: getAutoReply(text) };
      setMessages((prev) => [...prev, reply]);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => { setOpen(!open); setShowPulse(false); }}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full ig-gradient-bg text-primary-foreground flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {showPulse && !open && (
          <span className="absolute inset-0 rounded-full ig-gradient-bg animate-ping opacity-40" />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[340px] max-h-[480px] bg-card border border-border rounded-2xl card-shadow flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="ig-gradient-bg px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-foreground">Suporte Engajar</p>
              <p className="text-[10px] text-primary-foreground/80 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Online agora
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[300px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "ig-gradient-bg text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {quickReplies.map((qr) => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/5 transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl ig-gradient-bg text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportChat;
