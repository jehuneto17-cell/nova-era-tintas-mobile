"use client";

import { useToast } from "@/lib/toast";

export function Toast({ bottom = 100 }: { bottom?: number }) {
  const { toast } = useToast();
  if (!toast) return null;
  return (
    <div
      key={toast.id}
      className="absolute left-1/2 z-40 whitespace-nowrap rounded-2xl px-[18px] py-[11px] text-white"
      style={{
        bottom,
        background: "#012418",
        fontFamily: "var(--font-archivo)",
        fontWeight: 600,
        fontSize: 13,
        boxShadow: "0 10px 30px rgba(0,0,0,.28)",
        animation: "ne-toast 2.2s ease-out forwards",
      }}
    >
      {toast.message}
    </div>
  );
}
