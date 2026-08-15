import { ImageIcon } from "lucide-react";

const shapeClass = {
  rect: "rounded-none",
  rounded: "rounded-xl",
  circle: "rounded-full",
  pill: "rounded-full",
} as const;

export function ImagePlaceholder({
  label,
  shape = "rect",
  className = "",
  iconSize = 22,
}: {
  label?: string;
  shape?: keyof typeof shapeClass;
  className?: string;
  iconSize?: number;
}) {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center gap-1.5 bg-[#F1F3F1] text-[#C4CCC7] ${shapeClass[shape]} ${className}`}
      title={label}
    >
      <ImageIcon size={iconSize} strokeWidth={1.6} />
    </div>
  );
}
