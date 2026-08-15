export type Product = {
  id: string;
  cat: "tintas" | "pinceis" | "rolos" | "acabamentos" | "primers" | "seladores" | "acessorios";
  name: string;
  desc: string;
  price: number;
  unit: string;
  ph: string;
  brand?: string;
  rating?: number;
  sold?: number;
  stock?: boolean;
};

export const PRODUCTS: Product[] = [
  { id: "p1", cat: "tintas", name: "Tinta Acrílica Premium Branco Neve", desc: "Acabamento fosco, alta cobertura. Rende até 350 m² por lata.", price: 289.9, unit: "Lata 18 L · Interior e exterior", ph: "lata de tinta 18L", brand: "Suvinil", rating: 4.8, sold: 320, stock: true },
  { id: "p2", cat: "tintas", name: "Esmalte Sintético Brilhante", desc: "Para madeira e metal. Secagem rápida e alta resistência.", price: 54.9, unit: "Lata 900 ml · 12 cores", ph: "lata de esmalte 900ml", brand: "Coral", rating: 4.6, sold: 240, stock: true },
  { id: "p3", cat: "rolos", name: 'Rolo de Lã Antigota 23 cm', desc: "Cabo ergonômico. Ideal para paredes lisas e tinta acrílica.", price: 32.5, unit: "Com suporte incluso", ph: "rolo de pintura", brand: "Metalatex", rating: 4.5, sold: 410, stock: true },
  { id: "p4", cat: "pinceis", name: 'Pincel Cerda Natural 2"', desc: "Cabo de madeira envernizado. Ideal para esmalte e verniz.", price: 18.9, unit: 'Também em 1" e 3"', ph: "pincel de pintura", brand: "Suvinil", rating: 4.4, sold: 190, stock: true },
  { id: "p5", cat: "tintas", name: "Tinta Acrílica Fosca Verde Jade", desc: "Cor sob encomenda na máquina de tintas da loja.", price: 214.9, unit: "Lata 18 L · Cor personalizada", ph: "tinta colorida", brand: "Suvinil", rating: 4.9, sold: 95, stock: true },
  { id: "p6", cat: "acabamentos", name: "Massa Corrida PVA", desc: "Corrige imperfeições e nivela a parede antes da pintura.", price: 89.9, unit: "Balde 18 L · Uso interno", ph: "balde de massa corrida", brand: "Coral", rating: 4.2, sold: 95, stock: false },
  { id: "p7", cat: "acabamentos", name: "Textura Acrílica Rústica", desc: "Efeito decorativo para fachadas. Protege contra chuva e sol.", price: 129.9, unit: "Saco 25 kg · Externa", ph: "textura acrílica", brand: "Metalatex", rating: 4.6, sold: 160, stock: true },
  { id: "p8", cat: "pinceis", name: 'Trincha Dupla 4"', desc: "Cerdas macias para grandes superfícies e caiação.", price: 26.9, unit: "Cabo longo de madeira", ph: "trincha de pintura", brand: "Coral", rating: 4.3, sold: 130, stock: true },
  { id: "p9", cat: "rolos", name: "Rolo Espuma Epóxi 15 cm", desc: "Acabamento liso para esmalte, epóxi e piso.", price: 21.9, unit: "Kit com 2 refis", ph: "rolo de espuma", brand: "Metalatex", rating: 4.1, sold: 610, stock: true },
  { id: "p10", cat: "acabamentos", name: "Fita Crepe Premium 48 mm", desc: "Remove sem deixar resíduo. Recorte perfeito em cantos.", price: 12.9, unit: "Rolo 50 m", ph: "fita crepe", brand: "Suvinil", rating: 4.0, sold: 610, stock: true },
];

export const CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "tintas", label: "Tintas", count: 142, desc: "Acrílicas, Látex, Premium", ph: "foto de latas de tinta colorida" },
  { id: "pinceis", label: "Pincéis", count: 87, desc: "Sintéticos, Nylon, Profissionais", ph: "foto de pincéis profissionais" },
  { id: "rolos", label: "Rolos", count: 56, desc: "Lã, Poliamida, Especializados", ph: "foto de rolo de pintura" },
  { id: "primers", label: "Primers", count: 34, desc: "Branco, Colorido, Especiais", ph: "foto de galão de primer" },
  { id: "seladores", label: "Seladores", count: 28, desc: "Poliuretano, Vernizes, Protetores", ph: "foto de selador ou verniz" },
  { id: "acessorios", label: "Acessórios", count: 73, desc: "Extensores, Tesouras, Fitas", ph: "foto de acessórios de pintura" },
] as const;

export const brl = (n: number) => "R$ " + n.toFixed(2).replace(".", ",");

export type OrderStatus =
  | "em_negociacao"
  | "aguardando_pagamento"
  | "aguardando_confirmacao"
  | "pago"
  | "separacao"
  | "enviado"
  | "entregue"
  | "cancelado";

export type Order = {
  id: string;
  numero: string;
  data: string;
  ts: number;
  loja: string;
  total: number;
  items: number;
  status: OrderStatus;
};

export const ORDERS: Order[] = [
  { id: "ped001", numero: "Ped001", data: "05 ago", ts: 20260805, loja: "Nova Era Tintas", total: 150.0, items: 2, status: "pago" },
  { id: "ped002", numero: "Ped002", data: "03 ago", ts: 20260803, loja: "Nova Era Tintas", total: 89.9, items: 1, status: "enviado" },
  { id: "ped003", numero: "Ped003", data: "01 ago", ts: 20260801, loja: "Nova Era Tintas", total: 320.0, items: 4, status: "em_negociacao" },
  { id: "ped004", numero: "Ped004", data: "31 jul", ts: 20260731, loja: "Nova Era Tintas", total: 250.0, items: 3, status: "aguardando_pagamento" },
  { id: "ped005", numero: "Ped005", data: "27 jul", ts: 20260727, loja: "Nova Era Tintas", total: 134.2, items: 2, status: "separacao" },
  { id: "ped006", numero: "Ped006", data: "24 jul", ts: 20260724, loja: "Nova Era Tintas", total: 64.5, items: 2, status: "entregue" },
  { id: "ped007", numero: "Ped007", data: "18 jul", ts: 20260718, loja: "Nova Era Tintas", total: 412.8, items: 5, status: "entregue" },
];

export const STATUS_META: Record<OrderStatus, { label: string; bg: string; fg: string }> = {
  em_negociacao: { label: "Em Negociação", bg: "#FFB703", fg: "#012418" },
  aguardando_pagamento: { label: "A Pagar", bg: "#0088B7", fg: "#FFFFFF" },
  aguardando_confirmacao: { label: "Confirmando", bg: "#FF9500", fg: "#FFFFFF" },
  pago: { label: "Pago", bg: "#00B20B", fg: "#FFFFFF" },
  separacao: { label: "Preparando", bg: "#00C9FF", fg: "#012418" },
  enviado: { label: "Enviado", bg: "#00D97E", fg: "#012418" },
  entregue: { label: "Entregue", bg: "#999999", fg: "#FFFFFF" },
  cancelado: { label: "Cancelado", bg: "#E63946", fg: "#FFFFFF" },
};
