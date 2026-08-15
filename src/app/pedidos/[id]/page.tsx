"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MoreVertical, Check, MessageCircle, Package, Star } from "lucide-react";
import { ORDERS, STATUS_META, PRODUCTS, brl, type OrderStatus } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const FLOW = ["em_negociacao", "aguardando_pagamento", "pago", "separacao", "enviado", "entregue"] as const satisfies readonly OrderStatus[];

const STEP_LABEL: Record<(typeof FLOW)[number], string> = {
  em_negociacao: "Em Negociação",
  aguardando_pagamento: "Pagamento Confirmado",
  pago: "Pedido Pago",
  separacao: "Em Separação",
  enviado: "Pedido Enviado",
  entregue: "Pedido Entregue",
};

const STEP_TIMES: Record<(typeof FLOW)[number], string> = {
  em_negociacao: "05 ago, 09:10",
  aguardando_pagamento: "05 ago, 10:00",
  pago: "05 ago, 10:35",
  separacao: "06 ago, 08:20",
  enviado: "06 ago, 14:45",
  entregue: "07 ago, 11:15",
};

// how many flow steps are considered "reached" for each demo status
const REACHED_INDEX: Record<OrderStatus, number> = {
  em_negociacao: 0,
  aguardando_pagamento: 1,
  aguardando_confirmacao: 1,
  pago: 2,
  separacao: 3,
  enviado: 4,
  entregue: 5,
  cancelado: 0,
};

const DEMO_ADDRESS = {
  nome: "Rua das Flores, 123",
  compl: "Apto 456",
  cidade: "Itaú de Minas - MG",
  cep: "35682-000",
  fone: "(35) 98414-1300",
};

export default function PedidoDetalhePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { flash } = useApp();

  const order = useMemo(() => ORDERS.find((o) => o.id === params.id) ?? ORDERS[0], [params.id]);

  const [statusOverride, setStatusOverride] = useState<OrderStatus | null>(null);
  const [marking, setMarking] = useState(false);

  const status = statusOverride ?? order.status;
  const meta = STATUS_META[status];
  const reached = REACHED_INDEX[status] ?? 0;

  const items = [
    { product: PRODUCTS[0], qty: 2, variant: "Branco Neve · 18 L" },
    { product: PRODUCTS[3], qty: 1, variant: 'Cerda Natural · 2"' },
  ];
  const subtotal = items.reduce((s, it) => s + it.product.price * it.qty, 0);

  const markDelivered = () => {
    setMarking(true);
    setTimeout(() => {
      setMarking(false);
      setStatusOverride("entregue");
      flash("Pedido marcado como entregue");
    }, 500);
  };

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
                <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 18, color: "#012418" }}>#{order.numero}</div>
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
                <div className="mt-0.5" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418" }}>{order.data}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold text-[#999999]">Total</div>
                <div className="mt-0.5" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, color: "#00B20B" }}>{brl(order.total)}</div>
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
              {FLOW.map((step, i) => {
                const done = i < reached;
                const active = i === reached;
                const future = i > reached;
                const isLast = i === FLOW.length - 1;
                return (
                  <div key={step} className="flex gap-3">
                    <div className="flex-none flex flex-col items-center">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-none"
                        style={{
                          background: done ? "#00B20B" : active ? "#012418" : "#FFFFFF",
                          border: future ? "2px solid #E5E5E5" : "2px solid transparent",
                          animation: active ? "ne-dotpulse 1.4s ease-in-out infinite" : undefined,
                        }}
                      >
                        {done ? (
                          <Check size={14} color="#FFFFFF" strokeWidth={3} />
                        ) : active ? (
                          <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 11, color: "#FFFFFF" }}>{i + 1}</span>
                        ) : (
                          <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 11, color: "#C4CCC7" }}>{i + 1}</span>
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className="w-[2px] flex-1"
                          style={{
                            minHeight: 34,
                            background: done ? "#00B20B" : "#E5E5E5",
                            animation: active ? "ne-linepulse 1.4s ease-in-out infinite" : undefined,
                          }}
                        />
                      )}
                    </div>
                    <div className={isLast ? "pb-0.5" : "pb-5"}>
                      <div
                        style={{
                          fontFamily: "var(--font-archivo)",
                          fontWeight: 700,
                          fontSize: 13.5,
                          color: future ? "#999999" : "#012418",
                        }}
                      >
                        {STEP_LABEL[step]}
                      </div>
                      <div className="mt-0.5 text-[11.5px] font-medium text-[#999999]">
                        {future ? "pendente" : STEP_TIMES[step]}
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
              {items.map((it, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-16 h-16 flex-none rounded-[10px] overflow-hidden bg-[#F1F3F1]">
                    <ImagePlaceholder label={it.product.ph} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, lineHeight: 1.25, color: "#000" }}>{it.product.name}</div>
                    <div className="mt-1 text-[11.5px] font-medium text-[#999999]">{it.variant}</div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11.5px] font-semibold text-[#999999]">
                        {it.qty}× {brl(it.product.price)}
                      </span>
                      <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13.5, color: "#012418" }}>
                        {brl(it.product.price * it.qty)}
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
              <div className="flex items-center justify-between text-[13px] font-medium text-[#00B20B]">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>Total</span>
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 17, color: "#00B20B" }}>{brl(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* address */}
        <div className="px-4 pt-4">
          <div className="p-4 rounded-2xl bg-white shadow-[0_2px_10px_rgba(1,36,24,.06)]">
            <div className="mb-2" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14.5, color: "#012418" }}>
              Endereço de Entrega
            </div>
            <div className="text-[13px] font-medium leading-relaxed text-[#666]">
              {DEMO_ADDRESS.nome}, {DEMO_ADDRESS.compl}
              <br />
              {DEMO_ADDRESS.cidade}, {DEMO_ADDRESS.cep}
              <br />
              {DEMO_ADDRESS.fone}
            </div>
          </div>
        </div>
      </div>

      {/* sticky footer */}
      <div className="absolute left-0 right-0 bottom-0 z-31 box-border px-4 py-3 bg-white border-t border-[#EDEFED] flex items-center gap-3">
        <button
          type="button"
          onClick={() => flash("Abrindo conversa com o vendedor")}
          className="flex-1 h-[50px] rounded-2xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center gap-2 hover:bg-[#F5F5F5] transition-colors"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}
        >
          <MessageCircle size={17} strokeWidth={2} />
          Falar com Vendedor
        </button>

        {status === "enviado" ? (
          <button
            type="button"
            onClick={markDelivered}
            disabled={marking}
            className="flex-1 h-[50px] rounded-2xl border-0 bg-ne-green text-white cursor-pointer flex items-center justify-center gap-2 hover:bg-[#00c40d] active:scale-[.98] transition-transform disabled:opacity-70"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}
          >
            {marking ? (
              <span className="w-4 h-4 rounded-full border-[2.5px] border-white/35 border-t-white" style={{ animation: "ne-spin .7s linear infinite" }} />
            ) : (
              <Check size={17} strokeWidth={2.4} />
            )}
            {marking ? "Confirmando..." : "Pedido Entregue"}
          </button>
        ) : status === "entregue" ? (
          <button
            type="button"
            onClick={() => router.push("/avaliar")}
            className="flex-1 h-[50px] rounded-2xl border-0 bg-ne-green text-white cursor-pointer flex items-center justify-center gap-2 hover:bg-[#00c40d] active:scale-[.98] transition-transform"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}
          >
            <Star size={16} strokeWidth={2} />
            Avaliar Compra
          </button>
        ) : (
          <button
            type="button"
            onClick={() => flash("Rastreamento do pedido " + order.numero)}
            className="flex-1 h-[50px] rounded-2xl border-0 bg-ne-blue text-white cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 active:scale-[.98] transition-transform"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}
          >
            <Package size={16} strokeWidth={2} />
            Rastrear Pedido
          </button>
        )}
      </div>

      <Toast bottom={120} />
    </>
  );
}
