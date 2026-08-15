export function StatusBar({ dark = false }: { dark?: boolean }) {
  const color = dark ? "#FFFFFF" : "#000000";
  return (
    <div
      className="absolute top-0 left-0 right-0 z-32 h-[46px] flex items-end justify-between px-6.5 pb-1.5 pointer-events-none"
      style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color }}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-0.5">
          <div className="w-[3px] h-[5px] rounded-[1px]" style={{ background: "currentColor" }} />
          <div className="w-[3px] h-[7px] rounded-[1px]" style={{ background: "currentColor" }} />
          <div className="w-[3px] h-[9px] rounded-[1px]" style={{ background: "currentColor" }} />
          <div className="w-[3px] h-[11px] rounded-[1px] opacity-40" style={{ background: "currentColor" }} />
        </div>
        <div
          className="w-[22px] h-[11px] rounded-[3px] box-border p-[1.5px]"
          style={{ border: `1.5px solid ${color}`, opacity: 0.7 }}
        >
          <div className="w-[72%] h-full rounded-[1.5px]" style={{ background: "currentColor" }} />
        </div>
      </div>
    </div>
  );
}
