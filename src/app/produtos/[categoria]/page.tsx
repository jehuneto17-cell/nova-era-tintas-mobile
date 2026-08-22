"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, SlidersHorizontal, X, PackageSearch } from "lucide-react";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { getProdutosPorCategoria, precoMinimo, precoAPrazoMinimo, estoqueTotal, capaUrl, subscribeProdutos } from "@/lib/produtos";
import { subscribeCategorias } from "@/lib/categorias";
import { brl } from "@/lib/store";
import { useToast } from "@/lib/toast";
import type { Categoria, Produto } from "@/lib/types";

type Sort = "rel" | "asc" | "desc";

const num = (s: string) => {
  const d = s.replace(/[^\d]/g, "");
  return d === "" ? null : parseInt(d, 10);
};

export default function ProdutosFiltradosPage() {
  const params = useParams<{ categoria: string }>();
  const router = useRouter();
  const { flash } = useToast();

  const categoriaId = params.categoria;
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [result, setResult] = useState<{ categoriaId: string; produtos: Produto[] } | null>(null);

  useEffect(() => {
    const unsub = subscribeCategorias(setCategorias);
    return unsub;
  }, []);

  useEffect(() => {
    if (categoriaId === "todos") {
      const unsub = subscribeProdutos((p) => {
        setResult({ categoriaId, produtos: p });
      });
      return unsub;
    }
    let active = true;
    getProdutosPorCategoria(categoriaId).then((p) => {
      if (!active) return;
      setResult({ categoriaId, produtos: p });
    });
    return () => {
      active = false;
    };
  }, [categoriaId]);

  const loading = result?.categoriaId !== categoriaId;
  const produtos = useMemo(() => (!loading ? result?.produtos ?? [] : []), [loading, result]);

  const categoriaMeta = categorias.find((c) => c.id === categoriaId);
  const categoriaLabel = categoriaId === "todos" ? "Produtos" : categoriaMeta?.nome ?? "Produtos";

  const [sort, setSort] = useState<Sort>("rel");
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState(1);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [stockOnly, setStockOnly] = useState(false);
  const [ambiente, setAmbiente] = useState<("interior" | "exterior")[]>([]);
  const [draft, setDraft] = useState<{ min: string; max: string; stockOnly: boolean; ambiente: ("interior" | "exterior")[] }>({
    min: "",
    max: "",
    stockOnly: false,
    ambiente: [],
  });
  const [priceError, setPriceError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const a = num(min);
    const b = num(max);
    let list = produtos.filter((p) => {
      const preco = precoMinimo(p);
      return (
        (a === null || preco >= a) &&
        (b === null || preco <= b) &&
        (!stockOnly || estoqueTotal(p) > 0) &&
        (ambiente.length === 0 || (p.ambientes ?? []).some((amb) => ambiente.includes(amb)))
      );
    });
    if (sort === "asc") list = [...list].sort((x, y) => precoMinimo(x) - precoMinimo(y));
    if (sort === "desc") list = [...list].sort((x, y) => precoMinimo(y) - precoMinimo(x));
    return list;
  }, [produtos, min, max, stockOnly, ambiente, sort]);

  const shown = filtered.slice(0, page * 6);

  const openModal = () => {
    setDraft({ min, max, stockOnly, ambiente });
    setPriceError(null);
    setModal(true);
  };

  const toggleDraftAmbiente = (valor: "interior" | "exterior") => {
    setDraft((d) => ({
      ...d,
      ambiente: d.ambiente.includes(valor) ? d.ambiente.filter((a) => a !== valor) : [...d.ambiente, valor],
    }));
  };

  const apply = () => {
    const a = num(draft.min);
    const b = num(draft.max);
    if (a !== null && b !== null && a > b) {
      setPriceError("O valor mínimo deve ser menor que o máximo");
      return;
    }
    setMin(draft.min);
    setMax(draft.max);
    setStockOnly(draft.stockOnly);
    setAmbiente(draft.ambiente);
    setPage(1);
    setModal(false);
    flash("Filtros aplicados");
  };

  const clearFilters = () => {
    setMin("");
    setMax("");
    setStockOnly(false);
    setAmbiente([]);
    setDraft({ min: "", max: "", stockOnly: false, ambiente: [] });
    setPage(1);
    setPriceError(null);
    setModal(false);
    flash("Filtros limpos");
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
        <div className="flex-1 text-center" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", color: "#000" }}>
          {categoriaLabel}
        </div>
        <div className="flex-none w-10" />
      </div>

      <div className="absolute top-[96px] left-0 right-0 z-29 box-border py-3 px-4 bg-[#F5F5F5] border-b border-[#E5E5E5] flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex-none" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>Ordenar por:</span>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as Sort);
              setPage(1);
            }}
            className="flex-1 min-w-0 h-9 box-border px-2.5 border border-[#E5E5E5] rounded-[10px] bg-white text-[13px] font-medium text-[#000] cursor-pointer hover:border-ne-green transition-colors"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            <option value="rel">Relevância</option>
            <option value="asc">Menor preço</option>
            <option value="desc">Maior preço</option>
          </select>
        </div>
        <div className="flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={openModal}
            className="flex-none h-[34px] px-3.5 border border-[#E5E5E5] rounded-[10px] bg-white cursor-pointer flex items-center gap-1.5 hover:border-ne-green hover:text-ne-green transition-colors"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#000" }}
          >
            <SlidersHorizontal size={15} />
            <span>Filtrar</span>
          </button>
          <span className="text-xs text-[#999999]">{filtered.length === 1 ? "1 produto" : `${filtered.length} produtos`}</span>
        </div>
      </div>

      <div className="ne-scroll absolute inset-x-0 top-[190px] bottom-[72px]">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <span className="w-8 h-8 rounded-full border-[3px] border-[#E5E5E5] border-t-ne-green" style={{ animation: "ne-spin .8s linear infinite" }} />
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 p-4">
              {shown.map((p) => {
                const preco = precoMinimo(p);
                const precoCheio = precoAPrazoMinimo(p);
                const temDesconto = p.descontoPct > 0 && precoCheio > preco;
                const emEstoque = estoqueTotal(p) > 0;
                const foto = capaUrl(p);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => router.push(`/produto/${p.id}`)}
                    className="box-border border border-[#EDEFED] rounded-2xl overflow-hidden bg-white cursor-pointer text-left flex flex-col shadow-[0_2px_8px_rgba(0,0,0,.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,.15)] hover:bg-[#F5F5F5] transition-all"
                  >
                    <div className="relative w-full h-[150px] bg-[#F5F5F5]">
                      {foto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={foto} alt={p.nome} className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlaceholder label={"Foto " + p.nome} />
                      )}
                      {!emEstoque && (
                        <span className="absolute top-2 left-2 py-[3px] px-2 rounded-[7px] bg-[#012418]/82 text-white text-[10px] font-bold" style={{ fontFamily: "var(--font-archivo)" }}>
                          Sem estoque
                        </span>
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
            {shown.length < filtered.length && (
              <div className="px-4 pb-4 -mt-1">
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
          <div className="py-16 px-8 flex flex-col items-center gap-2.5">
            <PackageSearch size={48} color="#E5E5E5" strokeWidth={1.8} />
            <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#000" }}>Nenhum produto encontrado</span>
            <span className="text-xs text-[#999999]">Tente ajustar os filtros</span>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-2 h-10 px-5 border-0 rounded-[14px] bg-ne-green text-white cursor-pointer hover:bg-[#009209] transition-colors"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14 }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      <TabBar />

      {modal && (
        <div className="absolute inset-0 z-45 bg-[#012418]/50 flex items-center justify-center p-6" style={{ animation: "ne-fade .2s ease-out" }}>
          <div className="w-full max-w-[400px] box-border p-5 rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,.3)] flex flex-col gap-4.5" style={{ animation: "ne-pop .2s ease-out" }}>
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em", color: "#000" }}>Filtros</span>
              <button
                type="button"
                onClick={() => setModal(false)}
                className="w-7 h-7 border-0 rounded-full bg-[#F5F5F5] text-[#999999] text-[13px] cursor-pointer hover:bg-[#EDEFED] hover:text-black transition-colors flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>Preço</span>
              <div className="flex gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  value={draft.min}
                  onChange={(e) => setDraft((d) => ({ ...d, min: e.target.value }))}
                  placeholder="R$ 0"
                  className="flex-1 min-w-0 h-10 box-border px-3 border border-[#E5E5E5] rounded-[10px] bg-white text-sm text-[#000]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={draft.max}
                  onChange={(e) => setDraft((d) => ({ ...d, max: e.target.value }))}
                  placeholder="R$ 500"
                  className="flex-1 min-w-0 h-10 box-border px-3 border border-[#E5E5E5] rounded-[10px] bg-white text-sm text-[#000]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                />
              </div>
              {priceError && <span className="text-xs text-[#EF4444]">{priceError}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>Disponibilidade</span>
              <button
                type="button"
                onClick={() => setDraft((d) => ({ ...d, stockOnly: !d.stockOnly }))}
                className="flex items-center gap-2.5 border-0 bg-transparent p-0 cursor-pointer text-left"
              >
                <span
                  className="flex-none w-[18px] h-[18px] rounded-[5px] box-border flex items-center justify-center transition-colors"
                  style={{ border: `1.5px solid ${draft.stockOnly ? "#00B20B" : "#D8DED9"}`, background: draft.stockOnly ? "#00B20B" : "#FFFFFF" }}
                >
                  {draft.stockOnly && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
                </span>
                <span className="text-sm text-[#000]">Apenas em estoque</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>Ambiente</span>
              {([
                { valor: "interior" as const, label: "Interior" },
                { valor: "exterior" as const, label: "Exterior" },
              ]).map(({ valor, label }) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => toggleDraftAmbiente(valor)}
                  className="flex items-center gap-2.5 border-0 bg-transparent p-0 cursor-pointer text-left"
                >
                  <span
                    className="flex-none w-[18px] h-[18px] rounded-[5px] box-border flex items-center justify-center transition-colors"
                    style={{
                      border: `1.5px solid ${draft.ambiente.includes(valor) ? "#00B20B" : "#D8DED9"}`,
                      background: draft.ambiente.includes(valor) ? "#00B20B" : "#FFFFFF",
                    }}
                  >
                    {draft.ambiente.includes(valor) && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
                  </span>
                  <span className="text-sm text-[#000]">{label}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={apply}
                className="w-full h-12 border-0 rounded-2xl bg-ne-green text-white cursor-pointer hover:bg-[#009209] transition-colors"
                style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15 }}
              >
                Aplicar Filtros
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="w-full h-12 border-2 border-[#E5E5E5] rounded-2xl bg-white text-black cursor-pointer hover:border-[#999999] transition-colors"
                style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15 }}
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast bottom={100} />
    </>
  );
}
