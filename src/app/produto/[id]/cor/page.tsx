"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Search } from "lucide-react";
import { useCoresAtivas } from "@/lib/hooks";
import { corEscolhidaKey } from "@/lib/corEscolhida";
import { familiaDeCor, ORDEM_FAMILIAS } from "@/lib/familiaCor";
import type { ProdutoCor } from "@/lib/types";

export default function EscolherCorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { cores, loading } = useCoresAtivas();
  const [busca, setBusca] = useState("");
  const [familiaAtiva, setFamiliaAtiva] = useState<string | null>(null);
  const [corAtual] = useState(() => {
    try {
      return sessionStorage.getItem(corEscolhidaKey(params.id));
    } catch {
      return null;
    }
  });

  const familiasDisponiveis = useMemo(() => {
    const presentes = new Set(cores.map((c) => familiaDeCor(c.hex)));
    return ORDEM_FAMILIAS.filter((f) => presentes.has(f));
  }, [cores]);

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return cores.filter((c) => {
      const bateBusca =
        !termo ||
        c.nome.toLowerCase().includes(termo) ||
        (c.codigo ?? "").toLowerCase().includes(termo);
      const bateFamilia = !familiaAtiva || familiaDeCor(c.hex) === familiaAtiva;
      return bateBusca && bateFamilia;
    });
  }, [cores, busca, familiaAtiva]);

  const grupos = useMemo(() => {
    const porFamilia = new Map<string, ProdutoCor[]>();
    for (const c of filtradas) {
      const familia = familiaDeCor(c.hex);
      const lista = porFamilia.get(familia);
      if (lista) lista.push(c);
      else porFamilia.set(familia, [c]);
    }
    return ORDEM_FAMILIAS.filter((f) => porFamilia.has(f)).map((familia) => ({
      familia,
      cores: porFamilia.get(familia)!,
    }));
  }, [filtradas]);

  const handleEscolher = (nomeCor: string) => {
    try {
      sessionStorage.setItem(corEscolhidaKey(params.id), nomeCor);
    } catch {
      // sessionStorage indisponível — segue sem persistir, produto page mantém seleção atual
    }
    router.back();
  };

  return (
    <div className="ne-scroll absolute inset-0 bg-white">
      <div className="sticky top-0 z-30 bg-white border-b border-[#EDEFED]">
        <div className="box-border px-3 pt-[46px] pb-2.5 flex items-center gap-2">
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
            Escolha a cor
          </div>
          <div className="flex-none w-10" />
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 h-11 px-3.5 rounded-xl border border-[#E5E5E5] bg-[#F5F5F5]">
            <Search size={16} color="#999999" strokeWidth={2.2} />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou código"
              className="flex-1 bg-transparent border-0 outline-none text-[14px]"
              style={{ fontFamily: "var(--font-manrope)", color: "#012418" }}
            />
          </div>
        </div>

        <div className="ne-hs px-4 pb-3">
          <div className="flex gap-2 w-max">
            <button
              type="button"
              onClick={() => setFamiliaAtiva(null)}
              className="h-8 px-3.5 rounded-full flex-none cursor-pointer transition-colors"
              style={{
                fontFamily: "var(--font-archivo)",
                fontWeight: 700,
                fontSize: 12.5,
                border: `1.5px solid ${familiaAtiva === null ? "#012418" : "#E5E5E5"}`,
                background: familiaAtiva === null ? "#012418" : "#FFFFFF",
                color: familiaAtiva === null ? "#FFFFFF" : "#5C6A62",
              }}
            >
              Todas
            </button>
            {familiasDisponiveis.map((familia) => {
              const ativa = familiaAtiva === familia;
              return (
                <button
                  key={familia}
                  type="button"
                  onClick={() => setFamiliaAtiva(ativa ? null : familia)}
                  className="h-8 px-3.5 rounded-full flex-none cursor-pointer whitespace-nowrap transition-colors"
                  style={{
                    fontFamily: "var(--font-archivo)",
                    fontWeight: 700,
                    fontSize: 12.5,
                    border: `1.5px solid ${ativa ? "#012418" : "#E5E5E5"}`,
                    background: ativa ? "#012418" : "#FFFFFF",
                    color: ativa ? "#FFFFFF" : "#5C6A62",
                  }}
                >
                  {familia}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-8">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <span
              className="w-8 h-8 rounded-full border-[3px] border-[#E5E5E5] border-t-ne-green"
              style={{ animation: "ne-spin .8s linear infinite" }}
            />
          </div>
        ) : grupos.length === 0 ? (
          <div className="py-16 text-center text-[13.5px] font-medium text-[#999999]">
            Nenhuma cor encontrada para &quot;{busca}&quot;
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {grupos.map(({ familia, cores: coresDaFamilia }) => (
              <div key={familia} className="flex flex-col gap-3">
                {!familiaAtiva && (
                  <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>
                    {familia}
                  </div>
                )}
                <div className="grid grid-cols-4 gap-x-3 gap-y-5">
                  {coresDaFamilia.map((c) => {
                    const selecionada = c.nome === corAtual;
                    return (
                      <button
                        key={c.corId ?? c.nome}
                        type="button"
                        onClick={() => handleEscolher(c.nome)}
                        className="flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0"
                      >
                        <span
                          className="w-14 h-14 rounded-full flex-none transition-transform hover:scale-105"
                          style={{
                            background: c.hex,
                            border: selecionada ? "3px solid #00B20B" : "1.5px solid #E5E5E5",
                            boxShadow: selecionada ? "0 0 0 2px #FFFFFF inset" : "none",
                          }}
                        />
                        <span
                          className="text-center leading-tight line-clamp-2"
                          style={{ fontFamily: "var(--font-manrope)", fontWeight: 600, fontSize: 11, color: "#5C6A62" }}
                        >
                          {c.nome}
                        </span>
                        {c.codigo && (
                          <span className="text-center text-[10px] font-medium text-[#B3B3B3]">{c.codigo}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
