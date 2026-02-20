import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, PartyPopper, Zap, ShieldCheck, Clock, Rocket, Upload, FileCheck, Loader2 } from "lucide-react";
import { fbEvent } from "@/lib/fbpixel";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planName = searchParams.get("plan") || "Plano";
  const platform = searchParams.get("platform") || "Instagram";
  const amount = searchParams.get("amount") || "0";
  const username = searchParams.get("username") || "";
  const transactionId = searchParams.get("txn") || "";

  const [showUpsell, setShowUpsell] = useState(true);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fbEvent("Purchase", {
      content_name: planName,
      content_category: platform,
      value: parseFloat(amount),
      currency: "BRL",
    });
  }, [planName, platform, amount]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 10MB.");
        return;
      }
      setReceiptFile(file);
    }
  };

  const handleUploadReceipt = async () => {
    if (!receiptFile) return;
    setUploading(true);

    try {
      const fileExt = receiptFile.name.split(".").pop();
      const fileName = `${transactionId || Date.now()}_upsell_${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("receipts")
        .upload(fileName, receiptFile);

      if (error) throw error;

      setUploaded(true);
      toast.success("Comprovante enviado com sucesso! Seus seguidores serão liberados imediatamente.");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar comprovante. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-lg space-y-6">
          {/* Confirmação */}
          <div className="bg-card rounded-2xl border border-primary/30 p-8 card-shadow text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
              Pagamento Confirmado! <PartyPopper className="w-6 h-6 text-accent" />
            </h1>

            <p className="text-muted-foreground mb-6">
              Seu pedido foi aprovado e já estamos processando a entrega.
            </p>

            <div className="bg-muted rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plano:</span>
                <span className="font-semibold text-foreground">{planName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plataforma:</span>
                <span className="font-semibold text-foreground">{platform}</span>
              </div>
              {username && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Perfil:</span>
                  <span className="font-semibold text-foreground">@{username.replace("@", "")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-semibold ig-gradient-text">R${parseFloat(amount).toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mb-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-accent" /> Entrega em até 3 dias úteis</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> 100% Seguro</span>
            </div>
          </div>

          {/* Upsell - Liberação Imediata */}
          {showUpsell && !uploaded && (
            <div className="bg-card rounded-2xl border-2 border-accent/50 p-6 card-shadow relative overflow-hidden">
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                ⚡ Oferta Exclusiva
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Rocket className="w-6 h-6 text-accent" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-bold text-foreground">Liberação Imediata dos Seguidores</h2>
                  <p className="text-xs text-muted-foreground">Fure a fila e receba AGORA!</p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 mb-4 space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-muted-foreground text-left">
                    <span className="font-medium text-foreground">Sem a liberação imediata:</span> seu pedido entra na fila de turbinamento e pode levar até <strong>3 dias úteis</strong> para ser processado.
                  </p>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Zap className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <p className="text-muted-foreground text-left">
                    <span className="font-medium text-foreground">Com a liberação imediata:</span> seus seguidores começam a chegar <strong>em minutos</strong>! Prioridade total no processamento.
                  </p>
                </div>
              </div>

              {/* Prova social */}
              <div className="bg-primary/5 border border-primary/10 rounded-lg px-3 py-2 mb-4 text-center">
                <p className="text-xs text-muted-foreground">
                  🔥 <strong className="text-foreground">87% dos clientes</strong> escolhem a liberação imediata
                </p>
              </div>

              {/* Preço */}
              <div className="text-center mb-4">
                <p className="text-xs text-muted-foreground mb-1">Investimento único</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-extrabold ig-gradient-text">R$19,90</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Pagamento via PIX • Liberação instantânea</p>
              </div>

              {/* PIX Info */}
              <div className="bg-muted rounded-xl p-4 mb-4 text-center space-y-2">
                <p className="text-sm font-semibold text-foreground">Faça o PIX de R$19,90 para:</p>
                <div className="bg-background rounded-lg p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Chave PIX (CPF)</p>
                  <p className="text-sm font-mono font-bold text-foreground select-all cursor-pointer" onClick={() => {
                    navigator.clipboard.writeText("12345678900");
                    toast.success("Chave PIX copiada!");
                  }}>
                    123.456.789-00
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">Clique para copiar</p>
                </div>
                <p className="text-xs text-muted-foreground">Após o pagamento, anexe o comprovante abaixo</p>
              </div>

              {/* Upload comprovante */}
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!receiptFile ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Clique para anexar o comprovante</span>
                    <span className="text-[10px] text-muted-foreground">Imagem ou PDF • Máx. 10MB</span>
                  </button>
                ) : (
                  <div className="border border-primary/30 bg-primary/5 rounded-xl p-3 flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm text-foreground truncate flex-1">{receiptFile.name}</span>
                    <button
                      onClick={() => { setReceiptFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Trocar
                    </button>
                  </div>
                )}

                <button
                  onClick={handleUploadReceipt}
                  disabled={!receiptFile || uploading}
                  className="w-full ig-gradient-bg text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Enviar Comprovante e Liberar Agora
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Pagamento seguro</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Garantia total</span>
              </div>

              <button
                onClick={() => setShowUpsell(false)}
                className="w-full text-center text-xs text-muted-foreground mt-4 hover:text-foreground transition-colors"
              >
                Não, prefiro aguardar na fila (até 3 dias úteis)
              </button>
            </div>
          )}

          {/* Sucesso do upload */}
          {uploaded && (
            <div className="bg-card rounded-2xl border border-primary/30 p-6 card-shadow text-center">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Rocket className="w-7 h-7 text-primary" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-foreground mb-1">Liberação Imediata Ativada! 🚀</h2>
              <p className="text-sm text-muted-foreground">
                Comprovante recebido! Seus seguidores começarão a chegar em minutos.
              </p>
            </div>
          )}

          {/* Botão voltar */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="ig-gradient-bg text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
