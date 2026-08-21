export const ORDEM_FAMILIAS = [
  "Brancos e neutros",
  "Cinzas",
  "Pretos",
  "Vermelhos",
  "Laranjas",
  "Amarelos",
  "Verdes",
  "Azuis",
  "Roxos",
  "Rosas",
  "Marrons",
] as const;

function hexParaHsl(hex: string): { h: number; s: number; l: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      break;
    case g:
      h = ((b - r) / d + 2) * 60;
      break;
    default:
      h = ((r - g) / d + 4) * 60;
  }
  return { h, s, l };
}

/** Deriva uma família de cor legível a partir do hex, usada para agrupar a paleta na tela de seleção. */
export function familiaDeCor(hex: string): (typeof ORDEM_FAMILIAS)[number] {
  const hsl = hexParaHsl(hex);
  if (!hsl) return "Cinzas";
  const { h, s, l } = hsl;

  if (l > 0.92) return "Brancos e neutros";
  if (l < 0.12) return "Pretos";
  if (s < 0.15) return "Cinzas";

  // Marrons: tons de laranja/vermelho com baixa luminosidade e saturação moderada
  if (h >= 15 && h < 50 && l < 0.45 && s < 0.6) return "Marrons";

  if (h < 15 || h >= 345) return "Vermelhos";
  if (h < 45) return "Laranjas";
  if (h < 70) return "Amarelos";
  if (h < 170) return "Verdes";
  if (h < 255) return "Azuis";
  if (h < 300) return "Roxos";
  return "Rosas";
}
