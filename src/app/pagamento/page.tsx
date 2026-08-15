"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { BackHeader } from "@/components/BackHeader";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { useApp } from "@/lib/store";

const PIX_KEY = "00020.26009 75690.501989 92100.640008 1 91250000010500";

export default function PagamentoPage() {
  const router = useRouter();
  const { cartTotal, flash } = useApp();
  const [copied, setCopied] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const total = cartTotal > 0 ? cartTotal : 104.3;
  const totalLabel = "R$ " + total.toFixed(2).replace(".", ",");

  const copyPix = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(PIX_KEY).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploading(true);
      setProgress(0);
      const iv = setInterval(() => {
        setProgress((p) => {
          const next = Math.min(100, p + 20);
          if (next >= 100) {
            clearInterval(iv);
            setUploading(false);
            setReceipt(reader.result as string);
          }
          return next;
        });
      }, 150);
    };
    reader.readAsDataURL(file);
  };

  const confirmSend = () => {
    if (!receipt) return;
    flash("Comprovante enviado para análise!");
    setTimeout(() => router.push("/comprovante/aguardando"), 900);
  };

  return (
    <>
      <BackHeader title="Pagamento PIX" />
      <div className="absolute top-[96px] left-0 right-0 z-29 box-border px-4 py-3 bg-white border-b border-[#E5E5E5] flex items-center justify-between">
        <span className="text-sm font-medium text-[#999999]">Total do pedido</span>
        <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em", color: "#00B20B" }}>{totalLabel}</span>
      </div>

      <div className="ne-scroll absolute inset-x-0 top-[150px] bottom-[72px]">
        <div className="px-4 pt-5 pb-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em", color: "#000" }}>
              PIX - Transferência Instantânea
            </div>
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-[200px] h-[200px] rounded-lg overflow-hidden border border-[#E5E5E5]">
                <ImagePlaceholder label="QR Code PIX" />
              </div>
              <div className="text-xs text-[#999999] text-center">Aponte a câmera do seu celular</div>
            </div>

            <div className="flex flex-col gap-2">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>Chave PIX (Copia e Cola)</div>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={PIX_KEY}
                  className="flex-1 min-w-0 h-10 box-border px-3 border border-[#E5E5E5] rounded-lg bg-[#F5F5F5] text-[12.5px] text-[#5C6A62]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                />
                <button
                  type="button"
                  onClick={copyPix}
                  className="flex-none px-4 h-10 border-0 rounded-lg text-white cursor-pointer transition-colors"
                  style={{ background: copied ? "#009209" : "#00B20B", fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13 }}
                >
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[#F5F5F5]">
              <div className="text-xs leading-relaxed text-[#5C6A62]">1. Abra o app do seu banco</div>
              <div className="text-xs leading-relaxed text-[#5C6A62]">2. Escolha transferência por PIX</div>
              <div className="text-xs leading-relaxed text-[#5C6A62]">3. Aponte para o QR ou cole a chave</div>
              <div className="text-xs leading-relaxed text-[#5C6A62]">4. Digite o valor: {totalLabel}</div>
              <div className="text-xs leading-relaxed text-[#5C6A62]">5. Confirme e volte aqui</div>
            </div>
          </div>

          <div className="h-px bg-[#EDEFED]" />

          <div className="flex flex-col gap-2.5">
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", color: "#000" }}>
              Comprovar Pagamento
            </div>
            <div className="text-sm leading-snug text-[#5C6A62]">Após pagar, envie o comprovante para validação</div>

            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-14 border-0 rounded-2xl bg-ne-green text-white cursor-pointer flex items-center justify-center gap-2.5 hover:bg-[#009209] transition-colors"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15 }}
            >
              <Upload size={18} />
              <span>Selecionar Comprovante</span>
            </button>

            {receipt && (
              <div className="relative w-[100px] h-[100px] mt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={receipt} alt="Comprovante" className="w-[100px] h-[100px] object-cover rounded-xl border border-[#E5E5E5]" />
                <button
                  type="button"
                  onClick={() => setReceipt(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 border-0 rounded-full bg-[#012418] text-white cursor-pointer flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {uploading && (
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="text-xs text-[#5C6A62]">Enviando comprovante... {progress}%</div>
                <div className="h-1.5 rounded-full bg-[#EDEFED] overflow-hidden">
                  <div className="h-full rounded-full bg-ne-green transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <button
              type="button"
              onClick={confirmSend}
              disabled={!receipt}
              className="w-full h-14 border-0 rounded-[24px] text-white transition-colors"
              style={{
                background: receipt ? "#00B20B" : "#B9E8B4",
                fontFamily: "var(--font-archivo)",
                fontWeight: 700,
                fontSize: 16,
                cursor: receipt ? "pointer" : "not-allowed",
              }}
            >
              Enviar Comprovante
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full h-14 border-2 border-[#E5E5E5] rounded-[24px] bg-white text-black cursor-pointer hover:border-ne-green transition-colors"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16 }}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>

      <TabBar />
      <Toast />
    </>
  );
}
