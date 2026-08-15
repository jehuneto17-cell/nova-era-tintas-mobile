"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, MessageCircle, CreditCard, Sparkles, MapPin } from "lucide-react";
import { Toast } from "@/components/Toast";
import { useToast } from "@/lib/toast";
import { useWhatsapp } from "@/lib/hooks";
import { subscribePedido } from "@/lib/pedidos";
import { pedidoSubtotal, pedidoTotal } from "@/lib/pedidoHelpers";
import { brl } from "@/lib/store";
import type { Pedido, PedidoItem } from "@/lib/types";

function chaveItem(it: PedidoItem) {
  return `${it.produtoId}|${it.variacao}`;
}

function ultimaEdicao(pedido: Pedido) {
  for (let i = pedido.historico.length - 1; i >= 0; i--) {
    if (pedido.historico[i].tipo === "edicao") return pedido.historico[i];
  }
  return null;
}

function PedidoAtualizadoContent() {
  const router = useRouter();
  const params = useSearchParams();
  const pedidoId = params.get("id");
  const { flash } = useToast();
  const whatsapp = useWhatsapp();
  const [pedido, setPedido] = useState<Pedido | null | undefined>(undefined);

  useEffect(() => {
    if (!pedidoId) return;
    return subscribePedido(pedidoId, setPedido);
  }, [pedidoId]);

  const openWhatsapp = () => {
    if (whatsapp?.numero) {
      const msg = encodeURIComponent(whatsapp.mensagem || "Olá! Tenho uma dúvida sobre as mudanças no meu pedido.");
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

  if (pedido === undefined) {
    return (
      <div className="absolute inset-0 bg-white flex items-center justify-center">
        <span className="w-8 h-8 rounded-full border-[3px] border-[#E5E5E5] border-t-ne-green" style={{ animation: "ne-spin .8s linear infinite" }} />
      </div>
    );
  }

  const edicao = ultimaEdicao(pedido);

  if (!edicao || !edicao.itensAnteriores) {
    return (
      <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-3 px-8 text-center">
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#012418" }}>Este pedido não tem revisões</div>
        <span className="text-[13px] text-[#999999]">Nenhuma alteração foi feita pelo vendedor até agora.</span>
        <button
          type="button"
          onClick={() => router.push(`/pedidos/${pedido.id}`)}
          className="mt-2 h-11 px-5 border-0 rounded-2xl bg-ne-green text-white cursor-pointer"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14 }}
        >
          Ver detalhes do pedido
        </button>
      </div>
    );
  }

  const itensAnteriores = edicao.itensAnteriores;
  const anterioresPorChave = new Map(itensAnteriores.map((it) => [chaveItem(it), it]));
  const atuaisPorChave = new Map(pedido.itens.map((it) => [chaveItem(it), it]));

  const linhas = pedido.itens.map((it) => {
    const anterior = anterioresPorChave.get(chaveItem(it));
    const mudou = !anterior || anterior.qtd !== it.qtd || anterior.preco !== it.preco;
    return { item: it, anterior: anterior ?? null, mudou };
  });
  const removidos = itensAnteriores.filter((it) => !atuaisPorChave.has(chaveItem(it)));

  const subtotalAnterior = itensAnteriores.reduce((s, it) => s + it.preco * it.qtd, 0);
  const subtotalAtual = pedidoSubtotal(pedido);
  const totalAnterior = subtotalAnterior + (edicao.freteAnterior ?? pedido.frete);
  const totalAtual = pedidoTotal(pedido);
  const diff = totalAtual - totalAnterior;

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
        <div className="flex-1 flex items-center justify-center gap-1.5 whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em", color: "#012418" }}>
          <Sparkles size={16} color="#FFB703" fill="#FFB703" />
          Pedido Atualizado!
        </div>
        <div className="flex-none w-10" />
      </div>

      <div className="ne-scroll absolute inset-x-0 top-[96px] bottom-[88px]">
        <div className="p-4 flex flex-col gap-2">
          <div className="bg-[#E8F5E9] border-l-4 border-ne-green rounded-xl p-4 shadow-[0_1px_8px_rgba(0,0,0,.05)] flex gap-3" style={{ animation: "ne-fadein .22s ease-out" }}>
            <div className="flex-none w-10 h-10 rounded-full bg-ne-green/14 flex items-center justify-center">
              <Sparkles size={20} color="#00B20B" />
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15, color: "#012418", marginBottom: 4 }}>
                Pedido Revisado pelo Vendedor
              </div>
              <div className="text-[13px] leading-relaxed text-[#999999]">
                O vendedor ajustou alguns itens para melhor atender você. Confira abaixo e prossiga para o pagamento.
              </div>
            </div>
          </div>

          <div className="mt-4 uppercase" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, color: "#012418" }}>Itens do Pedido (Atualizado)</div>
          <div className="flex flex-col gap-2.5">
            {linhas.map(({ item, anterior, mudou }) => (
              <div key={chaveItem(item)} className="bg-white border border-[#E5E5E5] rounded-xl p-3 flex gap-3">
                <div className="w-[60px] h-[60px] flex-none rounded-lg bg-[#F1F3F1] flex items-center justify-center">
                  <div className="w-6 h-6 rounded bg-[#C4CCC7]" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418" }}>{item.nome}</span>
                  <span className="text-[11px] text-[#999999]">{item.variacao}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-[#012418]">{item.qtd} × {brl(item.preco)}</span>
                    {mudou && <span className="px-1.5 py-px rounded bg-[#FFB703] text-white text-[10px] font-bold">MUDOU</span>}
                  </div>
                  <div className="flex items-baseline justify-between mt-0.5">
                    {mudou && anterior && (
                      <span className="text-[11px] text-[#999999] line-through">era {brl(anterior.preco * anterior.qtd)}</span>
                    )}
                    {mudou && !anterior && <span className="text-[11px] text-[#00B20B] font-semibold">novo item</span>}
                    <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418", marginLeft: "auto" }}>{brl(item.preco * item.qtd)}</span>
                  </div>
                </div>
              </div>
            ))}
            {removidos.map((it) => (
              <div key={chaveItem(it)} className="bg-white border border-[#E5E5E5] rounded-xl p-3 flex gap-3 opacity-60">
                <div className="w-[60px] h-[60px] flex-none rounded-lg bg-[#F1F3F1] flex items-center justify-center">
                  <div className="w-6 h-6 rounded bg-[#C4CCC7]" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418" }}>{it.nome}</span>
                  <span className="text-[11px] text-[#999999]">{it.variacao}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-[#012418] line-through">{it.qtd} × {brl(it.preco)}</span>
                    <span className="px-1.5 py-px rounded bg-[#E63946] text-white text-[10px] font-bold">REMOVIDO</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 uppercase" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, color: "#012418" }}>Resumo Financeiro</div>
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-[0_1px_8px_rgba(0,0,0,.05)] flex flex-col">
            <div className="flex items-baseline justify-between pb-2.5 border-b border-[#F5F5F5]">
              <span className="text-[13px] text-[#012418]">Subtotal</span>
              <div className="flex items-baseline gap-2">
                {subtotalAnterior !== subtotalAtual && <span className="text-[11px] text-[#999999] line-through">{brl(subtotalAnterior)}</span>}
                <span className="whitespace-nowrap text-[13px] text-[#012418]">{brl(subtotalAtual)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-[#F5F5F5]">
              <span className="text-[13px] text-[#012418]">Frete</span>
              <span className="text-[13px] font-bold" style={{ color: pedido.frete === 0 ? "#00B20B" : "#012418" }}>
                {pedido.frete === 0 ? "Grátis!" : brl(pedido.frete)}
              </span>
            </div>
            <div className="flex items-start justify-between pt-3">
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>Total</span>
              <div className="flex flex-col items-end gap-0.5">
                <span className="whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, color: diff < 0 ? "#00B20B" : diff > 0 ? "#E63946" : "#012418" }}>
                  {brl(totalAtual)}
                </span>
                {diff !== 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#999999] line-through">era {brl(totalAnterior)}</span>
                    <span className="text-xs font-bold" style={{ color: diff < 0 ? "#00D97E" : "#E63946" }}>
                      {diff < 0 ? "-" : "+"}
                      {brl(Math.abs(diff))}
                    </span>
                  </div>
                )}
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

      <div className="absolute left-0 right-0 bottom-0 z-28 box-border px-4 pt-3 pb-4 bg-white border-t border-[#EDEFED] flex gap-2.5">
        <button
          type="button"
          onClick={openWhatsapp}
          className="flex-1 h-11 border border-[#E5E5E5] rounded-xl bg-[#F5F5F5] text-ne-blue cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#E5E5E5] transition-colors"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 13.5 }}
        >
          <MessageCircle size={16} />
          <span>Revisar com Vendedor</span>
        </button>
        <button
          type="button"
          onClick={() => router.push(`/pagamento?id=${pedido.id}`)}
          className="flex-1 h-11 border-0 rounded-xl bg-ne-green text-white cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#00941F] transition-colors"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}
        >
          <CreditCard size={16} />
          <span>Prosseguir para Pagamento</span>
        </button>
      </div>

      <Toast />
    </div>
  );
}

export default function PedidoAtualizadoPage() {
  return (
    <Suspense fallback={null}>
      <PedidoAtualizadoContent />
    </Suspense>
  );
}
