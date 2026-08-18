"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const SEEN_KEY = "ne-splash-seen";

export function SplashGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const decided = useRef(false);

  // Decide apenas uma vez por sessão de aba se a splash deve aparecer. Guardado
  // por ref (não pelo próprio sessionStorage) porque o Strict Mode do modo dev
  // roda este efeito duas vezes; sem a ref, a 2ª chamada já veria o
  // sessionStorage marcado pela 1ª e nunca disparia a splash.
  useEffect(() => {
    if (decided.current) return;
    decided.current = true;
    if (sessionStorage.getItem(SEEN_KEY)) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    setShowSplash(true);
  }, []);

  useEffect(() => {
    if (!showSplash) return;
    const fadeOut = setTimeout(() => setOpacity(0), 1600);
    const nav = setTimeout(() => router.push("/entrada"), 2000);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(nav);
    };
  }, [showSplash, router]);

  return (
    <>
      {children}
      {showSplash && (
        <div
          className="absolute inset-0 z-50 bg-[#0d1512] transition-opacity duration-300"
          style={{ opacity, pointerEvents: opacity === 0 ? "none" : "auto" }}
        >
          <ImagePlaceholder label="Imagem de fundo (retrato)" iconSize={40} />
        </div>
      )}
    </>
  );
}
