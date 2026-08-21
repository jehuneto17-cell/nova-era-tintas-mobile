"use client";

import { createElement, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Share2, Heart, Star, Minus, Plus, Truck } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { getProduto, getProdutosPorCategoria, capaUrl, precoMinimo, estoqueTotal } from "@/lib/produtos";
import { variacaoPadrao } from "@/lib/mappers";
import { brl, useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { useCategoriasAtivas, useCoresAtivas } from "@/lib/hooks";
import { categoryIcon } from "@/lib/icons";
import type { Produto } from "@/lib/types";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { corEscolhidaKey } from "@/lib/corEscolhida";

const TODAS_CORES = "__todas__";

function chaveDe(cor: string, volume: string) {
  return `${cor}|${volume}`;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { toggleFavorite, favorites, addItem } = useStore();
  const { flash } = useToast();
  const { categorias } = useCategoriasAtivas();
  const { cores: paletaGlobal } = useCoresAtivas();

  const [result, setResult] = useState<{ id: string; produto: Produto | null } | null>(null);
  const [relacionados, setRelacionados] = useState<Produto[]>([]);

  const [cor, setCor] = useState<string | null>(null);
  const [volume, setVolume] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    let active = true;
    getProduto(params.id).then((p) => {
      if (!active) return;
      setResult({ id: params.id, produto: p });
      if (p) {
        const padrao = variacaoPadrao(p);
        let corInicial: string | null = null;
        if (p.todasCores) {
          try {
            corInicial = sessionStorage.getItem(corEscolhidaKey(p.id));
          } catch {
            corInicial = null;
          }
        }
        if (padrao) {
          const [, variacao] = padrao;
          setCor(p.todasCores ? corInicial : variacao.cor);
          setVolume(variacao.volume);
        } else {
          setCor(p.todasCores ? corInicial : p.cores[0]?.nome ?? null);
          setVolume(p.volumes[0] ?? null);
        }
        setQty(1);
        setSlide(0);
      }
    });
    return () => {
      active = false;
    };
  }, [params.id]);

  const loading = result?.id !== params.id;
  const notFound = !loading && result?.produto === null;
  const produto = !loading ? result?.produto ?? null : null;

  useEffect(() => {
    if (!produto) return;
    let active = true;
    const produtoId = produto.id;
    getProdutosPorCategoria(produto.categoriaId).then((lista) => {
      if (!active) return;
      setRelacionados(lista.filter((p) => p.id !== produtoId && p.ativo));
    });
    return () => {
      active = false;
    };
  }, [produto]);

  // Recarrega a cor escolhida ao voltar (via botão voltar do navegador/gesto) da
  // tela /produto/[id]/cor — a página não remonta em navegação client-side.
  useEffect(() => {
    if (!produto?.todasCores) return;
    const produtoId = produto.id;
    const lerCorSalva = () => {
      try {
        const salva = sessionStorage.getItem(corEscolhidaKey(produtoId));
        if (salva) setCor(salva);
      } catch {
        // sessionStorage indisponível — mantém seleção atual
      }
    };
    window.addEventListener("popstate", lerCorSalva);
    return () => window.removeEventListener("popstate", lerCorSalva);
  }, [produto?.id, produto?.todasCores]);

  const fav = produto ? favorites.includes(produto.id) : false;
  const categoria = produto ? categorias.find((c) => c.id === produto.categoriaId) : undefined;
  const categoriaIconElement = useMemo(
    () => createElement(categoryIcon(categoria?.icone ?? "package"), { size: 12, color: "#FFFFFF", strokeWidth: 2.4 }),
    [categoria?.icone]
  );

  const variacao = useMemo(() => {
    if (!produto || !volume) return null;
    if (produto.todasCores) return produto.variacoes[chaveDe(TODAS_CORES, volume)] ?? null;
    if (!cor) return null;
    return produto.variacoes[chaveDe(cor, volume)] ?? null;
  }, [produto, cor, volume]);

  const corDisponivel = (nomeCor: string) => {
    if (!produto || !volume || produto.todasCores) return true;
    const v = produto.variacoes[chaveDe(nomeCor, volume)];
    return !!v && v.ativo && v.estoque > 0;
  };

  const volumeDisponivel = (vol: string) => {
    if (!produto) return true;
    if (produto.todasCores) {
      const v = produto.variacoes[chaveDe(TODAS_CORES, vol)];
      return !!v && v.ativo;
    }
    if (!cor) return true;
    const v = produto.variacoes[chaveDe(cor, vol)];
    return !!v && v.ativo && v.estoque > 0;
  };

  const unitPrice = variacao?.preco ?? 0;
  const oldPrice = produto && produto.descontoPct > 0 ? unitPrice / (1 - produto.descontoPct / 100) : null;
  const total = unitPrice * qty;
  // Produtos todasCores não têm estoque controlado por cor (o admin trata como "—"),
  // então disponibilidade depende só da variação estar ativa, não de v.estoque > 0.
  const emEstoque = !!variacao && variacao.ativo && (produto?.todasCores || variacao.estoque > 0);

  const onCarouselScroll = (el: HTMLDivElement) => {
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setSlide(idx);
  };

  const handleAdd = () => {
    if (!produto || !variacao || !volume || !emEstoque) return;
    if (!produto.todasCores && !cor) return;
    const corChave = produto.todasCores ? TODAS_CORES : (cor as string);
    const specsCor = produto.todasCores ? "Qualquer cor" : `Cor: ${cor}`;
    addItem(
      {
        produtoId: produto.id,
        variacao: chaveDe(corChave, volume),
        title: produto.nome,
        specs: `${specsCor} | Volume: ${volume}`,
        price: variacao.preco,
        oldPrice,
        shot: produto.nome.split(" ")[0],
        shotUrl: capaUrl(produto),
      },
      qty
    );
    flash(produto.nome.split(" ").slice(0, 3).join(" ") + " no carrinho");
  };

  if (loading) {
    return (
      <div className="absolute inset-0 bg-white flex items-center justify-center">
        <span className="w-8 h-8 rounded-full border-[3px] border-[#E5E5E5] border-t-ne-green" style={{ animation: "ne-spin .8s linear infinite" }} />
      </div>
    );
  }

  if (notFound || !produto) {
    return (
      <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-3 px-8 text-center">
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#012418" }}>Produto não encontrado</div>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-2 h-11 px-5 border-0 rounded-2xl bg-ne-green text-white cursor-pointer"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14 }}
        >
          Voltar para Home
        </button>
      </div>
    );
  }

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
            onScroll={(e) => onCarouselScroll(e.currentTarget)}
            className="ne-hs flex snap-x snap-mandatory"
            style={{ height: 300 }}
          >
            {produto.fotos.length > 0 ? (
              produto.fotos.map((f) => (
                <div key={f.id} className="w-full flex-none snap-center bg-[#F1F3F1]" style={{ height: 300 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt={produto.nome} className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <div className="w-full flex-none snap-center bg-[#F1F3F1]" style={{ height: 300 }}>
                <ImagePlaceholder label={produto.nome} />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(produto.id)}
            className="absolute top-3.5 right-3.5 w-10 h-10 rounded-full bg-white/90 backdrop-blur cursor-pointer flex items-center justify-center shadow-[0_3px_12px_rgba(1,36,24,.14)] hover:scale-105 active:scale-90 transition-transform"
          >
            <Heart size={21} color={fav ? "#E23B3B" : "#999999"} fill={fav ? "#E23B3B" : "none"} strokeWidth={2} />
          </button>

          {produto.fotos.length > 1 && (
            <div className="absolute left-0 right-0 bottom-3.5 flex items-center justify-center gap-1.5">
              {produto.fotos.map((f, i) => (
                <div
                  key={f.id}
                  className="rounded-[3px] transition-all"
                  style={{
                    width: slide === i ? 20 : 6,
                    height: 6,
                    background: slide === i ? "#00B20B" : "rgba(255,255,255,.75)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* content */}
        <div className="px-4 pt-4 flex flex-col gap-4">
          {/* title + rating */}
          <div className="flex flex-col gap-2">
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 24, lineHeight: 1.15, letterSpacing: "-0.03em", color: "#000" }}>
              {produto.nome}
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-5 h-5 rounded-md flex-none flex items-center justify-center"
                  style={{ background: categoria?.fundo ?? "#00B20B" }}
                >
                  {categoriaIconElement}
                </span>
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 13, color: "#012418" }}>{produto.categoria}</span>
              </div>
              <div className="w-px h-3.5 bg-[#E5E5E5]" />
              <div className="flex items-center gap-1 text-[13px] font-medium text-[#999999]">
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, color: "#000" }}>4.8</span>
                <Star size={13} fill="#F5A524" color="#F5A524" />
                <span>(229 avaliações)</span>
              </div>
            </div>
          </div>

          {/* price */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2.5">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", color: "#00B20B" }}>
                {brl(unitPrice)}
              </div>
              {oldPrice !== null && (
                <>
                  <div className="text-[14px] font-medium text-[#999999] line-through">{brl(oldPrice)}</div>
                  <div
                    className="px-2 py-[3px] rounded-[7px] bg-[#E7F7E8] text-ne-green"
                    style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 11 }}
                  >
                    -{produto.descontoPct}%
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#999999]">
              <Truck size={15} color="#0088B7" strokeWidth={2} />
              <span>
                Entrega em 30 min · <span className="font-bold text-ne-green">frete grátis</span>
              </span>
            </div>
          </div>

          <div className="h-px bg-[#EDEFED]" />

          {/* color picker */}
          {produto.todasCores ? (
            <button
              type="button"
              onClick={() => {
                try {
                  if (cor) sessionStorage.setItem(corEscolhidaKey(produto.id), cor);
                } catch {
                  // sessionStorage indisponível — segue navegando sem pré-selecionar
                }
                router.push(`/produto/${produto.id}/cor`);
              }}
              className="flex items-center justify-between gap-3 cursor-pointer bg-transparent border-0 p-0 text-left"
            >
              <div className="flex flex-col gap-0.5">
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>Cor</span>
                <span className="text-[13px] font-medium text-[#999999]">
                  {cor ?? "Selecione uma cor da paleta"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {cor && (
                  <span
                    className="w-8 h-8 rounded-full flex-none"
                    style={{
                      background: paletaGlobal.find((c) => c.nome === cor)?.hex ?? "#F1F3F1",
                      border: "1.5px solid #E5E5E5",
                    }}
                  />
                )}
                <ChevronRight size={18} color="#999999" strokeWidth={2.2} />
              </div>
            </button>
          ) : (
            produto.cores.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-baseline gap-2">
                  <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>Cor</span>
                  {cor && <span className="text-[13px] font-medium text-[#999999]">{cor}</span>}
                </div>
                <div className="flex gap-3 flex-wrap">
                  {produto.cores.map((c) => {
                    const disponivel = corDisponivel(c.nome);
                    return (
                      <button
                        key={c.nome}
                        type="button"
                        onClick={() => disponivel && setCor(c.nome)}
                        title={c.nome}
                        disabled={!disponivel}
                        className="w-10 h-10 rounded-full flex-none cursor-pointer p-0 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30"
                        style={{
                          background: c.hex,
                          border: cor === c.nome ? `3px solid #00B20B` : "1.5px solid #E5E5E5",
                          boxShadow: cor === c.nome ? "0 0 0 2px #FFFFFF inset" : "none",
                          transform: cor === c.nome ? "scale(1.06)" : "scale(1)",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )
          )}

          {/* size picker */}
          {produto.volumes.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>Volume</div>
              <div className="flex gap-2.5">
                {produto.volumes.map((v) => {
                  const active = v === volume;
                  const disponivel = volumeDisponivel(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => disponivel && setVolume(v)}
                      disabled={!disponivel}
                      className="h-10 px-4 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                      style={{
                        border: `1.5px solid ${active ? "#012418" : "#E5E5E5"}`,
                        background: active ? "#012418" : "#F5F5F5",
                        color: active ? "#FFFFFF" : "#999999",
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}>{v}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!emEstoque && (
            <div className="py-2.5 px-3.5 rounded-md bg-[#FFE5E5] text-[#E63946] text-[12.5px] font-semibold">
              Essa combinação está sem estoque no momento
            </div>
          )}

          {/* quantity stepper */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>Quantidade</div>
              {variacao && !produto.todasCores && (
                <div className="text-[11.5px] font-medium text-[#999999]">{variacao.estoque} em estoque</div>
              )}
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-l-xl border border-r-0 border-[#E5E5E5] bg-white text-[#012418] text-[19px] leading-none cursor-pointer flex items-center justify-center hover:bg-[#F5F5F5] transition-colors disabled:opacity-40"
                disabled={qty <= 1}
              >
                <Minus size={15} color="#012418" strokeWidth={2.4} />
              </button>
              <div className="w-12 h-10 border border-[#E5E5E5] bg-white flex items-center justify-center" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15, color: "#000" }}>
                {qty}
              </div>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(99, produto.todasCores ? 99 : variacao?.estoque ?? 99, q + 1))}
                className="w-10 h-10 rounded-r-xl border border-l-0 border-[#E5E5E5] bg-white text-[#012418] text-[19px] leading-none cursor-pointer flex items-center justify-center hover:bg-[#F5F5F5] transition-colors disabled:opacity-40"
                disabled={qty >= Math.min(99, produto.todasCores ? 99 : variacao?.estoque ?? 99)}
              >
                <Plus size={15} color="#012418" strokeWidth={2.4} />
              </button>
            </div>
          </div>

          <div className="h-px bg-[#EDEFED]" />

          {/* description */}
          <div className="flex flex-col gap-2">
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#000" }}>Descrição</div>
            <div
              className="ne-descricao text-[14px] leading-relaxed text-[#5C6A62]"
              dangerouslySetInnerHTML={{ __html: produto.descricao }}
            />
          </div>

          {/* specs table */}
          {produto.specs.length > 0 && (
            <div className="flex flex-col gap-2 mb-2">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#000" }}>Especificações</div>
              <div className="rounded-[14px] border border-[#EDEFED] overflow-hidden">
                {produto.specs.map((s, i) => (
                  <div
                    key={s.nome}
                    className="flex items-center justify-between px-3.5 py-3"
                    style={{ borderTop: i === 0 ? "none" : "1px solid #F2F4F2" }}
                  >
                    <span className="text-[13.5px] text-[#999999]">{s.nome}</span>
                    <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#000" }}>{s.valor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* related products */}
        {relacionados.length > 0 && (
          <div className="mt-6 flex flex-col gap-3">
            <div className="px-4" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#000" }}>
              Você também pode gostar
            </div>
            <div className="ne-hs px-4 pb-1">
              <div className="flex gap-3 w-max">
                {relacionados.map((p) => {
                  const preco = precoMinimo(p);
                  const emEstoqueRel = estoqueTotal(p) > 0;
                  const foto = capaUrl(p);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => router.push(`/produto/${p.id}`)}
                      className="w-[140px] flex-none text-left cursor-pointer flex flex-col gap-2 p-2.5 bg-white rounded-xl border border-[#EDEFED] shadow-[0_2px_10px_rgba(1,36,24,.05)] hover:border-ne-green transition-colors"
                    >
                      <div className="relative w-full aspect-square rounded-[10px] overflow-hidden bg-[#F1F3F1]">
                        {foto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={foto} alt={p.nome} className="w-full h-full object-cover" />
                        ) : (
                          <ImagePlaceholder label={p.nome} />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div
                          className="line-clamp-2"
                          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, lineHeight: 1.25, color: "#000" }}
                        >
                          {p.nome}
                        </div>
                        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 14.5, letterSpacing: "-0.02em", color: "#00B20B" }}>
                          {brl(preco)}
                        </div>
                        {!emEstoqueRel && <div className="text-[10px] font-semibold text-[#E63946]">Sem estoque</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* sticky action bar */}
      <div className="absolute left-0 right-0 z-31 bottom-[72px] box-border px-4 py-3 bg-white border-t border-[#EDEFED] flex items-center gap-3 shadow-[0_-6px_20px_rgba(1,36,24,.05)]">
        <button
          type="button"
          onClick={() => toggleFavorite(produto.id)}
          className="flex-none w-14 h-14 rounded-xl border-2 cursor-pointer flex items-center justify-center hover:border-ne-green transition-colors"
          style={{ borderColor: fav ? "#E23B3B" : "#E5E5E5" }}
        >
          <Heart size={24} color={fav ? "#E23B3B" : "#999999"} fill={fav ? "#E23B3B" : "none"} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!emEstoque}
          className="flex-1 h-14 rounded-3xl bg-ne-green text-white cursor-pointer flex items-center justify-center gap-2.5 hover:bg-[#009209] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16 }}
        >
          {emEstoque ? `Adicionar · ${brl(total)}` : "Sem estoque"}
        </button>
      </div>

      <Toast bottom={160} />
      <TabBar />
    </>
  );
}
