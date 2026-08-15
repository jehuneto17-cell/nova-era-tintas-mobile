"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, X, Clock } from "lucide-react";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { useBuscas } from "@/lib/hooks";

const RECENTS_SEED: string[] = [];

export default function BuscaPage() {
  const router = useRouter();
  const buscas = useBuscas();
  const populares = buscas?.mostrar ? buscas.termos : [];
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [recents, setRecents] = useState(RECENTS_SEED);
  const inputRef = useRef<HTMLInputElement>(null);

  const goSearch = (term: string) => {
    const q = term.trim();
    if (!q) return;
    setRecents((prev) => [q, ...prev.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 8));
    router.push(`/busca/resultados?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* header */}
      <div className="absolute top-0 left-0 right-0 z-30 box-border px-3 pt-[46px] pb-2.5 bg-white border-b border-[#EDEFED] flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-none w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center transition-colors hover:bg-[#F5F5F5] hover:border-ne-green"
        >
          <ChevronLeft size={18} color="#012418" strokeWidth={2.4} />
        </button>
        <div
          className="flex-1 min-w-0 text-center overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: "#000000" }}
        >
          Buscar
        </div>
        <div className="flex-none w-10 h-10 flex items-center justify-center pointer-events-none">
          <Search size={18} color="#999999" strokeWidth={2} />
        </div>
      </div>

      <div className="ne-scroll absolute inset-x-0 top-[96px] bottom-[72px] bg-white">
        <div className="px-4 pt-4">
          <div
            className="relative h-12 rounded-full flex items-center px-4 gap-2.5 transition-colors"
            style={{
              background: "#F5F5F5",
              border: `1.5px solid ${focused ? "#00B20B" : "transparent"}`,
            }}
          >
            <Search size={18} color={focused ? "#00B20B" : "#999999"} strokeWidth={2.2} className="flex-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") goSearch(query);
              }}
              placeholder="Buscar produto, marca..."
              className="flex-1 min-w-0 border-0 outline-none bg-transparent"
              style={{ fontFamily: "var(--font-manrope)", fontSize: 14.5, fontWeight: 500, color: "#012418" }}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="flex-none w-6 h-6 rounded-full bg-[#E4E7E4] text-[#666] cursor-pointer flex items-center justify-center hover:bg-[#D8DBD8]"
                style={{ animation: "ne-fadein .15s ease-out" }}
              >
                <X size={14} strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>

        {/* recentes */}
        <div className="px-4 pt-6">
          <div className="flex items-center justify-between mb-2.5">
            <span
              className="uppercase text-[#999999]"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 11.5, letterSpacing: "0.08em" }}
            >
              Recentes
            </span>
            {recents.length > 0 && (
              <button
                type="button"
                onClick={() => setRecents([])}
                className="border-0 bg-transparent p-0 cursor-pointer text-ne-blue hover:underline"
                style={{ fontFamily: "var(--font-manrope)", fontSize: 12, fontWeight: 600 }}
              >
                Limpar tudo
              </button>
            )}
          </div>

          {recents.length > 0 ? (
            <div className="flex flex-col -mx-1">
              {recents.map((r) => (
                <div key={r} className="flex items-center gap-3 py-3 px-1 rounded-[10px] cursor-pointer hover:bg-[#F5F5F5] transition-colors">
                  <button type="button" onClick={() => goSearch(r)} className="flex-1 min-w-0 flex items-center gap-3 text-left">
                    <Clock size={17} color="#999999" strokeWidth={1.8} className="flex-none" />
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
          ) : (
            <div className="py-6 text-center text-[13px] font-medium text-[#999999]">Nenhuma busca recente</div>
          )}
        </div>

        <div className="h-px my-2 mx-4 bg-[#EDEFED]" />

        {/* populares */}
        {populares.length > 0 && (
          <div className="px-4 pt-4 pb-8">
            <div
              className="uppercase text-[#999999] mb-2.5"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 11.5, letterSpacing: "0.08em" }}
            >
              Populares
            </div>
            <div className="flex flex-wrap gap-2">
              {populares.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => goSearch(t)}
                  className="border border-[#E6E9E6] bg-white text-black px-[13px] py-2 rounded-full cursor-pointer hover:bg-[#F5F5F5] hover:border-ne-green transition-colors"
                  style={{ fontFamily: "var(--font-manrope)", fontSize: 13, fontWeight: 600 }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Toast bottom={96} />
      <TabBar />
    </>
  );
}
