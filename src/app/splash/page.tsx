"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export default function SplashPage() {
  const router = useRouter();
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const fadeOut = setTimeout(() => setOpacity(0), 2500);
    const nav = setTimeout(() => router.push("/entrada"), 2900);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(nav);
    };
  }, [router]);

  return (
    <div className="absolute inset-0 bg-[#0d1512] transition-opacity duration-300" style={{ opacity }}>
      <ImagePlaceholder label="Imagem de fundo (retrato)" iconSize={40} />
    </div>
  );
}
