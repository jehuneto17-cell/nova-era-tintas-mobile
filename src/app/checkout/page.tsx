"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Info } from "lucide-react";
import { brl, useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { useFrete } from "@/lib/hooks";
import { useToast } from "@/lib/toast";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export default function CheckoutPage() {
  const router = useRouter();
  const { flash } = useToast();
  const { items, subtotal } = useStore();
  const { user, cliente, loading: authLoading } = useAuth();
  const frete = useFrete();

  const [enderecoIdOverride, setEnderecoIdOverride] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (items.length === 0) router.push("/carrinho");
  }, [items.length, router]);

  const enderecoPadraoId = cliente && cliente.enderecos.length > 0
    ? (cliente.enderecos.find((e) => e.principal) ?? cliente.enderecos[0]).id
    : null;
  const enderecoId = enderecoIdOverride ?? enderecoPadraoId;
  const setEnderecoId = setEnderecoIdOverride;

  const freeShippingMin = frete?.gratis_acima ?? 0;
  const shippingFee = frete?.valor ?? 0;
  const shipping = freeShippingMin > 0 && subtotal >= freeShippingMin ? 0 : shippingFee;
  const total = subtotal + shipping;

  const enderecoSelecionado = cliente?.enderecos.find((e) => e.id === enderecoId) ?? null;

  const continuar = () => {
    if (!enderecoSelecionado) {
      flash("Selecione um endereço para continuar");
      return;
    }
    try {
      sessionStorage.setItem(
        "net_checkout",
        JSON.stringify({ endereco: enderecoSelecionado.texto, frete: shipping, enderecoMudou: false })
      );
    } catch {
      // sessionStorage indisponível — segue mesmo assim, confirmacao usa fallback
    }
    router.push("/confirmacao");
  };

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
          Finalizar Pedido
        </div>
        <div className="flex-none w-10" />
      </div>

      <div className="ne-scroll absolute inset-0 bg-[#F7F8F7] pt-[92px] pb-[266px]">
        {/* address */}
        <div className="px-4">
          <div className="p-4 bg-white rounded-xl shadow-[0_2px_10px_rgba(1,36,24,.06)]">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <MapPin size={16} color="#00B20B" strokeWidth={2.2} />
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>Endereço de entrega</span>
              </div>
              <button
                type="button"
                onClick={() => router.push("/perfil/editar")}
                className="text-[12px] font-semibold text-ne-blue cursor-pointer hover:underline"
              >
                Gerenciar Endereços
              </button>
            </div>

            {cliente && cliente.enderecos.length > 0 ? (
              <div className="flex flex-col gap-2">
                {cliente.enderecos.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setEnderecoId(e.id)}
                    className="flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer text-left transition-colors"
                    style={{ borderColor: enderecoId === e.id ? "#00B20B" : "#E5E5E5", background: enderecoId === e.id ? "#F0F8F5" : "#FFFFFF" }}
                  >
                    <span
                      className="flex-none w-[18px] h-[18px] mt-0.5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: enderecoId === e.id ? "#00B20B" : "#D8DED9" }}
                    >
                      {enderecoId === e.id && <span className="w-[9px] h-[9px] rounded-full bg-ne-green" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#000" }}>{e.rotulo}</div>
                      <div className="text-[12.5px] text-[#666] mt-0.5">{e.texto}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2.5 py-4 text-center">
                <div className="text-[13px] font-medium text-[#666]">Você ainda não tem um endereço salvo.</div>
                <button
                  type="button"
                  onClick={() => router.push("/perfil/editar")}
                  className="h-10 px-4 rounded-xl bg-ne-green text-white cursor-pointer border-0"
                  style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13 }}
                >
                  Adicionar Endereço
                </button>
              </div>
            )}
          </div>
        </div>

        {/* items */}
        <div className="px-4 mt-3">
          <div className="text-[11.5px] font-semibold uppercase text-[#999999] mb-2" style={{ letterSpacing: "0.06em" }}>
            Seus itens
          </div>
          <div className="flex flex-col gap-2.5">
            {items.map((line) => (
              <div key={`${line.produtoId}::${line.variacao}`} className="flex gap-3 p-3 bg-white rounded-xl shadow-[0_2px_10px_rgba(1,36,24,.06)]">
                <div className="w-14 h-14 flex-none rounded-[10px] overflow-hidden bg-[#F1F3F1]">
                  {line.shotUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={line.shotUrl} alt={line.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlaceholder label={line.shot} />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <div
                    className="line-clamp-1"
                    style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#000" }}
                  >
                    {line.title}
                  </div>
                  <div className="text-[11px] font-medium text-[#999999]">
                    {line.qty}x · {line.specs}
                  </div>
                </div>
                <div className="flex-none flex items-center" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 14, color: "#00B20B" }}>
                  {brl(line.price * line.qty)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* info banner */}
        <div className="px-4 mt-3.5">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#E6F6FA] border border-[#C7E9F1]">
            <Info size={17} color="#0088B7" strokeWidth={2} className="flex-none mt-0.5" />
            <div className="text-[12px] font-medium leading-snug text-[#046485]">
              Ao continuar, seu pedido será registrado e você poderá pagar via PIX na próxima etapa.
            </div>
          </div>
        </div>
      </div>

      {/* sticky footer */}
      <div className="absolute left-0 right-0 z-31 bottom-0 box-border px-4 pt-3.5 pb-4 bg-white border-t border-[#EDEFED]">
        <div className="flex flex-col gap-1.5 mb-3.5">
          <div className="flex items-center justify-between text-[13px] font-medium text-[#666]">
            <span>Subtotal</span>
            <span>{brl(subtotal)}</span>
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

        <button
          type="button"
          onClick={continuar}
          disabled={!enderecoSelecionado}
          className="w-full h-[52px] rounded-2xl bg-ne-green cursor-pointer flex items-center justify-center gap-2 hover:bg-[#00c40d] active:scale-[.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15, color: "#fff", border: "none" }}
        >
          Continuar para Pagamento
        </button>
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
