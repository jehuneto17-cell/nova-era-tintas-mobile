import {
  PaintRoller,
  Paintbrush,
  Droplet,
  Layers,
  Wrench,
  Home,
  Sparkles,
  Sun,
  Package,
  Grid,
  Tag,
  Palette,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  roller: PaintRoller,
  brush: Paintbrush,
  droplet: Droplet,
  layers: Layers,
  wrench: Wrench,
  home: Home,
  sparkles: Sparkles,
  sun: Sun,
  package: Package,
  grid: Grid,
  tag: Tag,
  palette: Palette,
};

export function categoryIcon(icone: string): LucideIcon {
  return CATEGORY_ICONS[icone] ?? Package;
}
