"use client";

import { useRouter } from "next/navigation";
import { Droplet, Paintbrush, PaintRoller, Package, ShieldCheck, Scissors, type LucideIcon } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { BackHeader } from "@/components/BackHeader";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Toast } from "@/components/Toast";
import { TabBar } from "@/components/TabBar";

const ICONS: Record<string, LucideIcon> = {
  tintas: Droplet,
  pinceis: Paintbrush,
  rolos: PaintRoller,
  primers: Package,
  seladores: ShieldCheck,
  acessorios: Scissors,
};

const cards = CATEGORIES.filter((c) => c.id !== "todos");

export default function CategoriasPage() {
  const router = useRouter();

  return (
    <>
      <BackHeader title="Categorias" />

      <div className="ne-scroll absolute inset-x-0 top-[96px] bottom-[72px] bg-[#F7F8F7]">
        <div className="flex flex-col gap-3 px-4 py-4">
          {cards.map((c, i) => {
            const Icon = ICONS[c.id] ?? Package;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => router.push(`/produtos/${c.id}`)}
                className="relative w-full h-[180px] rounded-2xl overflow-hidden text-left cursor-pointer group"
                style={{ animation: `ne-rise .35s ease-out ${i * 0.05}s both` }}
              >
                <div className="absolute inset-0">
                  <ImagePlaceholder label={c.ph} />
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
                      <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 18, color: "#FFFFFF" }}>{c.label}</div>
                      <div className="mt-1 text-[12.5px] font-medium text-white/75 leading-snug">{c.desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-white/70">{c.count} itens</span>
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
