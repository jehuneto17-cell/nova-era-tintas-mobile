"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function BackHeader({
  title,
  right,
  onBack,
  titleColor = "#000000",
  hoverColor = "#00B20B",
}: {
  title: string;
  right?: ReactNode;
  onBack?: () => void;
  titleColor?: string;
  hoverColor?: string;
}) {
  const router = useRouter();
  return (
    <div className="absolute top-0 left-0 right-0 z-30 box-border px-3 pt-[46px] pb-2.5 bg-white border-b border-[#EDEFED] flex items-center gap-2">
      <button
        type="button"
        onClick={onBack ?? (() => router.back())}
        className="group flex-none w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center transition-colors"
        style={{ ["--hover" as string]: hoverColor }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#F5F5F5";
          (e.currentTarget as HTMLElement).style.borderColor = hoverColor;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
          (e.currentTarget as HTMLElement).style.borderColor = "#E5E5E5";
        }}
      >
        <ChevronLeft size={18} color="#012418" strokeWidth={2.4} />
      </button>
      <div
        className="flex-1 min-w-0 text-center overflow-hidden text-ellipsis whitespace-nowrap"
        style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: titleColor }}
      >
        {title}
      </div>
      <div className="flex-none w-10 flex items-center justify-center">{right}</div>
    </div>
  );
}
