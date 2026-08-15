"use client";

import { useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Share2, Heart, Star, Minus, Plus } from "lucide-react";
import { PRODUCTS, brl } from "@/lib/data";
import { useApp } from "@/lib/store";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const COLORS = [
  { id: "branco", label: "Branco", hex: "#FFFFFF" },
  { id: "preto", label: "Preto", hex: "#111111" },
  { id: "vermelho", label: "Vermelho", hex: "#D62828" },
  { id: "azul", label: "Azul", hex: "#0088B7" },
  { id: "verde", label: "Verde", hex: "#00B20B" },
];

const SIZES = [
  { id: "1l", label: "1 L", mult: 1 },
  { id: "3.6l", label: "3,6 L", mult: 3.2 },
  { id: "18l", label: "18 L", mult: 14.5 },
];

const SPECS = [
  { k: "Acabamento", v: "Fosco" },
  { k: "Rendimento", v: "8 m²/L" },
  { k: "Tempo de secagem", v: "2–4 horas" },
  { k: "Cobertura", v: "Excelente" },
];

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { toggleFavorite, isFavorite, addToCart, flash } = useApp();

  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === params.id) ?? PRODUCTS[0],
    [params.id]
  );

  const [color, setColor] = useState(COLORS[0].id);
  const [size, setSize] = useState(SIZES[0].id);
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fav = isFavorite(product.id);
  const mult = SIZES.find((s) => s.id === size)?.mult ?? 1;
  const unitPrice = product.price * mult;
  const oldPrice = unitPrice * 1.111;
  const total = unitPrice * qty;

  const onCarouselScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setSlide(idx);
  };

  return (
    <>
      <div className="ne-scroll absolute inset-0 bg-white pb-[152px]">
        {/* header */}
        <div className="sticky top-0 z-30 box-border px-3 pt-[46px] pb-2.5 bg-white/95 backdrop-blur border-b border-[#EDEFED] flex items-center gap-2">
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
            Detalhes do Produto
          </div>
          <button
            type="button"
            onClick={() => flash("Link do produto copiado")}
            className="flex-none w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center hover:bg-[#F5F5F5] hover:border-ne-green transition-colors"
          >
            <Share2 size={17} color="#012418" strokeWidth={2.2} />
          </button>
        </div>

        {/* image carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={onCarouselScroll}
            className="ne-hs flex snap-x snap-mandatory"
            style={{ height: 300 }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-full flex-none snap-center bg-[#F1F3F1]" style={{ height: 300 }}>
                <ImagePlaceholder label={product.ph} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(product.id)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur cursor-pointer flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,.14)] active:scale-90 transition-transform"
          >
            <Heart size={20} color={fav ? "#00B20B" : "#012418"} fill={fav ? "#00B20B" : "none"} strokeWidth={2} />
          </button>

          <div className="absolute left-0 right-0 bottom-3 flex items-center justify-center gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-full transition-all"
                style={{
                  width: slide === i ? 16 : 6,
                  height: 6,
                  background: slide === i ? "#00B20B" : "rgba(1,36,24,.2)",
                }}
              />
            ))}
          </div>
        </div>

        {/* title + rating */}
        <div className="px-5 pt-5">
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 24, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#000" }}>
            {product.name}
          </div>
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <span
              className="px-2.5 py-1 rounded-full bg-[#F1F3F1] text-[#012418] capitalize"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 11.5 }}
            >
              {product.cat}
            </span>
            <span className="flex items-center gap-1 text-[13px] font-semibold text-[#012418]">
              <Star size={14} fill="#FFB703" color="#FFB703" />
              4.8 <span className="text-[#999999] font-medium">(229 avaliações)</span>
            </span>
          </div>

          {/* price row */}
          <div className="mt-4 flex items-end gap-2.5 flex-wrap">
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 26, letterSpacing: "-0.02em", color: "#00B20B" }}>
              {brl(unitPrice)}
            </div>
            <div className="text-[14px] font-semibold text-[#999999] line-through mb-0.5">{brl(oldPrice)}</div>
            <div
              className="px-2 py-0.5 rounded-md bg-[#FFE5E5] text-[#E63946] mb-0.5"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 11.5 }}
            >
              -10%
            </div>
          </div>

          <div className="mt-2 text-[12.5px] font-medium text-[#0088B7]">
            Entrega em 30 min · frete grátis acima de R$ 150
          </div>

          {/* color picker */}
          <div className="mt-6">
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}>Cor</div>
            <div className="mt-2.5 flex items-center gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  title={c.label}
                  className="w-9 h-9 rounded-full flex-none cursor-pointer flex items-center justify-center transition-transform active:scale-90"
                  style={{
                    background: c.hex,
                    border: c.hex === "#FFFFFF" ? "1.5px solid #E5E5E5" : "1.5px solid transparent",
                    boxShadow: color === c.id ? "0 0 0 2.5px #FFFFFF, 0 0 0 4.5px #00B20B" : "0 1px 4px rgba(0,0,0,.14)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* size picker */}
          <div className="mt-5">
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}>Volume</div>
            <div className="mt-2.5 flex items-center gap-2.5">
              {SIZES.map((s) => {
                const active = s.id === size;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSize(s.id)}
                    className="flex-1 py-2.5 rounded-xl cursor-pointer text-center transition-colors"
                    style={{
                      border: `1.5px solid ${active ? "#00B20B" : "#E6E9E6"}`,
                      background: active ? "#00B20B" : "#FFFFFF",
                      color: active ? "#FFFFFF" : "#012418",
                      fontFamily: "var(--font-archivo)",
                      fontWeight: 700,
                      fontSize: 13.5,
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* quantity stepper */}
          <div className="mt-5">
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}>Quantidade</div>
            <div className="mt-2.5 inline-flex items-center gap-4 border border-[#E6E9E6] rounded-xl px-3 py-2">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-[#F4F6F4] cursor-pointer flex items-center justify-center hover:bg-[#E6E9E6] transition-colors disabled:opacity-40"
                disabled={qty <= 1}
              >
                <Minus size={15} color="#012418" strokeWidth={2.4} />
              </button>
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15, minWidth: 20, textAlign: "center" }}>{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="w-8 h-8 rounded-lg bg-[#F4F6F4] cursor-pointer flex items-center justify-center hover:bg-[#E6E9E6] transition-colors disabled:opacity-40"
                disabled={qty >= 99}
              >
                <Plus size={15} color="#012418" strokeWidth={2.4} />
              </button>
            </div>
          </div>

          {/* description */}
          <div className="mt-6">
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15, color: "#012418" }}>Descrição</div>
            <div className="mt-2 text-[13.5px] leading-relaxed font-medium text-[#666]">{product.desc}</div>
          </div>

          {/* specs table */}
          <div className="mt-5 mb-2 rounded-xl border border-[#EDEFED] overflow-hidden">
            {SPECS.map((s, i) => (
              <div
                key={s.k}
                className="flex items-center justify-between px-4 py-3"
                style={{ background: i % 2 === 0 ? "#FAFBFA" : "#FFFFFF", borderTop: i === 0 ? "none" : "1px solid #EDEFED" }}
              >
                <span className="text-[12.5px] font-semibold text-[#999999]">{s.k}</span>
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418" }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* sticky action bar */}
      <div className="absolute left-0 right-0 z-31 bottom-[72px] box-border px-4 py-3 bg-white border-t border-[#EDEFED] flex items-center gap-3">
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          className="flex-none w-[52px] h-[52px] rounded-2xl border cursor-pointer flex items-center justify-center transition-colors active:scale-95"
          style={{ borderColor: fav ? "#00B20B" : "#E5E5E5", background: fav ? "#EAF8EB" : "#FFFFFF" }}
        >
          <Heart size={20} color={fav ? "#00B20B" : "#012418"} fill={fav ? "#00B20B" : "none"} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => addToCart(product.id, qty)}
          className="flex-1 h-[52px] rounded-2xl bg-ne-green text-white cursor-pointer flex items-center justify-center gap-2 hover:bg-[#00c40d] active:scale-[.98] transition-transform"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15 }}
        >
          Adicionar · {brl(total)}
        </button>
      </div>

      <Toast bottom={160} />
      <TabBar />
    </>
  );
}
