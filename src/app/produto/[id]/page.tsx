"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Share2, Heart, Star, Minus, Plus } from "lucide-react";
import { getProduto, capaUrl } from "@/lib/produtos";
import { variacaoPadrao } from "@/lib/mappers";
import { brl, useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { useFrete } from "@/lib/hooks";
import type { Produto } from "@/lib/types";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

function chaveDe(cor: string, volume: string) {
  return `${cor}|${volume}`;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { toggleFavorite, favorites, addItem } = useStore();
  const { flash } = useToast();
  const frete = useFrete();

  const [result, setResult] = useState<{ id: string; produto: Produto | null } | null>(null);

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
        if (padrao) {
          const [, variacao] = padrao;
          setCor(variacao.cor);
          setVolume(variacao.volume);
        } else {
          setCor(p.cores[0]?.nome ?? null);
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

  const fav = produto ? favorites.includes(produto.id) : false;

  const variacao = useMemo(() => {
    if (!produto || !cor || !volume) return null;
    return produto.variacoes[chaveDe(cor, volume)] ?? null;
  }, [produto, cor, volume]);

  const corDisponivel = (nomeCor: string) => {
    if (!produto || !volume) return true;
    const v = produto.variacoes[chaveDe(nomeCor, volume)];
    return !!v && v.ativo && v.estoque > 0;
  };

  const volumeDisponivel = (vol: string) => {
    if (!produto || !cor) return true;
    const v = produto.variacoes[chaveDe(cor, vol)];
    return !!v && v.ativo && v.estoque > 0;
  };

  const unitPrice = variacao?.preco ?? 0;
  const oldPrice = produto && produto.descontoPct > 0 ? unitPrice / (1 - produto.descontoPct / 100) : null;
  const total = unitPrice * qty;
  const emEstoque = !!variacao && variacao.ativo && variacao.estoque > 0;

  const onCarouselScroll = (el: HTMLDivElement) => {
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setSlide(idx);
  };

  const handleAdd = () => {
    if (!produto || !variacao || !cor || !volume || !emEstoque) return;
    addItem(
      {
        produtoId: produto.id,
        variacao: chaveDe(cor, volume),
        title: produto.nome,
        specs: `Cor: ${cor} | Volume: ${volume}`,
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
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur cursor-pointer flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,.14)] active:scale-90 transition-transform"
          >
            <Heart size={20} color={fav ? "#00B20B" : "#012418"} fill={fav ? "#00B20B" : "none"} strokeWidth={2} />
          </button>

          {produto.fotos.length > 1 && (
            <div className="absolute left-0 right-0 bottom-3 flex items-center justify-center gap-1.5">
              {produto.fotos.map((f, i) => (
                <div
                  key={f.id}
                  className="rounded-full transition-all"
                  style={{
                    width: slide === i ? 16 : 6,
                    height: 6,
                    background: slide === i ? "#00B20B" : "rgba(1,36,24,.2)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* title + rating */}
        <div className="px-5 pt-5">
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 24, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#000" }}>
            {produto.nome}
          </div>
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <span
              className="px-2.5 py-1 rounded-full bg-[#F1F3F1] text-[#012418] capitalize"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 11.5 }}
            >
              {produto.categoria}
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
            {oldPrice !== null && (
              <>
                <div className="text-[14px] font-semibold text-[#999999] line-through mb-0.5">{brl(oldPrice)}</div>
                <div
                  className="px-2 py-0.5 rounded-md bg-[#FFE5E5] text-[#E63946] mb-0.5"
                  style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 11.5 }}
                >
                  -{produto.descontoPct}%
                </div>
              </>
            )}
          </div>

          {frete && (
            <div className="mt-2 text-[12.5px] font-medium text-[#0088B7]">
              Frete grátis acima de {brl(frete.gratis_acima)}
            </div>
          )}

          {/* color picker */}
          {produto.cores.length > 0 && (
            <div className="mt-6">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}>Cor</div>
              <div className="mt-2.5 flex items-center gap-3 flex-wrap">
                {produto.cores.map((c) => {
                  const disponivel = corDisponivel(c.nome);
                  return (
                    <button
                      key={c.nome}
                      type="button"
                      onClick={() => disponivel && setCor(c.nome)}
                      title={c.nome}
                      disabled={!disponivel}
                      className="w-9 h-9 rounded-full flex-none cursor-pointer flex items-center justify-center transition-transform active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
                      style={{
                        background: c.hex,
                        border: c.hex.toLowerCase() === "#ffffff" ? "1.5px solid #E5E5E5" : "1.5px solid transparent",
                        boxShadow: cor === c.nome ? "0 0 0 2.5px #FFFFFF, 0 0 0 4.5px #00B20B" : "0 1px 4px rgba(0,0,0,.14)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* size picker */}
          {produto.volumes.length > 0 && (
            <div className="mt-5">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}>Volume</div>
              <div className="mt-2.5 flex items-center gap-2.5 flex-wrap">
                {produto.volumes.map((v) => {
                  const active = v === volume;
                  const disponivel = volumeDisponivel(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => disponivel && setVolume(v)}
                      disabled={!disponivel}
                      className="flex-1 py-2.5 rounded-xl cursor-pointer text-center transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                      style={{
                        border: `1.5px solid ${active ? "#00B20B" : "#E6E9E6"}`,
                        background: active ? "#00B20B" : "#FFFFFF",
                        color: active ? "#FFFFFF" : "#012418",
                        fontFamily: "var(--font-archivo)",
                        fontWeight: 700,
                        fontSize: 13.5,
                      }}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!emEstoque && (
            <div className="mt-4 py-2.5 px-3.5 rounded-md bg-[#FFE5E5] text-[#E63946] text-[12.5px] font-semibold">
              Essa combinação está sem estoque no momento
            </div>
          )}

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
                onClick={() => setQty((q) => Math.min(99, variacao?.estoque ?? 99, q + 1))}
                className="w-8 h-8 rounded-lg bg-[#F4F6F4] cursor-pointer flex items-center justify-center hover:bg-[#E6E9E6] transition-colors disabled:opacity-40"
                disabled={qty >= Math.min(99, variacao?.estoque ?? 99)}
              >
                <Plus size={15} color="#012418" strokeWidth={2.4} />
              </button>
            </div>
          </div>

          {/* description */}
          <div className="mt-6">
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15, color: "#012418" }}>Descrição</div>
            <div className="mt-2 text-[13.5px] leading-relaxed font-medium text-[#666]">{produto.descricao}</div>
          </div>

          {/* specs table */}
          {produto.specs.length > 0 && (
            <div className="mt-5 mb-2 rounded-xl border border-[#EDEFED] overflow-hidden">
              {produto.specs.map((s, i) => (
                <div
                  key={s.nome}
                  className="flex items-center justify-between px-4 py-3"
                  style={{ background: i % 2 === 0 ? "#FAFBFA" : "#FFFFFF", borderTop: i === 0 ? "none" : "1px solid #EDEFED" }}
                >
                  <span className="text-[12.5px] font-semibold text-[#999999]">{s.nome}</span>
                  <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418" }}>{s.valor}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* sticky action bar */}
      <div className="absolute left-0 right-0 z-31 bottom-[72px] box-border px-4 py-3 bg-white border-t border-[#EDEFED] flex items-center gap-3">
        <button
          type="button"
          onClick={() => toggleFavorite(produto.id)}
          className="flex-none w-[52px] h-[52px] rounded-2xl border cursor-pointer flex items-center justify-center transition-colors active:scale-95"
          style={{ borderColor: fav ? "#00B20B" : "#E5E5E5", background: fav ? "#EAF8EB" : "#FFFFFF" }}
        >
          <Heart size={20} color={fav ? "#00B20B" : "#012418"} fill={fav ? "#00B20B" : "none"} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!emEstoque}
          className="flex-1 h-[52px] rounded-2xl bg-ne-green text-white cursor-pointer flex items-center justify-center gap-2 hover:bg-[#00c40d] active:scale-[.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15 }}
        >
          {emEstoque ? `Adicionar · ${brl(total)}` : "Sem estoque"}
        </button>
      </div>

      <Toast bottom={160} />
      <TabBar />
    </>
  );
}
