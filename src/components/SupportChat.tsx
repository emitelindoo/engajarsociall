import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Instagram, Music2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fbEvent } from "@/lib/fbpixel";


interface ChatButton {
  label: string;
  planId?: string;
  platform: string;
  action?: "scroll";
}

interface Message {
  role: "bot" | "user";
  text: string;
  buttons?: ChatButton[];
}

const platformButtons: ChatButton[] = [
  { label: "📸 Planos Instagram", platform: "Instagram", action: "scroll" },
  { label: "🎵 Planos TikTok", platform: "TikTok", action: "scroll" },
];

const quickReplies = [
  "É seguro comprar?",
  "Como funciona?",
  "Preciso da senha?",
  "Os seguidores são reais?",
  "Tem garantia?",
];

const getAutoReply = (input: string): { text: string; buttons?: ChatButton[] } => {
  const lower = input.toLowerCase();

  // Always show platform buttons at the end for navigation
  const nav = platformButtons;

  if (lower.includes("seguro") || lower.includes("confiável") || lower.includes("confiavel") || lower.includes("golpe") || lower.includes("fraude")) {
    return { text: "Sim, somos 100% seguros! 🔒 Já atendemos mais de 50.000 clientes satisfeitos. Seus dados estão totalmente protegidos e nunca pedimos sua senha. Pode comprar tranquilamente!", buttons: nav };
  }
  if (lower.includes("entrega") || lower.includes("demora") || lower.includes("tempo") || lower.includes("prazo") || lower.includes("quando")) {
    return { text: "A entrega começa em até 5 minutos após a confirmação do pagamento! ⚡ Geralmente em menos de 1 hora você já percebe os resultados.", buttons: nav };
  }
  if (lower.includes("senha") || lower.includes("login") || lower.includes("acesso")) {
    return { text: "Nunca pedimos sua senha! 🔐 Precisamos apenas do seu @ público. Seu perfil fica totalmente seguro.", buttons: nav };
  }
  if (lower.includes("real") || lower.includes("reais") || lower.includes("fake") || lower.includes("bot") || lower.includes("robô")) {
    return { text: "Nossos seguidores são perfis brasileiros de alta qualidade! 🇧🇷 Eles interagem naturalmente com seu conteúdo, trazendo mais credibilidade ao seu perfil.", buttons: nav };
  }
  if (lower.includes("garantia") || lower.includes("reembolso") || lower.includes("devol")) {
    return { text: "Oferecemos garantia de reposição de 30 dias! 💎 Se houver qualquer queda, repomos automaticamente. Você não tem nada a perder!", buttons: nav };
  }
  if (lower.includes("preço") || lower.includes("preco") || lower.includes("valor") || lower.includes("desconto") || lower.includes("promoção") || lower.includes("promocao")) {
    return { text: "Nossos preços são os mais competitivos do mercado! 🔥 Estamos com até 60% de desconto por tempo limitado. Confira os planos abaixo! 👇", buttons: nav };
  }
  if (lower.includes("pix") || lower.includes("pagamento") || lower.includes("pagar")) {
    return { text: "Aceitamos PIX para pagamento instantâneo! ✅ Rápido, seguro e sem complicação.", buttons: nav };
  }
  if (lower.includes("instagram") || lower.includes("insta")) {
    return { text: "Temos planos incríveis para Instagram! 📸 Clique abaixo para conferir: 👇", buttons: [platformButtons[0]] };
  }
  if (lower.includes("tiktok") || lower.includes("tik tok") || lower.includes("tt")) {
    return { text: "Temos planos incríveis para TikTok! 🎵 Clique abaixo para conferir: 👇", buttons: [platformButtons[1]] };
  }
  if (lower.includes("funciona") || lower.includes("como")) {
    return { text: "É super simples! 📱 1) Escolha seu plano, 2) Informe seu @, 3) Pague via PIX, 4) Pronto! Os seguidores começam a chegar rapidinho.", buttons: nav };
  }
  if (lower.includes("oi") || lower.includes("olá") || lower.includes("ola") || lower.includes("bom dia") || lower.includes("boa tarde") || lower.includes("boa noite") || lower.includes("eae") || lower.includes("hey") || lower.includes("hello")) {
    return { text: "Olá! 👋 Seja bem-vindo(a) à Engajar Social! Quer crescer nas redes sociais? Escolha a plataforma abaixo! 👇", buttons: nav };
  }
  if (lower.includes("obrigad") || lower.includes("valeu") || lower.includes("thanks")) {
    return { text: "Por nada! 😊 Estamos aqui pra te ajudar. Se precisar de algo mais, é só perguntar!", buttons: nav };
  }

  return { text: "Somos a plataforma #1 em crescimento de redes sociais no Brasil! 🚀 Mais de 50.000 clientes satisfeitos. Escolha a plataforma: 👇", buttons: nav };
};

const SupportChat = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Olá! 👋 Sou a assistente da Engajar Social. Escolha a plataforma para ver nossos planos ou digite sua dúvida!",
      buttons: platformButtons,
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

  const handleButtonClick = (btn: ChatButton) => {
    if (btn.action === "scroll") {
      // Navigate to home and scroll to plans
      const sectionId = btn.platform === "Instagram" ? "instagram-plans" : "tiktok-plans";
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }, 500);
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }
      setOpen(false);
    } else if (btn.planId) {
      fbEvent("AddToCart", { content_name: btn.planId, content_category: btn.platform, currency: "BRL" });
      navigate(`/checkout/${btn.planId}`);
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const { text: replyText, buttons } = getAutoReply(text);
      const reply: Message = { role: "bot", text: replyText, buttons };
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
        <>
        {/* Mobile backdrop */}
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
        <div className="fixed bottom-20 right-4 left-4 md:left-auto z-50 md:w-[340px] max-h-[60vh] md:max-h-[480px] bg-card border border-border rounded-2xl card-shadow flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
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
                <div className="max-w-[85%]">
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "ig-gradient-bg text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.buttons && msg.buttons.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {msg.buttons.map((btn, idx) => (
                        <button
                          key={btn.planId || `${btn.platform}-${idx}`}
                          onClick={() => handleButtonClick(btn)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl border transition-colors text-xs font-semibold flex items-center gap-2 ${
                            btn.action === "scroll"
                              ? "border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary"
                              : "border-primary/30 bg-primary/5 hover:bg-primary/15 text-primary"
                          }`}
                        >
                          {btn.platform === "Instagram" ? <Instagram className="w-4 h-4 flex-shrink-0" /> : <Music2 className="w-4 h-4 flex-shrink-0" />}
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
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
        </>
      )}
    </>
  );
};

export default SupportChat;