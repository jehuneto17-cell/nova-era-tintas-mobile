"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Search, X, SearchX } from "lucide-react";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { useProdutos } from "@/lib/hooks";
import { precoMinimo, precoAPrazoMinimo, capaUrl } from "@/lib/produtos";
import { brl } from "@/lib/store";
import { useToast } from "@/lib/toast";

function ResultadosContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { flash } = useToast();
  const { produtos } = useProdutos();
  const initialQuery = params.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [draft, setDraft] = useState(initialQuery);
  const [focus, setFocus] = useState(false);
  const [page, setPage] = useState(1);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return produtos;
    const words = q.split(/\s+/);
    return produtos.filter((p) => {
      const n = (p.nome + " " + p.descricao).toLowerCase();
      return words.some((w) => n.includes(w.replace(/(a|o)$/, "")));
    });
  }, [query, produtos]);

  const shown = list.slice(0, page * 6);

  const run = () => {
    const t = draft.trim();
    if (!t) return;
    setQuery(t);
    setPage(1);
    flash(`Buscando "${t}"`);
  };

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
        <div className="flex-1 min-w-0 text-center overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: "#000" }}>
          {query ? `Resultados para "${query}"` : "Resultados"}
        </div>
        <div className="flex-none w-10" />
      </div>

      <div className="absolute top-[96px] left-0 right-0 z-29 box-border p-4 bg-white">
        <div
          className="relative h-11 box-border rounded-[22px] bg-white flex items-center gap-2.5 px-3 transition-colors"
          style={{ border: `2px solid ${focus ? "#00B20B" : "#E5E5E5"}` }}
        >
          <Search size={20} color="#00B20B" strokeWidth={2.2} className="flex-none" />
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="Buscar novamente..."
            className="flex-1 min-w-0 h-full border-0 bg-transparent outline-none text-sm text-[#000]"
            style={{ fontFamily: "var(--font-manrope)" }}
          />
          {draft.length > 0 && (
            <button
              type="button"
              onClick={() => setDraft("")}
              className="flex-none w-6 h-6 rounded-full bg-[#F0F0F0] text-[#999999] text-xs cursor-pointer flex items-center justify-center hover:bg-[#E5E5E5] hover:text-black transition-colors"
              style={{ animation: "ne-fadein .1s ease-out" }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="absolute top-[172px] left-0 right-0 z-29 box-border py-2 px-4 bg-[#F5F5F5] border-b border-[#EDEFED]">
        <span className="text-sm text-[#999999]">
          {list.length === 0 ? "Nenhum produto encontrado" : list.length === 1 ? "1 produto encontrado" : `${list.length} produtos encontrados`}
        </span>
      </div>

      <div className="ne-scroll absolute inset-x-0 top-[207px] bottom-[72px]">
        {list.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 p-4">
              {shown.map((p) => {
                const foto = capaUrl(p);
                const preco = precoMinimo(p);
                const precoCheio = precoAPrazoMinimo(p);
                const temDesconto = p.descontoPct > 0 && precoCheio > preco;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => router.push(`/produto/${p.id}`)}
                    className="box-border border border-[#EDEFED] rounded-2xl overflow-hidden bg-white cursor-pointer text-left flex flex-col shadow-[0_2px_8px_rgba(0,0,0,.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,.15)] hover:bg-[#F5F5F5] transition-all"
                    style={{ animation: "ne-fadein .3s ease-out" }}
                  >
                    <div className="w-full h-[150px] bg-[#F5F5F5]">
                      {foto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={foto} alt={p.nome} className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlaceholder label={"Foto " + p.nome} />
                      )}
                    </div>
                    <div className="p-2.5 flex flex-col gap-1">
                      <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, lineHeight: 1.25, color: "#000" }}>{p.nome}</span>
                      {temDesconto && (
                        <span className="text-[10.5px] font-medium text-[#999999] line-through">{brl(precoCheio)}</span>
                      )}
                      <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 14, color: "#00B20B" }}>{brl(preco)}</span>
                      {temDesconto && <span className="text-[10px] font-semibold text-ne-green">à vista no PIX</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            {shown.length < list.length && (
              <div className="px-4 pb-4">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="w-full h-12 border-2 border-ne-green rounded-2xl bg-white text-ne-green cursor-pointer hover:bg-[#F3FBF4] transition-colors"
                  style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15 }}
                >
                  Carregar mais
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-10 px-8 pb-8 flex flex-col items-center gap-2">
            <SearchX size={48} color="#E5E5E5" strokeWidth={1.7} />
            <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#000" }}>Nenhum produto encontrado</span>
            <span className="text-xs text-[#999999] text-center">Tente outros termos de busca</span>
            <div className="mt-3 flex flex-col items-center gap-2.5">
              <button
                type="button"
                onClick={() => router.push("/categorias")}
                className="border-0 bg-transparent p-0 cursor-pointer underline"
                style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#00B20B" }}
              >
                Ver categorias
              </button>
              <button
                type="button"
                onClick={() => router.push("/busca")}
                className="border-0 bg-transparent p-0 cursor-pointer underline"
                style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#00B20B" }}
              >
                Buscas populares
              </button>
            </div>
          </div>
        )}
      </div>

      <TabBar />
      <Toast />
    </>
  );
}

export default function ResultadosBuscaPage() {
  return (
    <Suspense fallback={null}>
      <ResultadosContent />
    </Suspense>
  );
}
