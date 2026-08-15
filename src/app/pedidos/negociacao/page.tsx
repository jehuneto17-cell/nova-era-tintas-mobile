"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, MessageCircle, ChevronDown, Clock3, MapPin } from "lucide-react";
import { Toast } from "@/components/Toast";
import { useToast } from "@/lib/toast";
import { useWhatsapp } from "@/lib/hooks";
import { subscribePedido } from "@/lib/pedidos";
import { pedidoTotal } from "@/lib/pedidoHelpers";
import { brl } from "@/lib/store";
import type { Pedido } from "@/lib/types";

function PedidoNegociacaoContent() {
  const router = useRouter();
  const params = useSearchParams();
  const pedidoId = params.get("id");
  const { flash } = useToast();
  const whatsapp = useWhatsapp();
  const [pedido, setPedido] = useState<Pedido | null | undefined>(undefined);
  const [itensOpen, setItensOpen] = useState(false);

  useEffect(() => {
    if (!pedidoId) return;
    return subscribePedido(pedidoId, setPedido);
  }, [pedidoId]);

  useEffect(() => {
    if (pedido && pedido.estado !== "em_negociacao") {
      router.replace(`/pedidos/${pedido.id}`);
    }
  }, [pedido, router]);

  const openWhatsapp = (mensagemPadrao: string) => {
    if (whatsapp?.numero) {
      const msg = encodeURIComponent(whatsapp.mensagem || mensagemPadrao);
      window.open(`https://wa.me/${whatsapp.numero.replace(/\D/g, "")}?text=${msg}`, "_blank");
    } else {
      flash("WhatsApp indisponível no momento");
    }
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

  if (pedido === undefined || pedido.estado !== "em_negociacao") {
    return (
      <div className="absolute inset-0 bg-white flex items-center justify-center">
        <span className="w-8 h-8 rounded-full border-[3px] border-[#E5E5E5] border-t-ne-green" style={{ animation: "ne-spin .8s linear infinite" }} />
      </div>
    );
  }

  const total = pedidoTotal(pedido);
  const negociacaoIniciada = pedido.historico[0];

  return (
    <div className="absolute inset-0 bg-[#F8F8F8]">
      <div className="absolute top-0 left-0 right-0 z-30 box-border px-3 pt-[46px] pb-2.5 bg-white border-b border-[#EDEFED] flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/pedidos")}
          className="flex-none w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center hover:bg-[#F5F5F5] hover:border-ne-green transition-colors"
        >
          <ChevronLeft size={18} color="#012418" strokeWidth={2.4} />
        </button>
        <div className="flex-1 text-center whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: "#012418" }}>
          Pedido em Negociação
        </div>
        <div className="flex-none w-10" />
      </div>

      <div className="ne-scroll absolute inset-x-0 top-[96px] bottom-[88px]">
        <div className="p-4 flex flex-col gap-2">
          <div
            className="bg-[#FFF8E5] border-l-4 border-[#FFB703] rounded-xl p-5 shadow-[0_1px_8px_rgba(0,0,0,.05)] flex flex-col items-center text-center"
            style={{ animation: "ne-fadein .22s ease-out" }}
          >
            <div className="w-14 h-14 rounded-full bg-[#FFB703]/16 flex items-center justify-center mb-3" style={{ animation: "ne-pulse 1.8s ease-in-out infinite" }}>
              <Clock3 size={30} color="#FFB703" strokeWidth={2} />
            </div>
            <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#012418", marginBottom: 8 }}>
              Seu pedido está em negociação
            </span>
            <span className="text-[13px] text-[#999999] leading-relaxed max-w-[290px]">
              Estamos conversando com você sobre este pedido. Fale com o vendedor para mais detalhes.
            </span>
            <div className="mt-3 flex items-center gap-1.5">
              <Clock3 size={13} color="#FFB703" strokeWidth={2.2} />
              <span className="text-xs font-semibold text-[#FFB703]">Sua resposta é importante! Responda em até 24h.</span>
            </div>
          </div>

          <div className="mt-4 bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-[0_1px_8px_rgba(0,0,0,.05)] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#012418]" style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace" }}>{pedido.numero}</span>
              <span className="whitespace-nowrap text-xs text-[#999999]">{new Date(pedido.criadoEm).toLocaleDateString("pt-BR")}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-[#012418]">Total do pedido</span>
              <span className="whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 14, color: "#012418" }}>{brl(total)}</span>
            </div>
            <button type="button" onClick={() => setItensOpen((s) => !s)} className="border-0 bg-transparent p-0 flex items-center justify-between cursor-pointer text-[#012418]">
              <span className="text-[13px]">{pedido.itens.length} produtos</span>
              <ChevronDown size={14} color="#999999" strokeWidth={2.2} className="transition-transform" style={{ transform: itensOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>
            {itensOpen && (
              <div className="flex flex-col gap-2.5 pt-2 border-t border-[#F5F5F5] mt-1" style={{ animation: "ne-fadein .18s ease-out" }}>
                {pedido.itens.map((it, i) => (
                  <div key={i} className="flex gap-2.5 items-center">
                    <div className="w-12 h-12 flex-none rounded-lg bg-[#F1F3F1] flex items-center justify-center">
                      <div className="w-5 h-5 rounded bg-[#C4CCC7]" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-px">
                      <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 13, color: "#012418" }}>{it.nome}</span>
                      <span className="text-[11px] text-[#999999]">{it.variacao} • {it.qtd} × {brl(it.preco)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 uppercase" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, color: "#012418" }}>Status</div>
          <div className="bg-[#F8F8F8] rounded-xl p-4 flex flex-col">
            <div className="flex gap-3">
              <div className="flex-none flex flex-col items-center w-3">
                <div className="w-3 h-3 rounded-full bg-[#FFB703] border-2 border-[#FFB703] box-border" />
                <div className="w-0.5 flex-1 min-h-[28px] bg-[#E5E5E5] my-0.5" />
              </div>
              <div className="flex-1 flex items-start justify-between gap-2.5 pb-3">
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 14, color: "#012418" }}>Em Negociação</span>
                <span className="whitespace-nowrap text-xs text-[#999999]">
                  {negociacaoIniciada ? new Date(negociacaoIniciada.quando).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-none flex items-center justify-center w-3">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#E5E5E5] box-border" />
              </div>
              <div className="flex-1 flex items-center justify-between gap-2.5">
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 14, color: "#999999" }}>Aguardando Pgto</span>
                <span className="text-xs text-[#999999]">pendente</span>
              </div>
            </div>
          </div>

          {pedido.endereco && (
            <div className="mt-4 bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-[0_1px_8px_rgba(0,0,0,.05)] flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} color="#00B20B" strokeWidth={2.2} />
                <span className="uppercase" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, color: "#012418" }}>Endereço de Entrega</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-[#012418]">{pedido.endereco}</span>
                <span className="text-[11px] text-[#999999]">{pedido.telefone}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 z-28 box-border px-4 pt-3.5 pb-[18px] bg-white border-t border-[#EDEFED]">
        <button
          type="button"
          onClick={() => openWhatsapp(`Olá! Tenho uma dúvida sobre o pedido ${pedido.numero}.`)}
          className="w-full h-12 border-0 rounded-xl bg-ne-blue text-white cursor-pointer flex items-center justify-center gap-2 hover:bg-[#00688F] transition-colors"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15 }}
        >
          <MessageCircle size={18} />
          <span>Falar com Vendedor</span>
        </button>
      </div>

      <Toast />
    </div>
  );
}

export default function PedidoNegociacaoPage() {
  return (
    <Suspense fallback={null}>
      <PedidoNegociacaoContent />
    </Suspense>
  );
}
