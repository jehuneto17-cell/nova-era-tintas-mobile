"use client";

import { useRouter } from "next/navigation";
import { Check, Copy, Truck, MapPin } from "lucide-react";
import { Toast } from "@/components/Toast";
import { useApp } from "@/lib/store";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const ITEMS = [
  { slot: "conf-item-1", ph: "Tinta Acrílica Premium Branco Neve 1L", title: "Tinta Acrílica Premium Branco Neve • Branco + 1L", qty: "Qtd: 2", price: "R$ 91,80" },
  { slot: "conf-item-2", ph: "Pincel Profissional Nylon tamanho P", title: "Pincel Profissional Nylon • Tamanho P", qty: "Qtd: 1", price: "R$ 12,50" },
];

const STEPS = [
  { title: "Pagamento Confirmado", sub: "Aprovado em 05/08/2026 às 14:30", done: true },
  { title: "Preparando Pedido", sub: "Seu pedido está sendo preparado", done: false },
  { title: "Pronto para Entrega", sub: "Será entregue ou retirado em breve", done: false },
  { title: "Entregue", sub: "Rastreie seu pedido", done: false },
];

export default function ConfirmacaoPage() {
  const router = useRouter();
  const { flash } = useApp();

  const orderId = "#1257";
  const orderDate = "03/08/2026 às 14:30";

  return (
    <div className="absolute inset-0 bg-white">
      <div className="absolute top-0 left-0 right-0 z-30 box-border px-4 pt-[46px] pb-2.5 bg-white border-b border-[#EDEFED] flex items-center gap-2">
        <div className="flex-none w-7" />
        <div className="flex-1 text-center whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: "#000" }}>
          Pedido Confirmado
        </div>
        <Check size={28} color="#00B20B" strokeWidth={2.6} className="flex-none" />
      </div>

      <div className="ne-scroll absolute inset-x-0 top-[96px] bottom-[72px]">
        <div className="px-4 pt-5 flex flex-col">
          <div className="flex items-center gap-3.5 p-4 rounded-lg border-l-4 border-ne-green bg-[#E8F5E9] mb-6">
            <div style={{ animation: "ne-pop .28s ease-in both" }}>
              <Check size={48} color="#00B20B" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em", color: "#00B20B" }}>Pagamento Aprovado!</div>
              <div className="text-sm text-[#999999]">Seu pedido foi confirmado com sucesso</div>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-1">
            <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#999999" }}>Número do Pedido</span>
            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) navigator.clipboard.writeText(orderId).catch(() => {});
                flash("Número copiado!");
              }}
              className="self-start flex items-center gap-2 border-0 bg-transparent p-0 cursor-pointer hover:text-ne-blue transition-colors"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, color: "#000" }}
            >
              <span>{orderId}</span>
              <Copy size={15} color="#999999" />
            </button>
          </div>

          <div className="mb-5 flex flex-col gap-1">
            <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#999999" }}>Data do Pedido</span>
            <span className="text-sm text-[#000]">{orderDate}</span>
          </div>

          <div className="mb-5">
            <div className="mb-3" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: "#000" }}>Itens do Pedido</div>
            {ITEMS.map((it) => (
              <div key={it.slot} className="flex gap-3 py-3 border-b border-[#EDEFED]">
                <div className="w-20 h-20 flex-none rounded-lg overflow-hidden bg-[#F1F3F1]">
                  <ImagePlaceholder label={it.ph} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1 justify-center">
                  <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#0088B7" }}>{it.title}</div>
                  <div className="text-xs text-[#999999]">{it.qty}</div>
                  <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#00B20B" }}>{it.price}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <div className="mb-3" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: "#000" }}>Resumo</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5C6A62]">Subtotal</span>
                <span className="text-sm text-[#000]">R$ 104,30</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5C6A62]">Frete</span>
                <span className="text-sm font-semibold text-ne-green">Grátis</span>
              </div>
              <div className="h-px bg-[#E5E5E5] my-1" />
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, color: "#000" }}>Total Pago</span>
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: "#00B20B" }}>R$ 104,30</span>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-3" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: "#000" }}>Entregar em</div>
            <div className="flex gap-2.5 p-3 rounded-lg bg-[#F5F5F5]">
              <MapPin size={20} color="#00B20B" strokeWidth={2} className="flex-none mt-px" />
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="text-sm text-[#000]">Rua das Flores, 123</span>
                <span className="text-sm text-[#000]">Itaú de Minas, MG - 39260-000</span>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: "#000" }}>Próximas Etapas</div>
            <div className="flex flex-col">
              {STEPS.map((s, i) => (
                <div key={s.title} className="flex gap-3">
                  <div className="flex-none w-6 flex flex-col items-center">
                    <div
                      className="w-6 h-6 rounded-full box-border flex items-center justify-center"
                      style={{ border: `2px solid ${s.done ? "#00B20B" : "#E5E5E5"}`, background: s.done ? "#00B20B" : "#FFFFFF" }}
                    >
                      {s.done && <Check size={12} color="#FFFFFF" strokeWidth={3.6} />}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-0.5 flex-1 my-0.5" style={{ background: i === 0 ? "#00B20B" : "#E5E5E5", minHeight: 18 }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pb-3 pt-[5px]">
                    <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 14, color: s.done ? "#00B20B" : "#000" }}>{s.title}</div>
                    <div className="text-xs text-[#999999]">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 pb-6">
            <button
              type="button"
              onClick={() => flash("Rastreamento em breve")}
              className="w-full h-14 border-0 rounded-[24px] bg-ne-green text-white cursor-pointer flex items-center justify-center gap-2.5 hover:bg-[#009209] hover:scale-[1.015] transition-all"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16 }}
            >
              <Truck size={19} />
              <span>Rastrear Pedido</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full h-14 border-2 border-[#E5E5E5] rounded-[24px] bg-white text-black cursor-pointer hover:border-ne-green hover:scale-[1.015] transition-all"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16 }}
            >
              Voltar à Home
            </button>
          </div>
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 z-29 h-[72px] bg-white border-t border-[#E5E5E5] flex items-stretch">
        <TabItem label="Home" active onClick={() => router.push("/")} />
        <TabItem label="Categorias" onClick={() => router.push("/categorias")} />
        <TabItem label="Carrinho" onClick={() => router.push("/carrinho")} />
        <TabItem label="Favoritos" onClick={() => router.push("/favoritos")} />
        <TabItem label="Perfil" onClick={() => router.push("/perfil")} />
      </div>

      <Toast />
    </div>
  );
}

function TabItem({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 border-0 bg-transparent cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-colors"
      style={{ color: active ? "#00B20B" : "#999999", fontFamily: "var(--font-manrope)", fontSize: 11, fontWeight: active ? 700 : 500 }}
    >
      {label}
    </button>
  );
}
