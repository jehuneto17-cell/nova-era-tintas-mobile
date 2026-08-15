"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Star, ImagePlus, X } from "lucide-react";
import { useToast } from "@/lib/toast";
import { subscribePedido } from "@/lib/pedidos";
import type { Pedido, PedidoItem } from "@/lib/types";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const RATING_COPY: Record<number, { text: string; color: string }> = {
  1: { text: "Que pena! Gostaríamos de melhorar, conte o que houve.", color: "#E63946" },
  2: { text: "Podemos melhorar. Obrigado pelo retorno.", color: "#FF7A00" },
  3: { text: "Bom, mas pode melhorar.", color: "#FFB703" },
  4: { text: "Muito bom! Ficamos felizes.", color: "#00B20B" },
  5: { text: "Excelente! Obrigado por comprar com a gente.", color: "#00B20B" },
};

function AvaliarContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { flash } = useToast();

  const pedidoId = params.get("pedido");
  const itemIndex = params.get("item");

  const [pedido, setPedido] = useState<Pedido | null | undefined>(undefined);

  useEffect(() => {
    if (!pedidoId) return;
    return subscribePedido(pedidoId, setPedido);
  }, [pedidoId]);

  const item: PedidoItem | null = useMemo(() => {
    if (!pedido) return null;
    const idx = itemIndex ? parseInt(itemIndex, 10) : 0;
    return pedido.itens[idx] ?? pedido.itens[0] ?? null;
  }, [pedido, itemIndex]);

  const [rating, setRating] = useState(0);
  const [bounceStar, setBounceStar] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<number[]>([]);
  const [recommend, setRecommend] = useState<"sim" | "nao" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const photoSeq = useRef(0);

  const commentLen = comment.trim().length;
  const commentTooShort = comment.length > 0 && commentLen < 10;
  const canSubmit = rating >= 1 && commentLen >= 10 && !submitting;

  const pickStar = (n: number) => {
    setRating(n);
    setBounceStar(n);
    setTimeout(() => setBounceStar((cur) => (cur === n ? null : cur)), 400);
  };

  const addPhoto = () => {
    if (photos.length >= 5) return;
    photoSeq.current += 1;
    setPhotos((prev) => [...prev, photoSeq.current]);
  };

  const removePhoto = (id: number) => {
    setPhotos((prev) => prev.filter((p) => p !== id));
  };

  const submit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      flash("Avaliação enviada — obrigado!");
    }, 900);
  };

  const copy = rating > 0 ? RATING_COPY[rating] : null;

  return (
    <>
      <div className="ne-scroll absolute inset-0 bg-[#F7F8F7] pb-[112px]">
        {/* header */}
        <div className="sticky top-0 z-30 box-border px-3 pt-[46px] pb-2.5 bg-white border-b border-[#EDEFED] flex items-center gap-2">
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
            Avaliar Compra
          </div>
          <div className="flex-none w-10" />
        </div>

        {/* product summary */}
        <div className="px-4 pt-4">
          <div className="p-3 rounded-2xl bg-white shadow-[0_2px_10px_rgba(1,36,24,.06)] flex gap-3">
            <div className="w-16 h-16 flex-none rounded-[10px] overflow-hidden bg-[#F1F3F1]">
              <ImagePlaceholder label={item?.nome ?? "Produto"} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, lineHeight: 1.25, color: "#000" }}>
                {item?.nome ?? "Produto"}
              </div>
              {item && <div className="mt-1 text-[11.5px] font-medium text-[#999999]">{item.variacao}</div>}
              {item && <div className="mt-1 text-[11.5px] font-semibold text-[#999999]">Quantidade: {item.qtd}</div>}
            </div>
          </div>
        </div>

        {/* rating */}
        <div className="px-4 pt-4">
          <div className="p-4 rounded-2xl bg-white shadow-[0_2px_10px_rgba(1,36,24,.06)]">
            <div className="text-center" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14.5, color: "#012418" }}>
              Como você avalia este produto?
            </div>
            <div className="mt-3.5 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => pickStar(n)}
                  className="cursor-pointer p-1"
                  style={{ animation: bounceStar === n ? "ne-pop .4s ease-out" : undefined }}
                >
                  <Star size={34} color={n <= rating ? "#FFB703" : "#E5E5E5"} fill={n <= rating ? "#FFB703" : "none"} strokeWidth={1.6} />
                </button>
              ))}
            </div>
            {copy && (
              <div className="mt-3 text-center text-[12.5px] font-semibold" style={{ color: copy.color, animation: "ne-fadein .2s ease-out" }}>
                {copy.text}
              </div>
            )}
          </div>
        </div>

        {/* comment */}
        <div className="px-4 pt-4">
          <div className="p-4 rounded-2xl bg-white shadow-[0_2px_10px_rgba(1,36,24,.06)]">
            <div className="mb-2" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>
              Conte mais sobre sua experiência
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder="O que você achou do produto? (mínimo 10 caracteres)"
              rows={4}
              className="ne-in w-full box-border resize-none rounded-xl p-3 outline-none"
              style={{
                border: `1px solid ${commentTooShort ? "#E63946" : "#F0F0F0"}`,
                background: "#F7F7F7",
                fontFamily: "var(--font-manrope)",
                fontSize: 13.5,
                color: "#012418",
              }}
            />
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[11px] font-medium" style={{ color: commentTooShort ? "#E63946" : "#999999" }}>
                {commentTooShort ? "Escreva pelo menos 10 caracteres" : " "}
              </span>
              <span className="text-[11px] font-medium text-[#999999]">{comment.length}/500</span>
            </div>
          </div>
        </div>

        {/* photos */}
        <div className="px-4 pt-4">
          <div className="p-4 rounded-2xl bg-white shadow-[0_2px_10px_rgba(1,36,24,.06)]">
            <div className="mb-3" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>
              Adicionar Fotos <span className="text-[#999999] font-medium">({photos.length}/5)</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {photos.map((id) => (
                <div key={id} className="relative aspect-square rounded-xl overflow-hidden bg-[#F1F3F1]" style={{ animation: "ne-pop .3s ease-out" }}>
                  <ImagePlaceholder label="foto enviada" />
                  <button
                    type="button"
                    onClick={() => removePhoto(id)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/55 text-white cursor-pointer flex items-center justify-center"
                  >
                    <X size={12} strokeWidth={2.6} />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={addPhoto}
                  className="aspect-square rounded-xl border-2 border-dashed border-[#CFD4CF] bg-[#FAFBFA] cursor-pointer flex flex-col items-center justify-center gap-1.5 hover:border-ne-green hover:bg-[#F4FBF4] transition-colors"
                >
                  <ImagePlus size={20} color="#999999" strokeWidth={1.8} />
                  <span className="text-[10.5px] font-semibold text-[#999999]">Adicionar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* recommend */}
        <div className="px-4 pt-4">
          <div className="p-4 rounded-2xl bg-white shadow-[0_2px_10px_rgba(1,36,24,.06)]">
            <div className="mb-3" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>
              Você recomenda este produto?
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRecommend("sim")}
                className="flex-1 flex items-center gap-2.5 px-3.5 py-3 rounded-xl cursor-pointer transition-colors"
                style={{ border: `1.5px solid ${recommend === "sim" ? "#00B20B" : "#E6E9E6"}`, background: recommend === "sim" ? "#EAF8EB" : "#FFFFFF" }}
              >
                <span
                  className="w-[18px] h-[18px] rounded-full flex-none flex items-center justify-center"
                  style={{ border: `2px solid ${recommend === "sim" ? "#00B20B" : "#CFD4CF"}` }}
                >
                  {recommend === "sim" && <span className="w-2.5 h-2.5 rounded-full bg-ne-green" />}
                </span>
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}>Sim</span>
              </button>
              <button
                type="button"
                onClick={() => setRecommend("nao")}
                className="flex-1 flex items-center gap-2.5 px-3.5 py-3 rounded-xl cursor-pointer transition-colors"
                style={{ border: `1.5px solid ${recommend === "nao" ? "#E63946" : "#E6E9E6"}`, background: recommend === "nao" ? "#FFF1F1" : "#FFFFFF" }}
              >
                <span
                  className="w-[18px] h-[18px] rounded-full flex-none flex items-center justify-center"
                  style={{ border: `2px solid ${recommend === "nao" ? "#E63946" : "#CFD4CF"}` }}
                >
                  {recommend === "nao" && <span className="w-2.5 h-2.5 rounded-full bg-[#E63946]" />}
                </span>
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}>Não</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* sticky footer */}
      <div className="absolute left-0 right-0 bottom-0 z-31 box-border px-4 py-3 bg-white border-t border-[#EDEFED] flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/pedidos")}
          className="flex-1 h-[50px] rounded-2xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center hover:bg-[#F5F5F5] transition-colors"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}
        >
          Meus Pedidos
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit || submitted}
          className="flex-1 h-[50px] rounded-2xl border-0 bg-ne-green text-white cursor-pointer flex items-center justify-center gap-2 hover:bg-[#00c40d] active:scale-[.98] transition-transform disabled:opacity-45 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}
        >
          {submitting && <span className="w-4 h-4 rounded-full border-[2.5px] border-white/35 border-t-white" style={{ animation: "ne-spin .7s linear infinite" }} />}
          {submitted ? "Avaliação Enviada" : submitting ? "Enviando..." : "Enviar Avaliação"}
        </button>
      </div>

      <Toast bottom={120} />
    </>
  );
}

export default function AvaliarPage() {
  return (
    <Suspense fallback={null}>
      <AvaliarContent />
    </Suspense>
  );
}
