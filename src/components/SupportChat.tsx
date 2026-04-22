import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ExternalLink, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Message {
  from: "bot" | "user";
  text: string;
  options?: string[];
  action?: { label: string; url: string };
  system?: boolean;
}

const AUTO_REPLIES: Record<string, { answer: string; followUp?: string[]; action?: { label: string; url: string } }> = {
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
      "Oi! Sou a Carla 💜 Tô aqui pra te ajudar. Me conta: você tá querendo turbinar qual rede social hoje?",
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
  const [aiMode, setAiMode] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, connecting]);

  useEffect(() => {
    if (aiMode) inputRef.current?.focus();
  }, [aiMode]);

  const sendToAI = async (userText: string, history: Message[]) => {
    setLoading(true);
    try {
      const aiMessages = history
        .filter((m) => m.text)
        .map((m) => ({
          role: m.from === "user" ? "user" : "assistant",
          content: m.text,
        }));
      aiMessages.push({ role: "user", content: userText });

      const { data, error } = await supabase.functions.invoke("sales-chat", {
        body: { messages: aiMessages },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const reply: string = data?.reply ?? "Pode repetir, amor? Não entendi 💜";
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (err) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : "Erro de conexão";
      toast({ title: "Ops", description: errorMsg, variant: "destructive" });
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Tive um probleminha aqui 😅 Se preferir, fala comigo no WhatsApp:",
          action: { label: "Abrir WhatsApp", url: "https://chat.whatsapp.com/G6t4if0sBK0JeRePlp36ic" },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOption = (option: string) => {
    const userMsg: Message = { from: "user", text: option };
    const reply = AUTO_REPLIES[option];

    if (option === "Quero falar com atendente") {
      // Mensagem de sistema "conectando com atendente"
      const systemMsg: Message = {
        from: "bot",
        text: "🔔 Conectando você com um atendente...",
        system: true,
      };
      setMessages((prev) => [...prev, userMsg, systemMsg]);
      setConnecting(true);

      // Após 2.5s, atendente "entra" no chat
      setTimeout(() => {
        const enteredMsg: Message = {
          from: "bot",
          text: "✅ Carla entrou no atendimento",
          system: true,
        };
        setMessages((prev) => [...prev, enteredMsg]);
        setConnecting(false);
        setAiMode(true);

        // Após mais 1.5s, Carla começa a "digitar" e manda saudação
        setTimeout(() => {
          setLoading(true);
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              { from: "bot", text: reply.answer },
            ]);
            setLoading(false);
          }, 1800);
        }, 1200);
      }, 2500);
      return;
    }

    if (reply) {
      const botMsg: Message = {
        from: "bot",
        text: reply.answer,
        options: reply.followUp,
        action: reply.action,
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

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Message = { from: "user", text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    await sendToAI(text, messages);
  };

  return (
    <>
      {/* Notificação de atendente disponível */}
      {showNotification && !open && (
        <div
          role="button"
          tabIndex={0}
          onClick={openFromNotification}
          onKeyDown={(e) => e.key === "Enter" && openFromNotification()}
          className="fixed bottom-24 right-4 left-4 md:left-auto md:w-[320px] z-50 bg-card border border-border rounded-2xl shadow-2xl p-3 flex items-start gap-3 text-left animate-in slide-in-from-bottom-4 fade-in duration-500 hover:scale-[1.02] transition-transform"
        >
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full ig-gradient-bg flex items-center justify-center">
              <span className="text-base font-bold text-primary-foreground">C</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-sm font-bold text-foreground truncate">Carla • Engajar Social</p>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">agora</span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
              Oi! 👋 Vi que você tá olhando nossos planos. Posso te ajudar a escolher o ideal? 💜
            </p>
          </div>
          <X
            onClick={dismissNotification}
            className="w-4 h-4 text-muted-foreground hover:text-foreground flex-shrink-0 cursor-pointer"
          />
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full ig-gradient-bg text-primary-foreground flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
        aria-label="Abrir suporte"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {showNotification && !open && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
        )}
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
                <p className="text-sm font-bold text-primary-foreground">
                  {aiMode ? "Carla • Atendimento" : "Suporte Engajar"}
                </p>
                <p className="text-[10px] text-primary-foreground/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Online agora
                </p>
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
                {msg.system ? (
                  <div className="text-center text-[11px] text-muted-foreground py-1 px-3 italic">
                    {msg.text}
                  </div>
                ) : (
                  <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.from === "bot"
                      ? "bg-muted text-foreground rounded-bl-md"
                      : "bg-primary text-primary-foreground rounded-br-md ml-auto"
                  }`}
                >
                  {msg.text}
                </div>
                )}
                {msg.action && (
                  <a
                    href={msg.action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-[#25D366] text-white hover:bg-[#1ebe57] transition-colors shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {msg.action.label}
                  </a>
                )}
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
            {(loading || connecting) && (
              <div className="bg-muted text-foreground rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input (apenas no modo IA) */}
          {aiMode && (
            <form onSubmit={handleSend} className="border-t border-border p-3 flex items-center gap-2 flex-shrink-0 bg-background">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                disabled={loading}
                className="flex-1 px-3 py-2 text-sm rounded-full bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-full ig-gradient-bg text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:scale-105 transition-transform"
                aria-label="Enviar"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default SupportChat;
