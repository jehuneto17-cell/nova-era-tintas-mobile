"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, X } from "lucide-react";
import { useProdutos } from "@/lib/hooks";
import { precoMinimo, capaUrl } from "@/lib/produtos";
import { brl, useStore } from "@/lib/store";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export default function FavoritosPage() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useStore();
  const { produtos } = useProdutos();
  const [removing, setRemoving] = useState<Record<string, boolean>>({});

  const items = useMemo(
    () => produtos.filter((p) => favorites.includes(p.id)),
    [produtos, favorites]
  );

  const handleRemove = (id: string) => {
    setRemoving((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      toggleFavorite(id);
      setRemoving((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 190);
  };

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-30 box-border px-5 pt-[46px] pb-3.5 bg-white border-b border-[#EDEFED] flex items-center gap-2.5">
        <Heart size={20} color="#00B20B" fill="#00B20B" strokeWidth={2} />
        <div className="flex-1" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em", color: "#000" }}>
          Favoritos
        </div>
        <div className="text-[13px] font-semibold text-[#999999]">({items.length})</div>
      </div>

      <div className="ne-scroll absolute inset-0 bg-[#F7F8F7] pt-[92px] pb-[88px]">
        {items.length > 0 ? (
          <div className="px-4 pt-2 grid grid-cols-2 gap-3">
            {items.map((p) => {
              const foto = capaUrl(p);
              return (
                <div
                  key={p.id}
                  className="relative bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(1,36,24,.06)]"
                  style={{
                    animation: removing[p.id] ? "ne-fadeout .19s ease-out forwards" : "ne-in .25s ease-out",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => router.push(`/produto/${p.id}`)}
                    className="block w-full h-[120px] bg-[#F1F3F1] text-left"
                  >
                    {foto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={foto} alt={p.nome} className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlaceholder label={p.nome} />
                    )}
                  </button>

                  <div
                    className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,.14)]"
                    aria-hidden
                  >
                    <Heart size={12} color="#00B20B" fill="#00B20B" strokeWidth={2} />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(p.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white cursor-pointer flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,.14)] hover:bg-[#FFE5E5] transition-colors"
                  >
                    <X size={13} color="#E63946" strokeWidth={2.4} />
                  </button>

                  <div className="p-3">
                    <button type="button" onClick={() => router.push(`/produto/${p.id}`)} className="block text-left w-full">
                      <div
                        className="line-clamp-2"
                        style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, lineHeight: 1.3, color: "#000" }}
                      >
                        {p.nome}
                      </div>
                    </button>
                    <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15.5, letterSpacing: "-0.02em", color: "#00B20B" }} className="mt-1.5">
                      {brl(precoMinimo(p))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-8 pt-[80px] text-center">
            <div className="w-[74px] h-[74px] mx-auto mb-4 rounded-full border-2 border-dashed border-[#CFD4CF] flex items-center justify-center">
              <Heart size={30} color="#CFD4CF" strokeWidth={1.6} />
            </div>
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#012418" }}>
              Você ainda não tem favoritos
            </div>
            <div className="mt-1.5 text-[13px] font-medium leading-relaxed text-[#999999]">
              Toque no coração dos produtos que você curtir para vê-los aqui.
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
        )}
      </div>

      <Toast bottom={100} />
      <TabBar />
    </>
  );
}
