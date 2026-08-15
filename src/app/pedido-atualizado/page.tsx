"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, MessageCircle, CreditCard, Sparkles, MapPin } from "lucide-react";
import { Toast } from "@/components/Toast";
import { useApp } from "@/lib/store";

const ITENS = [
  { nome: "Tinta Acrílica", variacao: "Branco + 1L", qtdPreco: "2 × R$ 45,90", subtotal: "R$ 91,80", mudou: false },
  { nome: 'Pincel 2"', variacao: "Sintético", qtdPreco: "1 × R$ 55,00", subtotal: "R$ 55,00", subtotalAnterior: "R$ 58,00", mudou: true },
];

const END = {
  nome: "João Silva",
  rua: "Rua das Flores, 123",
  complemento: "Apto 456",
  cidadeEstado: "Itaú de Minas, MG 35682-000",
  telefone: "(35) 98414-1300",
};

export default function PedidoAtualizadoPage() {
  const router = useRouter();
  const { flash } = useApp();

  const subtotalAnterior = "R$ 160,00";
  const subtotalAtual = "R$ 150,00";
  const totalAnterior = "R$ 160,00";
  const totalAtual = "R$ 150,00";
  const diff = -10;

  return (
    <div className="absolute inset-0 bg-[#F8F8F8]">
      <div className="absolute top-0 left-0 right-0 z-30 box-border px-3 pt-[46px] pb-2.5 bg-white border-b border-[#EDEFED] flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
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
            {ITENS.map((it) => (
              <div key={it.nome} className="bg-white border border-[#E5E5E5] rounded-xl p-3 flex gap-3">
                <div className="w-[60px] h-[60px] flex-none rounded-lg bg-[#F1F3F1] flex items-center justify-center">
                  <div className="w-6 h-6 rounded bg-[#C4CCC7]" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418" }}>{it.nome}</span>
                  <span className="text-[11px] text-[#999999]">{it.variacao}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-[#012418]">{it.qtdPreco}</span>
                    {it.mudou && (
                      <span className="px-1.5 py-px rounded bg-[#FFB703] text-white text-[10px] font-bold">MUDOU</span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between mt-0.5">
                    {it.mudou && it.subtotalAnterior && <span className="text-[11px] text-[#999999] line-through">era {it.subtotalAnterior}</span>}
                    <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418", marginLeft: "auto" }}>{it.subtotal}</span>
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
                <span className="text-[11px] text-[#999999] line-through">{subtotalAnterior}</span>
                <span className="whitespace-nowrap text-[13px] text-[#012418]">{subtotalAtual}</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-[#F5F5F5]">
              <span className="text-[13px] text-[#012418]">Frete</span>
              <span className="text-[13px] font-bold text-ne-green">Grátis!</span>
            </div>
            <div className="flex items-start justify-between pt-3">
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>Total</span>
              <div className="flex flex-col items-end gap-0.5">
                <span className="whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, color: diff < 0 ? "#00B20B" : diff > 0 ? "#E63946" : "#012418" }}>
                  {totalAtual}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#999999] line-through">era {totalAnterior}</span>
                  <span className="text-xs font-bold" style={{ color: diff < 0 ? "#00D97E" : "#E63946" }}>
                    {diff < 0 ? "-" : "+"}
                    {"R$ " + Math.abs(diff).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-[0_1px_8px_rgba(0,0,0,.05)] flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} color="#00B20B" strokeWidth={2.2} />
              <span className="uppercase" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, color: "#012418" }}>Endereço de Entrega</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418" }}>{END.nome}</span>
              <span className="text-xs text-[#012418]">{END.rua}</span>
              <span className="text-[11px] text-[#999999]">{END.complemento}</span>
              <span className="text-[11px] text-[#999999]">{END.cidadeEstado}</span>
              <span className="text-[11px] text-[#999999]">{END.telefone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 z-28 box-border px-4 pt-3 pb-4 bg-white border-t border-[#EDEFED] flex gap-2.5">
        <button
          type="button"
          onClick={() => flash("Abrindo WhatsApp sobre as mudanças")}
          className="flex-1 h-11 border border-[#E5E5E5] rounded-xl bg-[#F5F5F5] text-ne-blue cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#E5E5E5] transition-colors"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 13.5 }}
        >
          <MessageCircle size={16} />
          <span>Revisar com Vendedor</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/pagamento")}
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
