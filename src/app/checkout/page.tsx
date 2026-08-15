"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, MessageCircle } from "lucide-react";
import { brl } from "@/lib/data";
import { useApp, useCartItems } from "@/lib/store";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const FREE_SHIPPING_MIN = 100;
const SHIPPING_FEE = 14.9;
const WHATSAPP_NUMBER = "5535984141300";

const CUSTOMER = {
  nome: "João Silva",
  email: "joao@email.com",
  telefone: "(35) 98414-1300",
  endereco: "Rua das Flores 123 — Itaú de Minas, MG",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { flash, cartTotal } = useApp();
  const items = useCartItems();

  const shipping = cartTotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const total = cartTotal + shipping;

  const whatsappHref = useMemo(() => {
    const lines: string[] = [];
    lines.push("Olá! Gostaria de confirmar meu pedido na Nova Era Tintas:");
    lines.push("");
    items.forEach(({ qty, product }) => {
      lines.push(`• ${qty}x ${product.name} — ${brl(product.price * qty)}`);
    });
    lines.push("");
    lines.push(`Subtotal: ${brl(cartTotal)}`);
    lines.push(`Frete: ${shipping === 0 ? "Grátis" : brl(shipping)}`);
    lines.push(`Total: ${brl(total)}`);
    lines.push("");
    lines.push(`Nome: ${CUSTOMER.nome}`);
    lines.push(`Endereço: ${CUSTOMER.endereco}`);
    const message = lines.join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [items, cartTotal, shipping, total]);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-30 box-border px-3 pt-[46px] pb-2.5 bg-white border-b border-[#EDEFED] flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/carrinho")}
          className="flex-none w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center hover:bg-[#F5F5F5] hover:border-ne-green transition-colors"
        >
          <ChevronLeft size={18} color="#012418" strokeWidth={2.4} />
        </button>
        <div
          className="flex-1 min-w-0 text-center overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: "#000" }}
        >
          Resumo do Pedido
        </div>
        <div className="flex-none w-10" />
      </div>

      <div className="ne-scroll absolute inset-0 bg-[#F7F8F7] pt-[92px] pb-[266px]">
        {/* customer data */}
        <div className="px-4">
          <div className="p-4 bg-white rounded-xl shadow-[0_2px_10px_rgba(1,36,24,.06)]">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <MapPin size={16} color="#00B20B" strokeWidth={2.2} />
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>Seus dados</span>
              </div>
              <button
                type="button"
                onClick={() => flash("Edição de dados em breve")}
                className="text-[12px] font-semibold text-ne-blue cursor-pointer hover:underline"
              >
                Editar Dados
              </button>
            </div>
            <div className="flex flex-col gap-1 text-[13px] font-medium text-[#333] leading-relaxed">
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, color: "#000" }}>{CUSTOMER.nome}</span>
              <span>{CUSTOMER.email}</span>
              <span>{CUSTOMER.telefone}</span>
              <span>{CUSTOMER.endereco}</span>
            </div>
          </div>
        </div>

        {/* items */}
        <div className="px-4 mt-3">
          <div className="text-[11.5px] font-semibold uppercase text-[#999999] mb-2" style={{ letterSpacing: "0.06em" }}>
            Seus itens
          </div>
          <div className="flex flex-col gap-2.5">
            {items.map(({ id, qty, product }) => (
              <div key={id} className="flex gap-3 p-3 bg-white rounded-xl shadow-[0_2px_10px_rgba(1,36,24,.06)]">
                <div className="w-14 h-14 flex-none rounded-[10px] overflow-hidden bg-[#F1F3F1]">
                  <ImagePlaceholder label={product.ph} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <div
                    className="line-clamp-1"
                    style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#000" }}
                  >
                    {product.name}
                  </div>
                  <div className="text-[11px] font-medium text-[#999999]">
                    {qty}x · {product.unit}
                  </div>
                </div>
                <div className="flex-none flex items-center" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 14, color: "#00B20B" }}>
                  {brl(product.price * qty)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* info banner */}
        <div className="px-4 mt-3.5">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#E6F6FA] border border-[#C7E9F1]">
            <MessageCircle size={17} color="#0088B7" strokeWidth={2} className="flex-none mt-0.5" />
            <div className="text-[12px] font-medium leading-snug text-[#046485]">
              Seu pedido será finalizado pelo WhatsApp. Ao confirmar, você enviará os itens e o total diretamente para a nossa loja.
            </div>
          </div>
        </div>
      </div>

      {/* sticky footer */}
      <div className="absolute left-0 right-0 z-31 bottom-0 box-border px-4 pt-3.5 pb-4 bg-white border-t border-[#EDEFED]">
        <div className="flex flex-col gap-1.5 mb-3.5">
          <div className="flex items-center justify-between text-[13px] font-medium text-[#666]">
            <span>Subtotal</span>
            <span>{brl(cartTotal)}</span>
          </div>
          <div className="flex items-center justify-between text-[13px] font-medium text-[#666]">
            <span>Frete</span>
            <span style={{ color: shipping === 0 ? "#00B20B" : "#666", fontWeight: shipping === 0 ? 700 : 500 }}>
              {shipping === 0 ? "Grátis" : brl(shipping)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-[#EDEFED]">
            <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>Total</span>
            <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em", color: "#00B20B" }}>
              {brl(total)}
            </span>
          </div>
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener"
          onClick={() => flash("Abrindo o WhatsApp...")}
          className="w-full h-[52px] rounded-2xl bg-ne-green cursor-pointer flex items-center justify-center gap-2 hover:bg-[#00c40d] active:scale-[.98] transition-transform no-underline"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15, color: "#fff" }}
        >
          <MessageCircle size={18} strokeWidth={2.2} color="#fff" />
          Abrir WhatsApp
        </a>
        <button
          type="button"
          onClick={() => router.push("/carrinho")}
          className="w-full h-[46px] mt-2.5 rounded-2xl bg-white text-[#012418] border border-[#E5E5E5] cursor-pointer hover:bg-[#F5F5F5] transition-colors"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}
        >
          Voltar ao Carrinho
        </button>
      </div>

      <Toast bottom={280} />
      <TabBar />
    </>
  );
}
