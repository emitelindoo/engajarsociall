import { useState } from "react";
import { MessageCircle, X, ExternalLink } from "lucide-react";

const SupportChat = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    setShowMessage(true);
  };

  const goToTikTok = () => {
    window.open("https://www.tiktok.com/@engajarsocial", "_blank");
    setShowMessage(false);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={handleClick}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full ig-gradient-bg text-primary-foreground flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Warning Message */}
      {showMessage && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowMessage(false)}
          />
          <div className="fixed bottom-20 right-4 left-4 md:left-auto z-50 md:w-[360px] bg-card border border-border rounded-2xl card-shadow overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
            {/* Header */}
            <div className="ig-gradient-bg px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <p className="text-sm font-bold text-primary-foreground">Suporte Engajar</p>
              </div>
              <button onClick={() => setShowMessage(false)}>
                <X className="w-5 h-5 text-primary-foreground/80 hover:text-primary-foreground" />
              </button>
            </div>

            {/* Message Content */}
            <div className="p-5 space-y-4">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-foreground">
                👋 Olá! Nosso atendimento é feito pelo <strong>TikTok</strong>!
                <br /><br />
                📲 Siga nosso perfil <strong>@engajarsocial</strong> e envie uma mensagem. O atendimento é <strong>super rápido</strong> após você seguir e enviar mensagem!
                <br /><br />
                ⚡ Respondemos em poucos minutos!
              </div>

              <button
                onClick={goToTikTok}
                className="w-full ig-gradient-bg text-primary-foreground font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Ir para o TikTok @engajarsocial
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SupportChat;
