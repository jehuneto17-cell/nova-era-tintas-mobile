"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MoreVertical, MessageCircle, Star } from "lucide-react";
import { subscribePedido } from "@/lib/pedidos";
import { pedidoTotal, pedidoSubtotal, STATUS_META } from "@/lib/pedidoHelpers";
import { brl } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { useWhatsapp } from "@/lib/hooks";
import type { Pedido } from "@/lib/types";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export default function PedidoDetalhePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { flash } = useToast();
  const whatsapp = useWhatsapp();

  const [pedido, setPedido] = useState<Pedido | null | undefined>(undefined);

  useEffect(() => {
    return subscribePedido(params.id, setPedido);
  }, [params.id]);

  const openWhatsapp = () => {
    if (whatsapp?.numero) {
      const msg = encodeURIComponent(whatsapp.mensagem || "Olá! Preciso de ajuda com meu pedido.");
      window.open(`https://wa.me/${whatsapp.numero.replace(/\D/g, "")}?text=${msg}`, "_blank");
    } else {
      flash("Abrindo conversa com o vendedor");
    }
  };

  if (pedido === undefined) {
    return (
      <div className="absolute inset-0 bg-white flex items-center justify-center">
        <span className="w-8 h-8 rounded-full border-[3px] border-[#E5E5E5] border-t-ne-green" style={{ animation: "ne-spin .8s linear infinite" }} />
      </div>
    );
  }

  if (pedido === null) {
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

  const meta = STATUS_META[pedido.estado];
  const subtotal = pedidoSubtotal(pedido);
  const total = pedidoTotal(pedido);
  const ultimoHistorico = pedido.historico[pedido.historico.length - 1];
  const comprovanteRecusado =
    pedido.estado === "aguardando_pagamento" &&
    ultimoHistorico?.observacao?.startsWith("Comprovante recusado:");

  return (
    <>
      <div className="ne-scroll absolute inset-0 bg-[#F7F8F7] pb-[104px]">
        {/* header */}
        <div className="sticky top-0 z-30 box-border px-3 pt-[46px] pb-2.5 bg-white border-b border-[#EDEFED] flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-none w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center hover:bg-[#F5F5F5] hover:border-ne-green transition-colors"
          >
            <ChevronLeft size={18} color="#012418" strokeWidth={2.4} />
          </button>
          <div
            className="flex-1 min-w-0 text-center overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: "#000" }}
          >
            Detalhes do Pedido
          </div>
          <button
            type="button"
            onClick={() => flash("Mais opções em breve")}
            className="flex-none w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center hover:bg-[#F5F5F5] hover:border-ne-green transition-colors"
          >
            <MoreVertical size={18} color="#012418" strokeWidth={2.2} />
          </button>
        </div>

        {/* summary card */}
        <div className="px-4 pt-4">
          <div className="p-4 rounded-2xl bg-white shadow-[0_2px_10px_rgba(1,36,24,.06)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 18, color: "#012418" }}>{pedido.numero}</div>
                <div className="mt-1 text-[12px] font-medium text-[#999999]">Nova Era Tintas</div>
              </div>
              <span
                className="flex-none px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{ background: meta.bg, color: meta.fg, fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 11 }}
              >
                {meta.label}
              </span>
            </div>
            <div className="h-px my-3 bg-[#EDEFED]" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-[#999999]">Data do pedido</div>
                <div className="mt-0.5" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418" }}>
                  {new Date(pedido.criadoEm).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold text-[#999999]">Total</div>
                <div className="mt-0.5" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, color: "#00B20B" }}>{brl(total)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* timeline */}
        <div className="px-4 pt-4">
          <div className="p-4 rounded-2xl bg-white shadow-[0_2px_10px_rgba(1,36,24,.06)]">
            <div className="mb-1" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14.5, color: "#012418" }}>
              Acompanhar Pedido
            </div>
            <div className="mt-3 flex flex-col">
              {pedido.historico.map((h, i) => {
                const isLast = i === pedido.historico.length - 1;
                const hMeta = STATUS_META[h.estado as keyof typeof STATUS_META];
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex-none flex flex-col items-center">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-none"
                        style={{ background: hMeta?.bg ?? "#012418" }}
                      >
                        <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 11, color: hMeta?.fg ?? "#FFFFFF" }}>{i + 1}</span>
                      </div>
                      {!isLast && <div className="w-[2px] flex-1" style={{ minHeight: 34, background: "#00B20B" }} />}
                    </div>
                    <div className={isLast ? "pb-0.5" : "pb-5"}>
                      <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}>
                        {hMeta?.label ?? h.estado}
                      </div>
                      <div className="mt-0.5 text-[11.5px] font-medium text-[#999999]">
                        {new Date(h.quando).toLocaleString("pt-BR")}
                        {h.observacao && ` · ${h.observacao}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* items */}
        <div className="px-4 pt-4">
          <div className="p-4 rounded-2xl bg-white shadow-[0_2px_10px_rgba(1,36,24,.06)]">
            <div className="mb-3" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14.5, color: "#012418" }}>
              Itens do Pedido
            </div>
            <div className="flex flex-col gap-3">
              {pedido.itens.map((it, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-16 h-16 flex-none rounded-[10px] overflow-hidden bg-[#F1F3F1]">
                    <ImagePlaceholder label={it.nome} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, lineHeight: 1.25, color: "#000" }}>{it.nome}</div>
                    <div className="mt-1 text-[11.5px] font-medium text-[#999999]">{it.variacao}</div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11.5px] font-semibold text-[#999999]">
                        {it.qtd}× {brl(it.preco)}
                      </span>
                      <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13.5, color: "#012418" }}>
                        {brl(it.preco * it.qtd)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px my-3.5 bg-[#EDEFED]" />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[13px] font-medium text-[#666]">
                <span>Subtotal</span>
                <span>{brl(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px] font-medium text-[#666]">
                <span>Frete</span>
                <span style={{ color: pedido.frete === 0 ? "#00B20B" : "#666" }}>{pedido.frete === 0 ? "Grátis" : brl(pedido.frete)}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>Total</span>
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 17, color: "#00B20B" }}>{brl(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* address */}
        {pedido.endereco && (
          <div className="px-4 pt-4">
            <div className="p-4 rounded-2xl bg-white shadow-[0_2px_10px_rgba(1,36,24,.06)]">
              <div className="mb-2" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14.5, color: "#012418" }}>
                Endereço de Entrega
              </div>
              <div className="text-[13px] font-medium leading-relaxed text-[#666]">
                {pedido.endereco}
                <br />
                {pedido.telefone}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* sticky footer */}
      <div className="absolute left-0 right-0 bottom-0 z-31 box-border px-4 py-3 bg-white border-t border-[#EDEFED] flex items-center gap-3">
        <button
          type="button"
          onClick={openWhatsapp}
          className="flex-1 h-[50px] rounded-2xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center gap-2 hover:bg-[#F5F5F5] transition-colors"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}
        >
          <MessageCircle size={17} strokeWidth={2} />
          Falar com Vendedor
        </button>

        {comprovanteRecusado ? (
          <button
            type="button"
            onClick={() => router.push(`/comprovante/recusado?id=${pedido.id}`)}
            className="flex-1 h-[50px] rounded-2xl border-0 bg-[#E63946] text-white cursor-pointer flex items-center justify-center gap-2 hover:bg-[#CC2E36] active:scale-[.98] transition-transform"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}
          >
            Ver Motivo da Recusa
          </button>
        ) : pedido.estado === "aguardando_pagamento" ? (
          <button
            type="button"
            onClick={() => router.push(`/pagamento?id=${pedido.id}`)}
            className="flex-1 h-[50px] rounded-2xl border-0 bg-ne-green text-white cursor-pointer flex items-center justify-center gap-2 hover:bg-[#00c40d] active:scale-[.98] transition-transform"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}
          >
            Pagar Agora
          </button>
        ) : pedido.estado === "entregue" ? (
          <button
            type="button"
            onClick={() => router.push(`/avaliar?pedido=${pedido.id}&item=0`)}
            className="flex-1 h-[50px] rounded-2xl border-0 bg-ne-green text-white cursor-pointer flex items-center justify-center gap-2 hover:bg-[#00c40d] active:scale-[.98] transition-transform"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}
          >
            <Star size={16} strokeWidth={2} />
            Avaliar Compra
          </button>
        ) : null}
      </div>

      <Toast bottom={120} />
    </>
  );
}
