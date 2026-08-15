"use client";

import { useRouter } from "next/navigation";
import { PhoneStatusBarStatic } from "@/components/PhoneStatusBarStatic";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { useApp } from "@/lib/store";
import { Toast } from "@/components/Toast";

export default function EntradaPage() {
  const router = useRouter();
  const { flash } = useApp();

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F8F8F8] flex flex-col">
      <PhoneStatusBarStatic />

      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-20 text-center">
        <div
          className="w-24 h-24 rounded-[22px] overflow-hidden bg-[#F1F3F1] shadow-[0_12px_30px_rgba(0,0,0,.12)] mb-7"
          style={{ animation: "ne-fadedown .4s ease-out" }}
        >
          <ImagePlaceholder label="Logo da Loja" />
        </div>

        <div
          style={{
            fontFamily: "var(--font-archivo)",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: "-0.02em",
            color: "#012418",
            marginBottom: 12,
            animation: "ne-fadeup .35s ease-out .1s both",
          }}
        >
          Nova Era Tintas
        </div>
        <div style={{ fontSize: 16, color: "#999999", lineHeight: 1.5, marginBottom: 20, animation: "ne-fadeup .35s ease-out .18s both" }}>
          Tudo para pintar, do seu jeito!
        </div>
        <div style={{ fontSize: 14, color: "#999999", lineHeight: 1.6, maxWidth: 280, animation: "ne-fadeup .35s ease-out .24s both" }}>
          Tintas de qualidade, pincéis premium, rolos, primers e muito mais. Tudo que você precisa para seus projetos de pintura.
        </div>
      </div>

      <div className="box-border px-4 pt-4 pb-2 flex flex-col gap-3" style={{ animation: "ne-fadeup .35s ease-out .3s both" }}>
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

      <Toast bottom={96} />
    </div>
  );
}
