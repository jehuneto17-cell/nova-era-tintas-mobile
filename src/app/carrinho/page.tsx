"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Minus, Plus, X, ShoppingBag, Truck } from "lucide-react";
import { brl, useStore } from "@/lib/store";
import { useFrete } from "@/lib/hooks";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export default function CarrinhoPage() {
  const router = useRouter();
  const { items, subtotal, setQty, removeItem, resetCart } = useStore();
  const frete = useFrete();

  const freeShippingMin = frete?.gratis_acima ?? 0;
  const shippingFee = frete?.valor ?? 0;
  const shipping = freeShippingMin > 0 && subtotal >= freeShippingMin ? 0 : shippingFee;
  const total = subtotal + shipping;
  const missing = Math.max(0, freeShippingMin - subtotal);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-30 box-border px-3 pt-[46px] pb-2.5 bg-white border-b border-[#EDEFED] flex items-center gap-2">
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
          Carrinho
        </div>
        <div className="flex-none w-10 flex items-center justify-center">
          {items.length > 0 && (
            <button
              type="button"
              onClick={resetCart}
              className="text-[12px] font-semibold text-[#E63946] cursor-pointer hover:underline"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {items.length > 0 ? (
        <>
          <div className="ne-scroll absolute inset-0 bg-[#F7F8F7] pt-[92px] pb-[248px]">
            <div className="flex flex-col gap-3 px-4">
              {items.map((line) => (
                <div key={`${line.produtoId}::${line.variacao}`} className="relative flex gap-3 p-3 bg-white rounded-xl shadow-[0_2px_10px_rgba(1,36,24,.06)]">
                  <button
                    onClick={() => router.push(`/produto/${line.produtoId}`)}
                    className="w-20 h-20 flex-none rounded-[10px] overflow-hidden bg-[#F1F3F1] text-left"
                  >
                    {line.shotUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={line.shotUrl} alt={line.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlaceholder label={line.shot} />
                    )}
                  </button>
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-start gap-2">
                      <button onClick={() => router.push(`/produto/${line.produtoId}`)} className="flex-1 min-w-0 text-left">
                        <div
                          className="line-clamp-2"
                          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, lineHeight: 1.25, color: "#000" }}
                        >
                          {line.title}
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(line.produtoId, line.variacao)}
                        className="flex-none w-6 h-6 rounded-full bg-[#F4F6F4] cursor-pointer flex items-center justify-center hover:bg-[#FFE5E5] transition-colors"
                      >
                        <X size={13} color="#E63946" strokeWidth={2.4} />
                      </button>
                    </div>
                    <div className="text-[11px] font-medium text-[#999999]">{line.specs}</div>

                    <div className="mt-auto flex items-end justify-between gap-2">
                      <div>
                        <div className="text-[10.5px] font-semibold text-[#999999]">{brl(line.price)} / un.</div>
                        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15.5, letterSpacing: "-0.02em", color: "#00B20B" }}>
                          {brl(line.price * line.qty)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 border border-[#E6E9E6] rounded-lg px-2 py-1.5">
                        <button
                          type="button"
                          onClick={() => (line.qty <= 1 ? removeItem(line.produtoId, line.variacao) : setQty(line.produtoId, line.variacao, line.qty - 1))}
                          className="w-6 h-6 rounded-md bg-[#F4F6F4] cursor-pointer flex items-center justify-center hover:bg-[#E6E9E6] transition-colors"
                        >
                          <Minus size={12} color="#012418" strokeWidth={2.4} />
                        </button>
                        <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 13, minWidth: 14, textAlign: "center" }}>{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(line.produtoId, line.variacao, Math.min(99, line.qty + 1))}
                          className="w-6 h-6 rounded-md bg-[#F4F6F4] cursor-pointer flex items-center justify-center hover:bg-[#E6E9E6] transition-colors"
                        >
                          <Plus size={12} color="#012418" strokeWidth={2.4} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {freeShippingMin > 0 && (
              <div className="px-4 pt-4">
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#EAF8EB] border border-[#CDEFCF]">
                  <Truck size={17} color="#00941F" strokeWidth={2} className="flex-none mt-0.5" />
                  <div className="text-[12px] font-medium leading-snug text-[#00941F]">
                    {missing > 0 ? (
                      <>Faltam <strong>{brl(missing)}</strong> para você ganhar frete grátis!</>
                    ) : (
                      <>Você garantiu frete grátis nesse pedido!</>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* sticky footer */}
          <div className="absolute left-0 right-0 z-31 bottom-[72px] box-border px-4 pt-3.5 pb-4 bg-white border-t border-[#EDEFED]">
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
              onClick={() => router.push("/checkout")}
              className="w-full h-[50px] rounded-2xl bg-ne-green text-white cursor-pointer hover:bg-[#00c40d] active:scale-[.98] transition-transform"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14.5 }}
            >
              Finalizar Compra
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full h-[46px] mt-2.5 rounded-2xl bg-white text-[#012418] border border-[#E5E5E5] cursor-pointer hover:bg-[#F5F5F5] transition-colors"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}
            >
              Continuar Comprando
            </button>
          </div>
        </>
      ) : (
        <div className="ne-scroll absolute inset-0 bg-[#F7F8F7] pt-[92px] pb-[88px]">
          <div className="px-8 pt-[80px] text-center">
            <div className="w-[74px] h-[74px] mx-auto mb-4 rounded-full border-2 border-dashed border-[#CFD4CF] flex items-center justify-center">
              <ShoppingBag size={30} color="#CFD4CF" strokeWidth={1.6} />
            </div>
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#012418" }}>
              Seu carrinho está vazio
            </div>
            <div className="mt-1.5 text-[13px] font-medium leading-relaxed text-[#999999]">
              Adicione produtos para começar sua compra.
            </div>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-6 w-full h-[50px] rounded-2xl bg-ne-green text-white cursor-pointer hover:bg-[#00c40d] active:scale-[.98] transition-transform"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14.5 }}
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      )}

      <Toast bottom={100} />
      <TabBar />
    </>
  );
}
