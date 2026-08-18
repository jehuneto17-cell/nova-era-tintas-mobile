"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useProdutos, useCategoriasAtivas } from "@/lib/hooks";

const SEEN_KEY = "ne-splash-seen";
const MIN_VISIBLE_MS = 500;
const MAX_WAIT_MS = 4000;
const FADE_MS = 300;

// Só é montado durante a janela da splash de um usuário logado, então os
// listeners do Firestore abertos por useProdutos/useCategoriasAtivas aqui
// não ficam vivos pelo resto da sessão do app — somem quando a splash some.
function HomeReadyWatcher({ startedAt, onReady }: { startedAt: React.RefObject<number>; onReady: () => void }) {
  const { loading: produtosLoading } = useProdutos();
  const { loading: categoriasLoading } = useCategoriasAtivas();

  useEffect(() => {
    if (produtosLoading || categoriasLoading) return;
    const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt.current));
    const t = setTimeout(onReady, remaining);
    return () => clearTimeout(t);
  }, [produtosLoading, categoriasLoading, startedAt, onReady]);

  return null;
}

export function SplashGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const decided = useRef(false);
  const startedAt = useRef(0);

  // Decide apenas uma vez por sessão de aba se a splash deve aparecer. Guardado
  // por ref (não pelo próprio sessionStorage) porque o Strict Mode do modo dev
  // roda este efeito duas vezes; sem a ref, a 2ª chamada já veria o
  // sessionStorage marcado pela 1ª e nunca disparia a splash.
  useEffect(() => {
    if (decided.current) return;
    decided.current = true;
    if (sessionStorage.getItem(SEEN_KEY)) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    startedAt.current = Date.now();
    setShowSplash(true);
  }, []);

  // Assim que o Firebase resolver a sessão, decide o destino direto (evita o
  // "bounce" de /entrada -> / para quem já está logado).
  useEffect(() => {
    if (!showSplash || authLoading) return;
    router.replace(user ? "/" : "/entrada");
  }, [showSplash, authLoading, user, router]);

  // Não-logado: a foto em /entrada é idêntica, então basta um tempo mínimo
  // (sem esperar dado nenhum) para não parecer um flash em conexões rápidas.
  useEffect(() => {
    if (!showSplash || authLoading || user) return;
    const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt.current));
    const t = setTimeout(() => setOpacity(0), remaining);
    return () => clearTimeout(t);
  }, [showSplash, authLoading, user]);

  // Rede de segurança: nunca prende o usuário logado na splash para sempre,
  // mesmo se o Firestore travar (a Home já tolera dados parciais).
  useEffect(() => {
    if (!showSplash || !user) return;
    const t = setTimeout(() => setOpacity(0), MAX_WAIT_MS);
    return () => clearTimeout(t);
  }, [showSplash, user]);

  // Depois do fade visual, desmonta de vez (libera pointer-events e os
  // listeners do HomeReadyWatcher).
  useEffect(() => {
    if (opacity !== 0) return;
    const t = setTimeout(() => setShowSplash(false), FADE_MS);
    return () => clearTimeout(t);
  }, [opacity]);

  return (
    <>
      {children}
      {showSplash && user && (
        <HomeReadyWatcher startedAt={startedAt} onReady={() => setOpacity(0)} />
      )}
      {showSplash && (
        <div
          className="absolute inset-0 z-50 transition-opacity duration-300"
          style={{ opacity, pointerEvents: opacity === 0 ? "none" : "auto" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F8F8F8]">
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: "url(/entrada-bg.png)", opacity: 0.97 }}
            />
          </div>
        </div>
      )}
    </>
  );
}
