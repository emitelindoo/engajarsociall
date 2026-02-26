import { useState, useRef, useEffect } from "react";
import { Zap, Clock, Rocket, Upload, FileCheck, Loader2, Copy, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

interface UpsellCardProps {
  username: string;
  customerName: string;
  customerEmail: string;
  platform: string;
  onComplete: () => void;
  onSkip: () => void;
}

const UpsellCard = ({ username, customerName, customerEmail, platform, onComplete, onSkip }: UpsellCardProps) => {
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixGenerated, setPixGenerated] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [slotsLeft, setSlotsLeft] = useState(3);
  const [countdown, setCountdown] = useState(600); // 10 min

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const slotTimer = setTimeout(() => {
      setSlotsLeft(2);
      setTimeout(() => setSlotsLeft(1), 45000);
    }, 30000);
    return () => clearTimeout(slotTimer);
  }, []);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const handleGeneratePix = async () => {
    setLoadingPix(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          amount: 19.90,
          description: `Liberação Imediata - @${username.replace("@", "")}`,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_cpf: String(Math.floor(10000000000 + Math.random() * 89999999999)),
          customer_phone: "11999999999",
          plan_id: "upsell-liberacao",
          plan_name: "Liberação Imediata",
          platform,
          username: username.replace("@", ""),
          extras: [],
        },
      });
      if (error) throw error;
      if (data?.pix_code) {
        setPixCode(data.pix_code);
        setPixGenerated(true);
      }
    } catch (err) {
      console.error("Error generating upsell PIX:", err);
      toast.error("Erro ao gerar PIX. Tente novamente.");
    } finally {
      setLoadingPix(false);
    }
  };

  const handleCopyPix = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      toast.success("Código PIX copiado!");
    }
  };

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
      const fileName = `upsell_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from("receipts").upload(fileName, receiptFile);
      if (error) throw error;
      onComplete();
      toast.success("Comprovante enviado! Seus seguidores serão liberados imediatamente.");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar comprovante. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border-2 border-destructive/40 p-0 card-shadow relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Urgency banner */}
      <div className="bg-destructive text-destructive-foreground px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-bold">
        <AlertTriangle className="w-4 h-4 animate-pulse" />
        <span>⚠️ ATENÇÃO: Seus seguidores chegarão em até 3 dias úteis</span>
      </div>

      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 animate-bounce">
            <Rocket className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">Receba seus Seguidores AGORA!</h2>
          <p className="text-sm text-muted-foreground">
            Sem a liberação imediata, seus seguidores só começam a chegar em <strong className="text-destructive">3 dias úteis</strong>
          </p>
        </div>

        {/* Countdown */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-2 font-medium">⏳ Oferta expira em:</p>
          <div className="flex items-center justify-center gap-2">
            <div className="bg-destructive text-destructive-foreground rounded-lg px-3 py-2 min-w-[52px]">
              <span className="text-2xl font-black tabular-nums">{String(minutes).padStart(2, "0")}</span>
            </div>
            <span className="text-destructive font-black text-2xl">:</span>
            <div className="bg-destructive text-destructive-foreground rounded-lg px-3 py-2 min-w-[52px]">
              <span className="text-2xl font-black tabular-nums">{String(seconds).padStart(2, "0")}</span>
            </div>
          </div>
          <p className="text-[11px] text-destructive font-semibold mt-2">
            🔥 Apenas {slotsLeft} {slotsLeft === 1 ? "vaga" : "vagas"} para liberação imediata
          </p>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-3 text-center space-y-2">
            <Clock className="w-5 h-5 text-destructive mx-auto" />
            <p className="text-xs font-bold text-destructive">SEM liberação</p>
            <p className="text-[11px] text-muted-foreground">Seguidores chegam em até 3 dias úteis</p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center space-y-2 relative">
            <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[9px] font-bold px-2 py-0.5 rounded-full">
              POPULAR
            </div>
            <Zap className="w-5 h-5 text-primary mx-auto" />
            <p className="text-xs font-bold text-primary">COM liberação</p>
            <p className="text-[11px] text-muted-foreground">Seguidores chegam em minutos!</p>
          </div>
        </div>

        {/* Social proof */}
        <div className="bg-primary/5 border border-primary/10 rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-muted-foreground">
            ✅ <strong className="text-foreground">2.847 pessoas</strong> já usaram a liberação imediata hoje
          </p>
        </div>

        {/* Price */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground line-through mb-0.5">De R$39,90</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-black ig-gradient-text">R$19,90</span>
            <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-1 rounded-full">-50%</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Pagamento único via PIX</p>
        </div>

        {/* PIX section */}
        {!pixGenerated ? (
          <button
            onClick={handleGeneratePix}
            disabled={loadingPix}
            className="w-full ig-gradient-bg text-primary-foreground py-4 rounded-xl font-bold text-base hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            {loadingPix ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Gerando PIX...</>
            ) : (
              <><Zap className="w-5 h-5" /> QUERO RECEBER AGORA! - R$19,90</>
            )}
          </button>
        ) : pixCode ? (
          <div className="bg-muted rounded-xl p-4 space-y-3 border border-primary/20">
            <p className="text-sm font-bold text-foreground text-center">✅ PIX gerado! Pague agora:</p>

            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-xl shadow-md">
                <QRCodeSVG value={pixCode} size={180} />
              </div>
            </div>

            <div className="bg-background rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground mb-2 text-center">PIX Copia e Cola</p>
              <div className="relative">
                <p className="text-[10px] font-mono text-foreground break-all bg-muted rounded p-2 pr-10 max-h-20 overflow-y-auto">
                  {pixCode}
                </p>
                <button
                  onClick={handleCopyPix}
                  className="absolute top-1/2 -translate-y-1/2 right-2 bg-primary/10 hover:bg-primary/20 rounded-lg p-1.5 transition-colors"
                >
                  <Copy className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>

            <button
              onClick={handleCopyPix}
              className="w-full ig-gradient-bg text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copiar Código PIX
            </button>

            {/* Upload receipt - only after PIX generated */}
            <div className="pt-3 border-t border-border space-y-3">
              <p className="text-sm font-semibold text-foreground text-center">Após pagar, envie o comprovante:</p>

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
                  <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                ) : (
                  <><Zap className="w-4 h-4" /> Enviar e Liberar Agora</>
                )}
              </button>
            </div>
          </div>
        ) : null}

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Pagamento seguro</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Garantia total</span>
        </div>

        {/* Skip link */}
        <button
          onClick={onSkip}
          className="w-full text-center text-xs text-muted-foreground/60 hover:text-muted-foreground underline underline-offset-2 transition-colors pt-1"
        >
          Não, quero esperar 3 dias úteis →
        </button>
      </div>
    </div>
  );
};

export default UpsellCard;
