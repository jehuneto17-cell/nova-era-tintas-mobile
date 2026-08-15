import type { Pedido, PedidoEstado } from "./types";

export const STATUS_META: Record<PedidoEstado, { label: string; bg: string; fg: string }> = {
  em_negociacao: { label: "Em Negociação", bg: "#FFB703", fg: "#012418" },
  aguardando_pagamento: { label: "A Pagar", bg: "#0088B7", fg: "#FFFFFF" },
  aguardando_confirmacao: { label: "Confirmando", bg: "#FF9500", fg: "#FFFFFF" },
  pago: { label: "Pago", bg: "#00B20B", fg: "#FFFFFF" },
  separacao: { label: "Preparando", bg: "#00C9FF", fg: "#012418" },
  enviado: { label: "Enviado", bg: "#00D97E", fg: "#012418" },
  entregue: { label: "Entregue", bg: "#999999", fg: "#FFFFFF" },
  cancelado: { label: "Cancelado", bg: "#E63946", fg: "#FFFFFF" },
  expirado: { label: "Expirado", bg: "#999999", fg: "#FFFFFF" },
};

export function pedidoTotal(pedido: Pedido): number {
  return pedido.itens.reduce((s, i) => s + i.preco * i.qtd, 0) + pedido.frete;
}

export function pedidoSubtotal(pedido: Pedido): number {
  return pedido.itens.reduce((s, i) => s + i.preco * i.qtd, 0);
}
