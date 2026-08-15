"use client";

import { useRouter } from "next/navigation";
import { useCategoriasAtivas } from "@/lib/hooks";
import { categoryIcon } from "@/lib/icons";
import { BackHeader } from "@/components/BackHeader";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Toast } from "@/components/Toast";
import { TabBar } from "@/components/TabBar";

export default function CategoriasPage() {
  const router = useRouter();
  const { categorias, loading } = useCategoriasAtivas();

  return (
    <>
      <BackHeader title="Categorias" />

      <div className="ne-scroll absolute inset-x-0 top-[96px] bottom-[72px] bg-[#F7F8F7]">
        <div className="flex flex-col gap-3 px-4 py-4">
          {!loading && categorias.length === 0 && (
            <div className="pt-16 text-center">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15, color: "#012418" }}>
                Nenhuma categoria disponível
              </div>
            </div>
          )}
          {categorias.map((c, i) => {
            const Icon = categoryIcon(c.icone);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => router.push(`/produtos/${c.id}`)}
                className="relative w-full h-[180px] rounded-2xl overflow-hidden text-left cursor-pointer group"
                style={{ animation: `ne-rise .35s ease-out ${i * 0.05}s both` }}
              >
                <div className="absolute inset-0" style={{ background: c.fundo }}>
                  {c.fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.fotoUrl} alt={c.nome} className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlaceholder label={c.nome} />
                  )}
                </div>
                <div
                  className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-90"
                  style={{ background: "linear-gradient(90deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.5) 45%, rgba(0,0,0,.18) 100%)" }}
                />
                <div className="absolute inset-0 flex flex-col justify-between p-5">
                  <div className="flex flex-col items-start gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <Icon size={20} color="#38E244" strokeWidth={2.2} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 18, color: "#FFFFFF" }}>{c.nome}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-white/70">{c.qtdProdutos} itens</span>
                    <span
                      className="border border-white/60 text-white rounded-full px-3.5 py-1.5 transition-colors group-hover:bg-white group-hover:text-[#012418]"
                      style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12 }}
                    >
                      Ver Categoria
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Toast bottom={96} />
      <TabBar />
    </>
  );
}
