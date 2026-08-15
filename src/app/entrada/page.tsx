"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { Toast } from "@/components/Toast";

export default function EntradaPage() {
  const router = useRouter();
  const { flash } = useApp();

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F8F8F8] flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: "url(/entrada-bg.png)", opacity: 0.97 }}
      />

      <div className="relative z-10 flex-1" />

      <div className="relative z-10 box-border px-4 pt-4 pb-2 flex flex-col gap-3" style={{ animation: "ne-fadeup .35s ease-out .3s both" }}>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/cadastro")}
            className="flex-1 h-12 border-0 rounded-xl bg-ne-green text-white cursor-pointer hover:bg-[#00941F] active:scale-[.98] transition-all"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15 }}
          >
            Criar Conta
          </button>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="flex-1 h-12 border-2 border-ne-green rounded-xl bg-white text-ne-green cursor-pointer hover:bg-[#F0F8F5] active:scale-[.98] transition-all"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15 }}
          >
            Entrar
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            flash("Entrando como convidado");
            setTimeout(() => router.push("/"), 900);
          }}
          className="border-0 bg-transparent py-0.5 text-xs text-ne-blue underline cursor-pointer"
        >
          Continuar como convidado
        </button>

        <div className="text-[10px] text-[#999999] leading-tight text-center px-3 pb-3.5">
          Ao continuar, você concorda com nossos{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Política de Privacidade
          </a>
        </div>
      </div>

      <div className="relative z-10">
        <Toast bottom={96} />
      </div>
    </div>
  );
}
