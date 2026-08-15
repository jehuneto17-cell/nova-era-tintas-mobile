"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, MessageCircle, RefreshCw, X, Lightbulb } from "lucide-react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Toast } from "@/components/Toast";
import { useApp } from "@/lib/store";

const MOTIVO = {
  icon: "💰",
  titulo: "Valor não corresponde",
  descricao: "O valor no comprovante não bate com o valor do pedido. Verifique se digitou o valor correto no PIX.",
};

const DICAS = [
  "Certifique-se que o comprovante tem o valor correto: R$ 150,00",
  "Inclua a data e hora da transação",
  "O QR Code e a chave PIX devem estar visíveis",
  "Use uma foto nítida, bem iluminada",
  "Se tiver dúvida, fale com o vendedor",
];

export default function ComprovanteRecusadoPage() {
  const router = useRouter();
  const { flash } = useApp();

  return (
    <div className="absolute inset-0 bg-[#F8F8F8]">
      <div className="absolute top-0 left-0 right-0 z-30 box-border px-3 pt-[46px] pb-2.5 bg-white border-b border-[#EDEFED] flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-none w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center hover:bg-[#F5F5F5] hover:border-[#E63946] transition-colors"
        >
          <ChevronLeft size={18} color="#012418" strokeWidth={2.4} />
        </button>
        <div className="flex-1 text-center whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: "#E63946" }}>
          Comprovante Recusado
        </div>
        <div className="flex-none w-10" />
      </div>

      <div className="ne-scroll absolute inset-x-0 top-[96px] bottom-[76px]">
        <div className="p-4 flex flex-col gap-2">
          <div
            className="bg-[#FEE5E5] border-l-4 border-[#E63946] rounded-xl p-5 shadow-[0_1px_8px_rgba(0,0,0,.05)] flex flex-col items-center text-center"
            style={{ animation: "ne-shake .35s ease-out" }}
          >
            <div
              className="w-[50px] h-[50px] rounded-full bg-[#E63946]/14 flex items-center justify-center mb-3"
              style={{ animation: "ne-pulse 1.6s ease-in-out infinite" }}
            >
              <X size={26} color="#E63946" strokeWidth={2.4} />
            </div>
            <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#012418", marginBottom: 8 }}>
              Seu comprovante foi recusado
            </span>
            <span className="text-[13px] text-[#999999] leading-relaxed max-w-[290px]">
              Não conseguimos validar o comprovante. Veja o motivo abaixo e tente novamente.
            </span>
          </div>

          <div className="mt-4 bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-[0_1px_8px_rgba(0,0,0,.05)]">
            <div className="uppercase mb-3" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, color: "#012418" }}>
              Motivo da Recusa
            </div>
            <div className="bg-[#FFF3E0] border-l-[3px] border-[#FF9500] rounded-lg p-3.5 flex gap-2.5">
              <span className="flex-none text-lg leading-none">{MOTIVO.icon}</span>
              <div className="flex flex-col gap-1">
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418" }}>{MOTIVO.titulo}</span>
                <span className="text-xs leading-relaxed text-[#012418]">{MOTIVO.descricao}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white border border-[#E5E5E5] rounded-xl p-3 shadow-[0_1px_8px_rgba(0,0,0,.05)] flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="whitespace-nowrap text-sm font-semibold text-[#012418]" style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace" }}>
                #Ped001
              </span>
              <span className="text-xs font-semibold text-[#FF9500]">Aguardando novo comprovante</span>
            </div>
            <span className="whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15, color: "#012418" }}>R$ 150,00</span>
          </div>

          <div className="mt-4 bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-[0_1px_8px_rgba(0,0,0,.05)]">
            <div className="uppercase mb-3" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, color: "#012418" }}>
              Comprovante Anterior
            </div>
            <div className="w-[150px] h-[100px] mx-auto rounded-lg border border-[#E5E5E5] overflow-hidden opacity-55 bg-[#F1F3F1]">
              <ImagePlaceholder label="Comprovante recusado" shape="rounded" />
            </div>
          </div>

          <div className="mt-4 bg-[#F0F4FF] border-l-4 border-[#0088B7] rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Lightbulb size={15} color="#0088B7" strokeWidth={2.2} />
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418" }}>Dicas para não errar</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {DICAS.map((d) => (
                <span key={d} className="text-xs text-[#012418]">
                  • {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 z-28 box-border px-4 pt-3 pb-4 bg-white border-t border-[#EDEFED] flex gap-2.5">
        <button
          type="button"
          onClick={() => flash("Abrindo WhatsApp")}
          className="flex-1 h-11 border border-[#E5E5E5] rounded-xl bg-[#F5F5F5] text-ne-blue cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#E5E5E5] transition-colors"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 13 }}
        >
          <MessageCircle size={15} />
          <span>Falar com Vendedor</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/comprovante/enviar")}
          className="flex-1 h-11 border-0 rounded-xl bg-[#E63946] text-white cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#CC2E36] transition-colors"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13 }}
        >
          <RefreshCw size={15} />
          <span>Enviar Outro</span>
        </button>
      </div>

      <Toast bottom={88} />
    </div>
  );
}
