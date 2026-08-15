"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Star } from "lucide-react";
import { PRODUCTS, CATEGORIES, brl } from "@/lib/data";
import { useApp } from "@/lib/store";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const RECENTS_SEED = ["Tinta vermelha", "Pincel 2 polegadas", "Rolo de lã", "Primer branco"];
const POPULARES = ["Tintas Premium", "Rolos profissionais", "Pincéis sintéticos"];

export default function HomePage() {
  const router = useRouter();
  const { cart, cartCount, cartTotal, addToCart, toggleFavorite, isFavorite, flash } = useApp();

  const [cat, setCat] = useState("todos");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);
  const [recents, setRecents] = useState(RECENTS_SEED);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLogoLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = el.scrollTop;
      setExpanded((prev) => {
        if (!prev && y > 150) return true;
        if (prev && y < 50) return false;
        return prev;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const q = query.trim().toLowerCase();
  const list = PRODUCTS.filter(
    (p) => (cat === "todos" || p.cat === cat) && (!q || (p.name + " " + p.desc).toLowerCase().includes(q))
  );

  const cartById = Object.fromEntries(cart.map((i) => [i.id, i.qty]));

  const focusSearch = () => {
    setExpanded(true);
    setSearchOpen(true);
    const el = scrollRef.current;
    if (el && el.scrollTop < 160) el.scrollTo({ top: 200, behavior: "smooth" });
    setTimeout(() => inputRef.current?.focus(), 320);
  };

  return (
    <>
      {/* sticky search + cart */}
      <div
        className="absolute top-0 left-0 right-0 z-28 flex items-center justify-end gap-2.5 px-4 pb-2.5 pt-[50px] transition-all duration-300"
        style={{
          background: expanded ? "rgba(255,255,255,.62)" : "transparent",
          backdropFilter: expanded ? "blur(14px) saturate(1.3)" : "none",
          WebkitBackdropFilter: expanded ? "blur(14px) saturate(1.3)" : "none",
          boxShadow: expanded ? "0 4px 18px rgba(1,36,24,.08)" : "none",
        }}
      >
        <div
          className="relative flex-none h-12 box-border overflow-hidden transition-all duration-300"
          style={{
            width: expanded ? 300 : 48,
            borderRadius: expanded ? 14 : 24,
            background: "rgba(255,255,255,.18)",
            backdropFilter: expanded ? "blur(12px) saturate(1.4)" : "blur(6px) saturate(1.3)",
            WebkitBackdropFilter: expanded ? "blur(12px) saturate(1.4)" : "blur(6px) saturate(1.3)",
            border: `1.5px solid ${expanded ? "rgba(0,178,11,.65)" : "rgba(255,255,255,.45)"}`,
            boxShadow: "0 4px 14px rgba(0,0,0,.10)",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Buscar produto..."
            className="absolute left-11 right-3 top-0 h-full border-0 outline-none bg-transparent"
            style={{
              fontFamily: "var(--font-manrope)",
              fontSize: 14.5,
              fontWeight: 500,
              color: "#000",
              opacity: expanded ? 1 : 0,
              pointerEvents: expanded ? "auto" : "none",
              transition: "opacity .3s ease-out",
            }}
          />
          <button
            type="button"
            onClick={focusSearch}
            className="absolute top-[11px] w-6 h-6 border-0 bg-transparent cursor-pointer p-0 flex items-center justify-center transition-all duration-300"
            style={{ left: expanded ? 13 : 11, transform: `rotate(${expanded ? 45 : 0}deg)` }}
          >
            <Search size={18} color="#00B20B" strokeWidth={2.2} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => router.push("/carrinho")}
          className="relative flex-none w-12 h-12 rounded-[14px] bg-white cursor-pointer flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,.14)] hover:bg-[#F4F6F4] transition-colors"
        >
          <ShoppingBag size={20} color="#000" strokeWidth={2} />
          {cartCount > 0 && (
            <div
              className="absolute -top-[5px] -right-[5px] min-w-[19px] h-[19px] px-1.5 box-border rounded-full bg-ne-green border-2 border-white text-white flex items-center justify-center"
              style={{ fontFamily: "var(--font-archivo)", fontSize: 10.5, fontWeight: 700 }}
            >
              {cartCount}
            </div>
          )}
        </button>
      </div>

      {/* fake status bar (over hero) */}
      <div
        className="absolute top-0 left-4 z-30 h-[72px] pointer-events-none flex items-end justify-between pb-1.5"
        style={{
          fontFamily: "var(--font-archivo)",
          fontWeight: 600,
          fontSize: 13,
          color: expanded ? "#012418" : "#FFFFFF",
          textShadow: expanded ? "none" : "0 1px 3px rgba(0,0,0,.4)",
          transition: "color .3s ease-out",
          width: 318,
        }}
      >
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="flex items-end gap-0.5">
            <div className="w-[3px] h-[5px] rounded-[1px]" style={{ background: "currentColor" }} />
            <div className="w-[3px] h-[7px] rounded-[1px]" style={{ background: "currentColor" }} />
            <div className="w-[3px] h-[9px] rounded-[1px]" style={{ background: "currentColor" }} />
            <div className="w-[3px] h-[11px] rounded-[1px] opacity-40" style={{ background: "currentColor" }} />
          </div>
          <div className="w-[22px] h-[11px] rounded-[3px] box-border p-[1.5px]" style={{ border: "1.5px solid currentColor", opacity: 0.7 }}>
            <div className="w-[72%] h-full rounded-[1.5px]" style={{ background: "currentColor" }} />
          </div>
        </div>
      </div>

      {/* search history overlay */}
      {searchOpen && (
        <>
          <div
            onClick={() => setSearchOpen(false)}
            className="absolute inset-0 z-27 bg-black/10"
            style={{ animation: "ne-veil .2s ease-out" }}
          />
          <div
            className="absolute left-4 right-4 z-29 rounded-xl bg-white/95 backdrop-blur-2xl pt-3.5 px-1.5 pb-2 shadow-[0_12px_34px_rgba(1,36,24,.14)]"
            style={{ top: 106, animation: "ne-fade .2s ease-out" }}
          >
            <div className="px-2.5 pb-2 uppercase text-[#999999]" style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 11.5, letterSpacing: "0.08em" }}>
              Recentes
            </div>
            <div className="flex flex-col">
              {recents.map((r) => (
                <div key={r} className="flex items-center gap-3 py-3 px-4 rounded-[10px] cursor-pointer hover:bg-[#F5F5F5] transition-colors">
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(r);
                      setSearchOpen(false);
                      setCat("todos");
                    }}
                    className="flex-1 min-w-0 flex items-center gap-3 text-left"
                  >
                    <Search size={17} color="#999999" strokeWidth={1.8} />
                    <span className="text-[14.5px] font-medium text-black truncate">{r}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecents((prev) => prev.filter((x) => x !== r));
                    }}
                    className="flex-none w-[22px] h-[22px] rounded-full bg-[#F1F3F1] text-[#999999] text-[13px] leading-none cursor-pointer hover:bg-[#E4E7E4] hover:text-black flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="h-px my-2 mx-2.5 bg-[#EDEFED]" />
            <div className="px-2.5 pb-2.5 uppercase text-[#999999]" style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 11.5, letterSpacing: "0.08em" }}>
              Populares
            </div>
            <div className="flex flex-wrap gap-2 px-2.5 pb-2.5">
              {POPULARES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setQuery(t.split(" ")[0].replace(/s$/, ""));
                    setSearchOpen(false);
                    setCat("todos");
                  }}
                  className="border border-[#E6E9E6] bg-white text-black px-[13px] py-2 rounded-full cursor-pointer hover:bg-[#F5F5F5] hover:border-ne-green transition-colors"
                  style={{ fontFamily: "var(--font-manrope)", fontSize: 13, fontWeight: 600 }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* scroll body */}
      <div ref={scrollRef} className="ne-scroll absolute inset-0 bg-[#F7F8F7]">
        {/* hero */}
        <div className="relative h-[290px] bg-[#012418]">
          <div className="absolute inset-0">
            <ImagePlaceholder label="foto de banner — tintas, rolos e pincéis" />
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(180deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,.28) 30%,rgba(0,0,0,.3) 70%,rgba(0,0,0,.5) 100%)" }}
          />
          {logoLoading ? (
            <div
              className="absolute left-5 top-[215px] w-[94px] h-[94px] rounded-xl bg-[#E8E8E8] border-[3px] border-white shadow-[0_6px_18px_rgba(0,0,0,.3)] box-content"
              style={{ animation: "ne-pulse 1.1s ease-in-out infinite" }}
            />
          ) : (
            <div
              className="absolute left-5 top-[215px] w-[94px] h-[94px] rounded-xl overflow-hidden bg-[#F8F8F8] border-[3px] border-white shadow-[0_6px_18px_rgba(0,0,0,.3)] box-content"
              style={{ animation: "ne-rise .3s ease-out both" }}
            >
              <ImagePlaceholder label="Logo da Loja" />
            </div>
          )}
        </div>

        {/* store info */}
        <div className="bg-white px-5 pt-[34px] pb-2.5">
          <div className="flex items-start gap-3.5">
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 24, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#000" }}>
                Nova Era Tintas
              </div>
              <div className="flex items-center gap-2 mt-2.5">
                <div className="w-[22px] h-[22px] rounded-[7px] bg-ne-green flex items-center justify-center flex-none">
                  <div className="w-[9px] h-[9px] bg-white" style={{ borderRadius: "50% 50% 50% 2px", transform: "rotate(-45deg)" }} />
                </div>
                <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 13, lineHeight: 1.3, color: "#000" }}>
                  Tintas, Pincéis, Rolos e Acabamentos
                </div>
              </div>
              <div className="mt-2 text-[13px] font-medium text-[#999999]">Itaú de Minas, MG</div>
            </div>
            <div className="flex-none w-[91px] px-1.5 pt-2.5 pb-2.5 rounded-xl bg-[#F4F6F4] text-center h-[67px]">
              <div className="flex items-center justify-center gap-1.5" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, color: "#012418" }}>
                <Star size={14} fill="#00B20B" color="#00B20B" />
                4.8
              </div>
              <div className="mt-1" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>229</div>
              <div className="text-[11px] font-medium text-[#999999] leading-tight">avaliações</div>
            </div>
          </div>

          <div className="mt-4 flex items-stretch bg-white border border-[#E6E9E6] rounded-2xl overflow-hidden">
            <div className="flex-1 py-2.5 px-2 text-center">
              <div className="text-[11px] font-medium text-[#999999]">Retirada</div>
              <div className="mt-1" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#00B20B" }}>Retire hoje</div>
            </div>
            <div className="w-px bg-[#EDEFED]" />
            <div className="flex-1 py-2.5 px-2 text-center">
              <div className="text-[11px] font-medium text-[#999999]">WhatsApp</div>
              <div className="mt-1 whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, letterSpacing: "-0.02em", color: "#000" }}>
                98414-1300
              </div>
            </div>
            <div className="w-px bg-[#EDEFED]" />
            <div className="flex-1 py-2.5 px-2 text-center">
              <div className="text-[11px] font-medium text-[#999999]">Entrega</div>
              <div className="mt-1" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#000" }}>30 min</div>
            </div>
          </div>
        </div>

        <div className="h-1.5 bg-[#EDEFED]" />

        {/* categories */}
        <div className="ne-hs mt-3 px-5 pt-0.5 pb-1">
          <div className="flex gap-2.5 w-max">
            {CATEGORIES.map((c) => {
              const active = c.id === cat;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  className="min-w-[78px] px-3 pt-[11px] pb-2.5 rounded-2xl cursor-pointer flex flex-col items-center gap-2 transition-colors"
                  style={{
                    border: `1px solid ${active ? "#00B20B" : "#E6E9E6"}`,
                    background: active ? "#00B20B" : "#FFFFFF",
                    color: active ? "#FFFFFF" : "#999999",
                    fontFamily: "var(--font-archivo)",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  <div className="h-[22px] flex items-center justify-center">
                    <CategoryGlyph id={c.id} />
                  </div>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* section head */}
        <div className="flex items-baseline justify-between px-5 pt-5 pb-3">
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em", color: "#012418" }}>
            {q ? "Resultados" : cat === "todos" ? "Todos os produtos" : CATEGORIES.find((c) => c.id === cat)?.label}
          </div>
          <div className="text-xs font-semibold text-[#999999]">
            {list.length} {list.length === 1 ? "item" : "itens"}
          </div>
        </div>

        {/* list layout */}
        {list.length > 0 ? (
          <div className="flex flex-col gap-3 px-5 pb-6">
            {list.map((p) => {
              const inCart = !!cartById[p.id];
              const fav = isFavorite(p.id);
              return (
                <div key={p.id} className="relative flex gap-3.5 p-3 bg-white rounded-xl shadow-[0_2px_10px_rgba(1,36,24,.06)]">
                  <button
                    onClick={() => router.push(`/produto/${p.id}`)}
                    className="w-24 h-24 flex-none rounded-[10px] overflow-hidden bg-[#F1F3F1] text-left"
                  >
                    <ImagePlaceholder label={p.ph} />
                  </button>
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-start gap-2">
                      <button onClick={() => router.push(`/produto/${p.id}`)} className="flex-1 min-w-0 text-left">
                        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14.5, lineHeight: 1.25, color: "#000" }}>{p.name}</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(p.id)}
                        className="flex-none text-[15px] leading-none cursor-pointer"
                        style={{ color: fav ? "#00B20B" : "#D7DBD7" }}
                      >
                        ♥
                      </button>
                    </div>
                    <div className="text-[11.5px] font-medium leading-snug text-[#999999]">{p.desc}</div>
                    <div className="mt-auto flex items-end justify-between gap-2">
                      <div>
                        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em", color: "#00B20B" }}>{brl(p.price)}</div>
                        <div className="text-[10.5px] font-semibold text-[#999999] mt-0.5">{p.unit}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(p.id)}
                        className="relative w-[38px] h-[38px] rounded-[11px] bg-ne-green text-white cursor-pointer text-xl font-medium flex items-center justify-center shadow-[0_4px_12px_rgba(0,178,11,.3)] hover:bg-[#00c40d] active:scale-95 transition-transform"
                      >
                        +
                        {inCart && (
                          <span
                            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 box-border rounded-full bg-[#012418] border-2 border-white flex items-center justify-center"
                            style={{ fontFamily: "var(--font-archivo)", fontSize: 10, fontWeight: 700 }}
                          >
                            {cartById[p.id]}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-10 pt-[34px] pb-10 text-center">
            <div className="w-[54px] h-[54px] mx-auto mb-3.5 rounded-full border-2 border-dashed border-[#CFD4CF]" />
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15, color: "#012418" }}>Nada encontrado</div>
            <div className="mt-1.5 text-[12.5px] font-medium leading-relaxed text-[#999999]">
              Tente outro termo ou fale com a loja no WhatsApp (35) 98414-1300.
            </div>
          </div>
        )}

        <div className="px-5 pb-[118px]">
          <div className="p-4 px-[18px] rounded-2xl bg-[#012418]">
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#FFFFFF" }}>Retire na loja ou receba em casa</div>
            <div className="mt-1.5 text-xs font-medium leading-relaxed text-white/55">
              Av. Principal, Itaú de Minas — MG · Seg a Sáb, 8h às 18h
            </div>
          </div>
        </div>
      </div>

      {/* cart bar */}
      {cartCount > 0 && (
        <div className="absolute left-3.5 right-3.5 bottom-[88px] z-24 flex items-center gap-3 py-2.5 pl-4 pr-3 rounded-[18px] bg-[#012418] shadow-[0_14px_34px_rgba(1,36,24,.4)]">
          <div className="flex-1 min-w-0">
            <div className="uppercase text-[10.5px] font-semibold text-white/50" style={{ letterSpacing: "0.08em" }}>
              {cartCount} {cartCount === 1 ? "item no carrinho" : "itens no carrinho"}
            </div>
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 17, color: "#FFFFFF", letterSpacing: "-0.02em" }}>{brl(cartTotal)}</div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/carrinho")}
            className="border-0 rounded-[13px] bg-ne-green text-white px-[18px] py-3 cursor-pointer hover:bg-[#00c40d]"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}
          >
            Ver carrinho
          </button>
        </div>
      )}

      <Toast bottom={160} />
      <TabBar />
    </>
  );
}

function CategoryGlyph({ id }: { id: string }) {
  switch (id) {
    case "todos":
      return <div className="w-4 h-4 rounded-[4px] border-[2.5px] border-current rotate-45" />;
    case "tintas":
      return <div className="w-[17px] h-[17px] rounded-full bg-current" />;
    case "pinceis":
      return <div className="w-1.5 h-5 rounded-[3px_3px_1px_1px] bg-current rotate-[18deg]" />;
    case "rolos":
      return <div className="w-5 h-[11px] rounded-[5px] bg-current" />;
    case "acabamentos":
      return <div className="w-[18px] h-[18px] rounded-full border-[3px] border-current" />;
    default:
      return null;
  }
}
