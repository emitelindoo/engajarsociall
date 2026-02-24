import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, PartyPopper, Zap, ShieldCheck, Clock, Rocket, Upload, FileCheck, Loader2, Copy } from "lucide-react";
import { fbEvent } from "@/lib/fbpixel";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planName = searchParams.get("plan") || "Plano";
  const platform = searchParams.get("platform") || "Instagram";
  const amount = searchParams.get("amount") || "0";
  const username = searchParams.get("username") || "";
  const customerName = searchParams.get("name") || "Cliente";
  const customerEmail = searchParams.get("email") || "cliente@email.com";

  const [pixCode, setPixCode] = useState<string | null>(null);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixGenerated, setPixGenerated] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const purchaseFired = useRef(false);

  useEffect(() => {
    if (purchaseFired.current) return;
    purchaseFired.current = true;
    fbEvent("Purchase", {
      content_name: planName,
      content_category: platform,
      value: parseFloat(amount),
      currency: "BRL",
    });
  }, [planName, platform, amount]);

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
      setUploaded(true);
      toast.success("Comprovante enviado! Seus seguidores serão liberados imediatamente.");
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
          {/* Liberação Imediata - Obrigatório (PRIMEIRO) */}
          {!uploaded && (
            <div className="bg-card rounded-2xl border-2 border-accent/50 p-6 card-shadow relative overflow-hidden">
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
                <span className="text-2xl font-extrabold ig-gradient-text">R$19,90</span>
                <p className="text-[11px] text-muted-foreground mt-1">Pagamento via PIX • Liberação instantânea</p>
              </div>

              {/* PIX */}
              {!pixGenerated ? (
                <button
                  onClick={handleGeneratePix}
                  disabled={loadingPix}
                  className="w-full ig-gradient-bg text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
                >
                  {loadingPix ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Gerando PIX...</>
                  ) : (
                    <><Zap className="w-4 h-4" /> Gerar PIX de R$19,90</>
                  )}
                </button>
              ) : pixCode ? (
                <div className="bg-muted rounded-xl p-4 mb-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground text-center">Pague via PIX para liberar agora:</p>

                  <div className="flex justify-center">
                    <div className="bg-white p-3 rounded-xl">
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
                </div>
              ) : null}

              {/* Upload comprovante */}
              <div className="space-y-3">
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
                    <><Zap className="w-4 h-4" /> Enviar Comprovante e Liberar Agora</>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Pagamento seguro</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Garantia total</span>
              </div>
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

          {/* Confirmação do pedido */}
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
            <div className="flex items-center justify-center gap-6 mb-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-accent" /> Entrega em até 3 dias úteis</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> 100% Seguro</span>
            </div>
          </div>

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
