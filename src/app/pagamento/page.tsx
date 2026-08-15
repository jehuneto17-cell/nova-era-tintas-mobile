"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { BackHeader } from "@/components/BackHeader";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { brl } from "@/lib/store";
import { usePagamento } from "@/lib/hooks";
import { subscribePedido } from "@/lib/pedidos";
import { pedidoTotal } from "@/lib/pedidoHelpers";
import type { Pedido } from "@/lib/types";

function PagamentoContent() {
  const router = useRouter();
  const params = useSearchParams();
  const pedidoId = params.get("id");
  const pagamento = usePagamento();
  const [pedido, setPedido] = useState<Pedido | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!pedidoId) return;
    return subscribePedido(pedidoId, setPedido);
  }, [pedidoId]);

  const pixKey = pagamento?.pix_chave ?? "";

  const copyPix = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(pixKey).catch(() => {});
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  if (!pedidoId || pedido === null) {
    return (
      <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-3 px-8 text-center">
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#012418" }}>Pedido não encontrado</div>
        <button
          type="button"
          onClick={() => router.push("/pedidos")}
          className="mt-2 h-11 px-5 border-0 rounded-2xl bg-ne-green text-white cursor-pointer"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14 }}
        >
          Ver meus pedidos
        </button>
      </div>
    );
  }

  if (pedido === undefined) {
    return (
      <div className="absolute inset-0 bg-white flex items-center justify-center">
        <span className="w-8 h-8 rounded-full border-[3px] border-[#E5E5E5] border-t-ne-green" style={{ animation: "ne-spin .8s linear infinite" }} />
      </div>
    );
  }

  const total = pedidoTotal(pedido);
  const totalLabel = brl(total);

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
                {pagamento?.pix_qr_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pagamento.pix_qr_url} alt="QR Code PIX" className="w-full h-full object-cover" />
                ) : (
                  <ImagePlaceholder label="QR Code PIX" />
                )}
              </div>
              <div className="text-xs text-[#999999] text-center">Aponte a câmera do seu celular</div>
            </div>

            <div className="flex flex-col gap-2">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>Chave PIX (Copia e Cola)</div>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={pixKey}
                  className="flex-1 min-w-0 h-10 box-border px-3 border border-[#E5E5E5] rounded-lg bg-[#F5F5F5] text-[12.5px] text-[#5C6A62]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                />
                <button
                  type="button"
                  onClick={copyPix}
                  disabled={!pixKey}
                  className="flex-none px-4 h-10 border-0 rounded-lg text-white cursor-pointer transition-colors disabled:opacity-40"
                  style={{ background: copied ? "#009209" : "#00B20B", fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13 }}
                >
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[#F5F5F5]">
              {pagamento?.pix_instrucoes ? (
                <div className="text-xs leading-relaxed text-[#5C6A62] whitespace-pre-line">{pagamento.pix_instrucoes}</div>
              ) : (
                <>
                  <div className="text-xs leading-relaxed text-[#5C6A62]">1. Abra o app do seu banco</div>
                  <div className="text-xs leading-relaxed text-[#5C6A62]">2. Escolha transferência por PIX</div>
                  <div className="text-xs leading-relaxed text-[#5C6A62]">3. Aponte para o QR ou cole a chave</div>
                  <div className="text-xs leading-relaxed text-[#5C6A62]">4. Digite o valor: {totalLabel}</div>
                  <div className="text-xs leading-relaxed text-[#5C6A62]">5. Confirme e volte aqui</div>
                </>
              )}
            </div>
          </div>

          <div className="h-px bg-[#EDEFED]" />

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => router.push(`/comprovante/enviar?id=${pedido.id}`)}
              className="w-full h-14 border-0 rounded-2xl bg-ne-green text-white cursor-pointer flex items-center justify-center gap-2.5 hover:bg-[#009209] transition-colors"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15 }}
            >
              Já enviei o comprovante
            </button>
            <button
              type="button"
              onClick={() => router.push(`/pedidos/${pedido.id}`)}
              className="w-full h-14 border-2 border-[#E5E5E5] rounded-2xl bg-white text-black cursor-pointer hover:border-ne-green transition-colors"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16 }}
            >
              Ver Pedido
            </button>
          </div>
        </div>
      </div>

      <TabBar />
      <Toast />
    </>
  );
}

export default function PagamentoPage() {
  return (
    <Suspense fallback={null}>
      <PagamentoContent />
    </Suspense>
  );
}
