"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Package } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { subscribePedidosDoCliente } from "@/lib/pedidos";
import { pedidoTotal, STATUS_META } from "@/lib/pedidoHelpers";
import { brl, useStore } from "@/lib/store";
import type { Pedido, PedidoEstado } from "@/lib/types";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

type TabId = "todos" | "a_pagar" | "pendentes" | "confirmados" | "entregues";

const TAB_STATUS: Record<Exclude<TabId, "todos">, PedidoEstado[]> = {
  a_pagar: ["aguardando_pagamento"],
  pendentes: ["em_negociacao", "aguardando_confirmacao"],
  confirmados: ["pago", "separacao", "enviado"],
  entregues: ["entregue"],
};

const TABS: { id: TabId; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "a_pagar", label: "A Pagar" },
  { id: "pendentes", label: "Pendentes" },
  { id: "confirmados", label: "Confirmados" },
  { id: "entregues", label: "Entregues" },
];

const EMPTY_COPY: Record<TabId, { title: string; sub: string; cta: string }> = {
  todos: { title: "Nenhum pedido ainda", sub: "Seus pedidos aparecerão aqui assim que você comprar.", cta: "Ver produtos" },
  a_pagar: { title: "Nada a pagar", sub: "Você não tem pedidos aguardando pagamento.", cta: "Ver produtos" },
  pendentes: { title: "Nenhum pedido pendente", sub: "Pedidos em negociação ou confirmação aparecem aqui.", cta: "Ver produtos" },
  confirmados: { title: "Nenhum pedido confirmado", sub: "Pedidos pagos ou a caminho aparecem aqui.", cta: "Ver produtos" },
  entregues: { title: "Nenhuma entrega ainda", sub: "Pedidos entregues aparecem aqui.", cta: "Ver produtos" },
};

function ctaFor(estado: PedidoEstado): { label: string; bg: string; fg: string } {
  switch (estado) {
    case "entregue":
      return { label: "Pedir Novamente", bg: "#00B20B", fg: "#FFFFFF" };
    case "aguardando_pagamento":
      return { label: "Pagar", bg: "#0088B7", fg: "#FFFFFF" };
    case "em_negociacao":
      return { label: "Negociar", bg: "#FFB703", fg: "#012418" };
    default:
      return { label: "Rastrear", bg: "#0088B7", fg: "#FFFFFF" };
  }
}

export default function PedidosPage() {
  const router = useRouter();
  const { flash } = useToast();
  const { addItem } = useStore();
  const { user, cliente, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<TabId>("todos");
  const [result, setResult] = useState<{ clienteId: string; pedidos: Pedido[] } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!cliente) return;
    return subscribePedidosDoCliente(cliente.id, (list) => {
      setResult({ clienteId: cliente.id, pedidos: list });
    });
  }, [cliente]);

  const loading = !cliente || result?.clienteId !== cliente.id;
  const pedidos = useMemo(() => (!loading ? result?.pedidos ?? [] : []), [loading, result]);

  const counts = useMemo(() => {
    const c: Record<TabId, number> = { todos: pedidos.length, a_pagar: 0, pendentes: 0, confirmados: 0, entregues: 0 };
    for (const p of pedidos) {
      for (const id of Object.keys(TAB_STATUS) as (keyof typeof TAB_STATUS)[]) {
        if (TAB_STATUS[id].includes(p.estado)) c[id] += 1;
      }
    }
    return c;
  }, [pedidos]);

  const list = useMemo(() => {
    if (tab === "todos") return pedidos;
    return pedidos.filter((p) => TAB_STATUS[tab].includes(p.estado));
  }, [pedidos, tab]);

  const onCta = (pedido: Pedido) => {
    if (pedido.estado === "em_negociacao") {
      router.push(`/pedidos/negociacao?id=${pedido.id}`);
      return;
    }
    if (pedido.estado === "aguardando_pagamento") {
      router.push(`/pagamento?id=${pedido.id}`);
      return;
    }
    if (pedido.estado === "entregue") {
      pedido.itens.forEach((item) => {
        addItem(
          {
            produtoId: item.produtoId,
            variacao: item.variacao,
            title: item.nome,
            specs: item.variacao,
            price: item.preco,
            oldPrice: null,
            shot: item.nome.split(" ")[0],
          },
          item.qtd
        );
      });
      flash("Itens adicionados ao carrinho novamente");
      return;
    }
    router.push(`/pedidos/${pedido.id}`);
  };

  const empty = EMPTY_COPY[tab];

  return (
    <>
      <div className="absolute inset-0 bg-[#F7F8F7] flex flex-col">
        {/* header */}
        <div className="flex-none bg-white border-b border-[#EDEFED]">
          <div className="box-border px-3 pt-[46px] pb-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-none w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center hover:bg-[#F5F5F5] hover:border-ne-green transition-colors"
            >
              <ChevronLeft size={18} color="#012418" strokeWidth={2.4} />
            </button>
            <div className="flex-1 min-w-0" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 24, letterSpacing: "-0.02em", color: "#012418" }}>
              Meus Pedidos
            </div>
            <div className="flex-none text-[12px] font-semibold text-[#999999]">
              {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
            </div>
          </div>

          {/* tab strip */}
          <div className="ne-hs px-3 pb-2.5">
            <div className="flex gap-2 w-max">
              {TABS.map((t) => {
                const active = t.id === tab;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full cursor-pointer transition-colors"
                    style={{
                      background: active ? "#012418" : "#F4F6F4",
                      color: active ? "#FFFFFF" : "#666666",
                      fontFamily: "var(--font-archivo)",
                      fontWeight: 700,
                      fontSize: 12.5,
                    }}
                  >
                    <span>{t.label}</span>
                    <span
                      className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full"
                      style={{
                        background: active ? "rgba(255,255,255,.22)" : "#E1E6E1",
                        color: active ? "#FFFFFF" : "#666666",
                        fontSize: 10.5,
                        fontWeight: 800,
                      }}
                    >
                      {counts[t.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* body */}
        <div className="ne-scroll flex-1 pb-[88px]">
          {loading ? (
            <div className="px-4 pt-4 flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-3 p-3 bg-white rounded-xl shadow-[0_2px_10px_rgba(1,36,24,.06)]">
                  <div className="w-[76px] h-[76px] flex-none rounded-[10px] bg-[#EDEFED]" style={{ animation: "ne-pulse 1.1s ease-in-out infinite" }} />
                  <div className="flex-1 min-w-0 flex flex-col gap-2 py-1">
                    <div className="h-3.5 w-2/3 rounded bg-[#EDEFED]" style={{ animation: "ne-pulse 1.1s ease-in-out infinite" }} />
                    <div className="h-3 w-1/3 rounded bg-[#EDEFED]" style={{ animation: "ne-pulse 1.1s ease-in-out infinite" }} />
                    <div className="h-3 w-1/2 rounded bg-[#EDEFED]" style={{ animation: "ne-pulse 1.1s ease-in-out infinite" }} />
                    <div className="mt-auto h-8 w-full rounded-lg bg-[#EDEFED]" style={{ animation: "ne-pulse 1.1s ease-in-out infinite" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : list.length > 0 ? (
            <div className="px-4 pt-4 flex flex-col gap-3">
              {list.map((p) => {
                const meta = STATUS_META[p.estado];
                const cta = ctaFor(p.estado);
                const total = pedidoTotal(p);
                return (
                  <div key={p.id} className="p-3 bg-white rounded-xl shadow-[0_2px_10px_rgba(1,36,24,.06)]" style={{ animation: "ne-rise .25s ease-out both" }}>
                    <div className="flex gap-3">
                      <div className="w-[76px] h-[76px] flex-none rounded-[10px] overflow-hidden bg-[#F1F3F1]">
                        <ImagePlaceholder label="Nova Era Tintas" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>Nova Era Tintas</div>
                          <span
                            className="flex-none px-2 py-0.5 rounded-full whitespace-nowrap"
                            style={{ background: meta.bg, color: meta.fg, fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 10.5 }}
                          >
                            {meta.label}
                          </span>
                        </div>
                        <div className="mt-1 text-[11.5px] font-medium text-[#999999]">
                          {p.numero} • {new Date(p.criadoEm).toLocaleDateString("pt-BR")}
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15.5, color: "#00B20B" }}>{brl(total)}</div>
                          <div className="text-[11px] font-semibold text-[#999999]">
                            {p.itens.length} {p.itens.length === 1 ? "produto" : "produtos"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => router.push("/pedidos/" + p.id)}
                        className="flex-1 h-9 rounded-lg border border-[#E5E5E5] bg-white cursor-pointer hover:bg-[#F5F5F5] hover:border-ne-green transition-colors"
                        style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12.5, color: "#012418" }}
                      >
                        Detalhes
                      </button>
                      <button
                        type="button"
                        onClick={() => onCta(p)}
                        className="flex-1 h-9 rounded-lg border-0 cursor-pointer active:scale-[.98] transition-transform"
                        style={{ background: cta.bg, color: cta.fg, fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12.5 }}
                      >
                        {cta.label}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-10 pt-16 pb-10 text-center" style={{ animation: "ne-fadein .25s ease-out" }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#F1F3F1] flex items-center justify-center">
                <Package size={24} color="#999999" strokeWidth={1.8} />
              </div>
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15, color: "#012418" }}>{empty.title}</div>
              <div className="mt-1.5 text-[12.5px] font-medium leading-relaxed text-[#999999]">{empty.sub}</div>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-5 px-5 py-2.5 rounded-full bg-ne-green text-white cursor-pointer hover:bg-[#00c40d] transition-colors"
                style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13 }}
              >
                {empty.cta}
              </button>
            </div>
          )}
        </div>
      </div>

      <Toast bottom={100} />
      <TabBar />
    </>
  );
}
