"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const SEEN_KEY = "ne-splash-seen";

export function SplashGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    setShowSplash(true);
    const fadeOut = setTimeout(() => setOpacity(0), 1600);
    const nav = setTimeout(() => router.push("/entrada"), 2000);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(nav);
    };
  }, [router]);

  return (
    <>
      {children}
      {showSplash && (
        <div className="absolute inset-0 z-50 bg-[#0d1512] transition-opacity duration-300" style={{ opacity }}>
          <ImagePlaceholder label="Imagem de fundo (retrato)" iconSize={40} />
        </div>
      )}
    </>
  );
}
