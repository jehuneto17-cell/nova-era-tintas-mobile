"use client";

import { useMemo } from "react";

const CONFETTI_COLORS = ["#00B20B", "#0088B7", "#FFB703", "#FFFFFF", "#38E244"];

function buildConfetti(seedStart: number) {
  let seed = seedStart;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return (seed >> 8) / 8388608;
  };
  return Array.from({ length: 52 }, (_, i) => {
    const angle = (i / 52) * Math.PI * 2 + rnd() * 0.5;
    const dist = 90 + rnd() * 130;
    const size = 7 + Math.round(rnd() * 5);
    return {
      size,
      round: rnd() > 0.55,
      color: CONFETTI_COLORS[Math.floor(rnd() * CONFETTI_COLORS.length)],
      dx: Math.round(Math.cos(angle) * dist),
      dy: Math.round(Math.sin(angle) * dist * 0.7 + 150 + rnd() * 90),
      rot: Math.round(180 + rnd() * 540),
      delay: 0.65 + rnd() * 0.25,
      dur: 1.7 + rnd() * 0.8,
    };
  });
}

export function SuccessConfetti({
  message,
  sub,
  seed = 21,
}: {
  message: string;
  sub: string;
  seed?: number;
}) {
  const confetti = useMemo(() => buildConfetti(seed), [seed]);

  return (
    <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none">
      <div
        className="ne-anim absolute -left-[6%] -right-[6%] bottom-0 h-[56%] bg-white shadow-[0_-14px_40px_rgba(1,36,24,.14)]"
        style={{ borderRadius: "50% 50% 0 0 / 78px 78px 0 0", animation: "ne-wave-up .6s cubic-bezier(.22,.9,.28,1) both" }}
      />
      <div
        className="ne-anim absolute -left-[6%] -right-[6%] bottom-[56%] h-1.5 opacity-50"
        style={{
          background: "linear-gradient(90deg,#00B20B,#0088B7)",
          borderRadius: "50% 50% 0 0 / 78px 78px 0 0",
          animation: "ne-wave-up .6s cubic-bezier(.22,.9,.28,1) both",
        }}
      />
      <div className="absolute left-0 right-0 bottom-[56%] h-0 flex items-center justify-center">
        <div className="relative w-0 h-0 flex items-center justify-center">
          <div
            className="ne-anim absolute w-[150px] h-[150px] rounded-full bg-ne-green"
            style={{ animation: "ne-ring 1.1s ease-out .5s both" }}
          />
          <div
            className="ne-anim absolute w-24 h-24 rounded-full bg-[#E7F7E8] flex items-center justify-center"
            style={{ animation: "ne-pop .5s cubic-bezier(.2,1.5,.4,1) .45s both" }}
          >
            <div className="w-[72px] h-[72px] rounded-full bg-ne-green flex items-center justify-center">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          </div>
          {confetti.map((c, i) => (
            <span
              key={i}
              className="ne-anim absolute"
              style={
                {
                  width: c.size,
                  height: c.size,
                  background: c.color,
                  borderRadius: c.round ? "50%" : 2,
                  boxShadow: c.color === "#FFFFFF" ? "0 0 0 1px rgba(1,36,24,.12)" : "none",
                  "--dx": c.dx + "px",
                  "--dy": c.dy + "px",
                  "--rot": c.rot + "deg",
                  animation: `ne-confetti ${c.dur}s cubic-bezier(.2,.7,.5,1) ${c.delay}s both`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
      <div className="absolute left-0 right-0 flex flex-col items-center gap-2 px-8" style={{ bottom: "calc(56% - 150px)" }}>
        <span
          className="ne-anim"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em", color: "#00B20B", animation: "ne-rise .4s ease-out .8s both" }}
        >
          {message}
        </span>
        <span className="ne-anim text-[13px] text-[#999999] text-center" style={{ animation: "ne-rise .4s ease-out .95s both" }}>
          {sub}
        </span>
      </div>
    </div>
  );
}
