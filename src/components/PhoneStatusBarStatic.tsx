export function PhoneStatusBarStatic() {
  return (
    <div className="absolute top-0 left-0 right-0 z-32 h-[46px] flex items-end justify-between px-6.5 pb-1.5 pointer-events-none">
      <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#000" }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-2.5 rounded-[3px] border-[1.5px] border-black" />
        <div className="relative w-[22px] h-2.5 rounded-[3px] border-[1.5px] border-black">
          <div className="absolute inset-[1.5px] right-1.5 bg-black rounded-[1px]" />
        </div>
      </div>
    </div>
  );
}
