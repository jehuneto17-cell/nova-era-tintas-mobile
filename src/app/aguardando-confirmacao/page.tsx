"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Check, Clock3 } from "lucide-react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Toast } from "@/components/Toast";
import { useApp } from "@/lib/store";

export default function AguardandoConfirmacaoPage() {
  const { flash } = useApp();
  const [showHomeBtn, setShowHomeBtn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHomeBtn(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const numero = "Ped001";
  const total = "R$ 150,00";
  const ctaBottom = showHomeBtn ? 166 : 112;
  const toastBottom = showHomeBtn ? 182 : 128;

  return (
    <div className="absolute inset-0 bg-[#F8F8F8]">
      <div className="absolute top-0 left-0 right-0 z-30 box-border px-3 pt-[46px] pb-3 bg-white border-b border-[#EDEFED] text-center">
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 19, letterSpacing: "-0.01em", color: "#012418" }}>
          Aguardando Confirmação
        </div>
      </div>

      <div className="ne-scroll absolute inset-x-0 top-[92px] transition-all" style={{ bottom: ctaBottom }}>
        <div className="p-4 flex flex-col gap-2">
          <div
            className="bg-white border border-[#E5E5E5] rounded-xl py-8 px-6 shadow-[0_1px_8px_rgba(0,0,0,.05)] flex flex-col items-center text-center gap-1.5"
            style={{ animation: "ne-fadein .25s ease-out" }}
          >
            <div className="relative w-[60px] h-[60px] mb-2.5">
              <div className="absolute inset-0 rounded-full border-[3px] border-[#E8F5E9] border-t-ne-green" style={{ animation: "ne-spin 1.4s linear infinite" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Check size={26} color="#00B20B" strokeWidth={2.6} />
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#012418" }}>Recebemos seu comprovante!</span>
            <span className="text-[13px] text-[#999999]">Estamos verificando o pagamento...</span>
            <div className="mt-1 flex items-center gap-1.5">
              <Clock3 size={13} color="#0088B7" strokeWidth={2.2} />
              <span className="text-xs font-semibold text-[#0088B7]">Pode levar alguns minutos</span>
            </div>
          </div>

          <div className="mt-2 bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-[0_1px_8px_rgba(0,0,0,.05)] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="whitespace-nowrap text-sm font-semibold text-[#012418]" style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace" }}>
                #{numero}
              </span>
              <span className="whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 14, color: "#012418" }}>{total}</span>
            </div>
            <span className="text-xs font-bold text-[#FFB703]">Aguardando confirmação</span>
          </div>

          <div className="mt-4 bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-[0_1px_8px_rgba(0,0,0,.05)]">
            <div className="uppercase mb-3" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, color: "#012418" }}>
              Comprovante Enviado
            </div>
            <div className="w-[200px] max-w-full h-[150px] mx-auto rounded-lg border border-[#E5E5E5] overflow-hidden bg-[#F1F3F1]">
              <ImagePlaceholder label="Comprovante PIX" shape="rounded" />
            </div>
          </div>

          <div className="mt-4 bg-[#F0F4FF] border-l-4 border-[#0088B7] rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0088B7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418" }}>Próximos Passos</span>
            </div>
            <span className="text-xs leading-relaxed text-[#012418]">
              Assim que confirmarmos o pagamento, você receberá uma notificação. Acompanhe o status do pedido em &quot;Meus Pedidos&quot;.
            </span>
          </div>
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 z-28 box-border px-4 pt-3.5 pb-[18px] bg-white border-t border-[#EDEFED] flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => flash("Abrindo WhatsApp")}
          className="w-full h-12 border-0 rounded-xl bg-ne-blue text-white cursor-pointer flex items-center justify-center gap-2 hover:bg-[#00688F] transition-colors"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15 }}
        >
          <MessageCircle size={18} />
          <span>Falar com o Vendedor</span>
        </button>
        {showHomeBtn && (
          <a
            href="/"
            className="w-full h-11 border border-[#E5E5E5] rounded-xl bg-[#F5F5F5] cursor-pointer flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 14, color: "#0088B7", animation: "ne-fadein .2s ease-out" }}
          >
            Ir para Home
          </a>
        )}
      </div>

      <Toast bottom={toastBottom} />
    </div>
  );
}
