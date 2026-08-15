"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Check, User, Package, Settings, FileText, ChevronRight } from "lucide-react";
import { useApp } from "@/lib/store";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const MENU = [
  { id: "perfil", icon: User, label: "Meu Perfil" },
  { id: "pedidos", icon: Package, label: "Meus Pedidos" },
  { id: "config", icon: Settings, label: "Configurações" },
  { id: "termos", icon: FileText, label: "Termos & Privacidade" },
] as const;

export default function PerfilPage() {
  const router = useRouter();
  const { flash } = useApp();
  const [showLogout, setShowLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const onMenuClick = (id: string) => {
    if (id === "pedidos") {
      router.push("/pedidos");
      return;
    }
    if (id === "perfil") {
      flash("Você já está no seu perfil");
      return;
    }
    if (id === "config") {
      flash("Configurações em breve");
      return;
    }
    flash("Termos & Privacidade em breve");
  };

  const goDelayed = (path: string) => {
    setTimeout(() => router.push(path), 800);
  };

  const openLogout = () => {
    setTimeout(() => setShowLogout(true), 800);
  };

  const confirmLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      setLoggingOut(false);
      setShowLogout(false);
      flash("Você saiu da sua conta");
      router.push("/entrada");
    }, 1000);
  };

  return (
    <>
      <div className="ne-scroll absolute inset-0 bg-[#F7F8F7] pb-[88px]">
        {/* hero */}
        <div
          className="relative"
          style={{
            height: 210,
            background: "#00B20B",
            borderRadius: "0 0 50% 50% / 0 0 46px 46px",
          }}
        >
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[46px]">
            <button
              type="button"
              onClick={() => flash("Menu em breve")}
              className="w-10 h-10 rounded-xl bg-white/15 cursor-pointer flex items-center justify-center hover:bg-white/25 transition-colors"
            >
              <Menu size={19} color="#FFFFFF" strokeWidth={2.2} />
            </button>
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 17, color: "#FFFFFF" }}>Meu Perfil</div>
            <button
              type="button"
              onClick={() => router.push("/perfil/editar")}
              className="px-3 py-1.5 rounded-full bg-white/15 cursor-pointer hover:bg-white/25 transition-colors"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12.5, color: "#FFFFFF" }}
            >
              Editar
            </button>
          </div>
        </div>

        {/* avatar overlap */}
        <div className="relative -mt-[76px] flex flex-col items-center px-4">
          <div className="relative">
            <div
              className="w-[140px] h-[140px] rounded-full overflow-hidden bg-[#F1F3F1] box-content"
              style={{ border: "5px solid #FFFFFF", boxShadow: "0 8px 24px rgba(1,36,24,.18)" }}
            >
              <ImagePlaceholder shape="circle" label="Foto de perfil" iconSize={32} />
            </div>
            <div
              className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-ne-green border-[3px] border-white flex items-center justify-center"
              style={{ boxShadow: "0 2px 6px rgba(0,0,0,.2)" }}
            >
              <Check size={13} color="#FFFFFF" strokeWidth={3} />
            </div>
          </div>
          <div className="mt-3.5 text-center" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 19, letterSpacing: "-0.01em", color: "#012418" }}>
            João Silva
          </div>
          <div className="mt-1 text-[13px] font-medium text-[#999999]">joao@novaeratintas.com</div>
        </div>

        {/* menu list */}
        <div className="px-4 pt-6 flex flex-col gap-2.5">
          {MENU.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onMenuClick(m.id)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#F4F6F4] cursor-pointer hover:bg-[#E9EDE9] transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-white flex-none flex items-center justify-center">
                  <Icon size={17} color="#012418" strokeWidth={2} />
                </div>
                <span className="flex-1 min-w-0" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>
                  {m.label}
                </span>
                <ChevronRight size={17} color="#999999" strokeWidth={2.2} />
              </button>
            );
          })}
        </div>

        {/* flow buttons */}
        <div className="px-4 pt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => goDelayed("/perfil/editar")}
            className="flowbtn flowbtn-green h-12 rounded-2xl bg-white"
          >
            <span className="flowbtn-arrow left" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
            <span className="flowbtn-circle" aria-hidden="true" />
            <span className="flowbtn-text">Editar Perfil</span>
            <span className="flowbtn-arrow right" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </button>

          <button
            type="button"
            onClick={() => goDelayed("/pedidos")}
            className="flowbtn flowbtn-blue h-12 rounded-2xl bg-white"
          >
            <span className="flowbtn-arrow left" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
            <span className="flowbtn-circle" aria-hidden="true" />
            <span className="flowbtn-text">Meus Pedidos</span>
            <span className="flowbtn-arrow right" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </button>

          <button
            type="button"
            onClick={openLogout}
            className="flowbtn flowbtn-red h-12 rounded-2xl bg-white"
          >
            <span className="flowbtn-arrow left" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
            <span className="flowbtn-circle" aria-hidden="true" />
            <span className="flowbtn-text">Sair</span>
            <span className="flowbtn-arrow right" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </button>
        </div>

        <div className="pt-6 pb-4 text-center text-[11.5px] font-medium text-[#999999]">Versão do app: 1.0.0</div>
      </div>

      {/* logout modal */}
      {showLogout && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 px-8"
          style={{ animation: "ne-veil .2s ease-out" }}
          onClick={() => !loggingOut && setShowLogout(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[300px] rounded-2xl bg-white p-5"
            style={{ animation: "ne-pop .25s ease-out", boxShadow: "0 20px 50px rgba(0,0,0,.3)" }}
          >
            <div className="text-center" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, color: "#012418" }}>
              Tem certeza que quer sair?
            </div>
            <div className="mt-1.5 text-center text-[12.5px] font-medium text-[#999999]">Você precisará entrar novamente para acessar sua conta.</div>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogout(false)}
                disabled={loggingOut}
                className="flex-1 h-11 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer hover:bg-[#F5F5F5] transition-colors disabled:opacity-50"
                style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                disabled={loggingOut}
                className="flex-1 h-11 rounded-xl border-0 bg-[#E63946] text-white cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
                style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}
              >
                {loggingOut && <span className="w-3.5 h-3.5 rounded-full border-2 border-white/35 border-t-white" style={{ animation: "ne-spin .7s linear infinite" }} />}
                {loggingOut ? "Saindo..." : "Sair"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast bottom={100} />
      <TabBar />
    </>
  );
}
