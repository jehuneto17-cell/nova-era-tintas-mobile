"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Camera, Images, Check } from "lucide-react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Toast } from "@/components/Toast";
import { useApp } from "@/lib/store";

const CHECKLIST = ["Valor do pedido visível", "Data da transação visível", "Código do PIX visível"];

export default function EnviarComprovantePage() {
  const router = useRouter();
  const { flash } = useApp();
  const [hasImage, setHasImage] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success">("idle");
  const [progress, setProgress] = useState(0);

  const numero = "Ped001";
  const total = "R$ 150,00";
  const data = "05 ago, 14:30";

  const pickImage = (via: "camera" | "galeria") => {
    setHasImage(true);
    setMenuOpen(false);
    setStatus("idle");
    flash(via === "camera" ? "Câmera aberta — comprovante adicionado" : "Galeria aberta — comprovante adicionado");
  };

  const submit = () => {
    if (!hasImage || status === "uploading") return;
    setStatus("uploading");
    setProgress(0);
    const iv = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 14);
        if (next >= 100) clearInterval(iv);
        return next;
      });
    }, 140);
    setTimeout(() => {
      setStatus("success");
      flash("Comprovante enviado com sucesso");
      setTimeout(() => router.push("/comprovante/aguardando"), 900);
    }, 1200);
  };

  const uploading = status === "uploading";
  const succeeded = status === "success";
  const disabled = !hasImage || uploading;

  return (
    <div className="absolute inset-0 bg-[#F8F8F8]">
      <div className="absolute top-0 left-0 right-0 z-30 box-border px-3 pt-[46px] pb-2.5 bg-white border-b border-[#EDEFED] flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-none w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center hover:bg-[#F5F5F5] hover:border-ne-green transition-colors"
        >
          <ChevronLeft size={18} color="#012418" strokeWidth={2.4} />
        </button>
        <div className="flex-1 text-center whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 19, letterSpacing: "-0.01em", color: "#012418" }}>
          Enviar Comprovante
        </div>
        <div className="flex-none w-10" />
      </div>

      <div className="ne-scroll absolute inset-x-0 top-[96px] bottom-[96px]">
        <div className="p-4 flex flex-col gap-2">
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-3 shadow-[0_1px_8px_rgba(0,0,0,.05)] flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="whitespace-nowrap text-sm font-semibold text-[#012418]" style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace" }}>
                #{numero}
              </span>
              <span className="whitespace-nowrap text-xs text-[#999999]">{data}</span>
            </div>
            <span className="whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15, color: "#012418" }}>{total}</span>
          </div>

          <div className="mt-2 bg-[#F0F4FF] border-l-4 border-[#0088B7] rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0088B7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418" }}>Como enviar?</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#012418]">1. Tire uma foto do comprovante do PIX</span>
              <span className="text-xs text-[#012418]">2. Certifique-se que apareçam: Valor, Data e Código</span>
              <span className="text-xs text-[#012418]">3. Envie a imagem abaixo</span>
            </div>
          </div>

          <div className="mt-4" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>
            Selecionar Imagem
          </div>

          {!hasImage && (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="w-full box-border border-2 border-dashed border-[#E5E5E5] rounded-xl bg-[#F8F8F8] py-8 px-5 flex flex-col items-center gap-2 cursor-pointer hover:bg-[#F0F0F0] hover:border-[#0088B7] transition-colors"
            >
              <Camera size={40} color="#CCCCCC" strokeWidth={1.6} />
              <span className="text-center leading-snug" style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 14, color: "#012418" }}>
                Toque para selecionar comprovante
              </span>
              <span className="text-xs text-[#999999]">Câmera ou galeria</span>
              <span className="text-[11px] text-[#C4CCC7]">Máximo 5MB, formato JPG/PNG</span>
            </button>
          )}

          {hasImage && !uploading && (
            <div style={{ animation: "ne-fadein .2s ease-out" }}>
              <div className="relative w-[200px] h-[200px] mx-auto rounded-xl overflow-hidden bg-[#F1F3F1]">
                <ImagePlaceholder label="Comprovante PIX" shape="rounded" />
                <button
                  type="button"
                  onClick={() => setHasImage(false)}
                  className="absolute top-2 right-2 w-7 h-7 border-0 rounded-full bg-[#012418]/75 text-white cursor-pointer flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="text-center text-xs text-[#999999] mt-2">Imagem selecionada</div>
              <div className="mt-4 flex flex-col gap-2">
                {CHECKLIST.map((label) => (
                  <div key={label} className="flex items-center gap-2">
                    <Check size={16} color="#00B20B" strokeWidth={2.4} />
                    <span className="text-xs text-[#012418]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploading && (
            <div className="mt-4 flex flex-col gap-1.5">
              <span className="text-xs text-[#012418]">Enviando...</span>
              <div className="w-full h-1 rounded-full bg-[#F5F5F5] overflow-hidden">
                <div className="h-full bg-[#0088B7] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-[11px] text-[#999999] text-right">{progress}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 z-28 box-border px-4 pt-3.5 pb-[18px] bg-white border-t border-[#EDEFED]">
        <button
          type="button"
          onClick={submit}
          disabled={disabled}
          className="w-full h-12 border-0 rounded-xl text-white flex items-center justify-center gap-2 transition-colors"
          style={{
            background: succeeded ? "#00941F" : "#00B20B",
            fontFamily: "var(--font-archivo)",
            fontWeight: 700,
            fontSize: 15,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: !hasImage ? 0.5 : 1,
          }}
        >
          {uploading && <span className="w-[15px] h-[15px] rounded-full border-2 border-white/40 border-t-white" style={{ animation: "ne-spin .7s linear infinite" }} />}
          {!uploading && <Check size={17} strokeWidth={2.4} style={succeeded ? { animation: "ne-pop .2s ease-out" } : undefined} />}
          <span>{succeeded ? "Enviado com Sucesso!" : uploading ? "Enviando..." : "Enviar Comprovante"}</span>
        </button>
      </div>

      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} className="absolute inset-0 z-44 bg-[#012418]/45" style={{ animation: "ne-veil .2s ease-out" }} />
          <div
            className="absolute left-0 right-0 bottom-0 z-45 box-border px-3 pt-2.5 pb-[18px] bg-white rounded-t-[20px] shadow-[0_-12px_40px_rgba(0,0,0,.25)]"
            style={{ animation: "ne-sheet .2s ease-out" }}
          >
            <div className="w-[38px] h-1 rounded bg-[#E5E5E5] mx-auto mt-0.5 mb-3" />
            <div className="border border-[#E5E5E5] rounded-2xl overflow-hidden flex flex-col">
              <button
                type="button"
                onClick={() => pickImage("camera")}
                className="h-12 border-0 border-b border-[#E5E5E5] bg-white text-[#012418] cursor-pointer flex items-center gap-3 px-4 hover:bg-[#F5F5F5] transition-colors"
                style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 15 }}
              >
                <Camera size={19} />
                <span>Tirar Foto</span>
              </button>
              <button
                type="button"
                onClick={() => pickImage("galeria")}
                className="h-12 border-0 bg-white text-[#012418] cursor-pointer flex items-center gap-3 px-4 hover:bg-[#F5F5F5] transition-colors"
                style={{ fontFamily: "var(--font-archivo)", fontWeight: 600, fontSize: 15 }}
              >
                <Images size={19} />
                <span>Escolher da Galeria</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="mt-2 w-full h-12 border border-[#E5E5E5] rounded-2xl bg-[#F5F5F5] text-[#012418] cursor-pointer hover:bg-[#EDEFED] transition-colors"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15 }}
            >
              Cancelar
            </button>
          </div>
        </>
      )}

      <Toast bottom={110} />
    </div>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
