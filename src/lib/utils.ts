import type { HorarioDia } from "./types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type StatusLoja = "aberta" | "fechada_hoje" | "fechada_ate_amanha";

/**
 * `horarios_semana` é um array posicional de 7 dias (0=Segunda...6=Domingo),
 * formato gravado pelo painel admin em `configuracoes/loja`.
 */
export function statusLoja(
  horariosSemana: HorarioDia[] | undefined,
  agora: Date = new Date()
): StatusLoja {
  if (!horariosSemana || horariosSemana.length !== 7) return "aberta";

  const diaAtual = (agora.getDay() + 6) % 7; // getDay(): 0=Dom -> índice 0=Seg
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
  const hoje = horariosSemana[diaAtual];

  if (hoje?.aberto) {
    const [hIni, mIni] = hoje.inicio.split(":").map(Number);
    const [hFim, mFim] = hoje.fim.split(":").map(Number);
    const inicio = hIni * 60 + mIni;
    const fim = hFim * 60 + mFim;

    if (minutosAgora < inicio) return "fechada_hoje";
    if (minutosAgora < fim) return "aberta";
  }

  return "fechada_ate_amanha";
}

export function maskPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskCep(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/** Remove tags HTML de uma string, retornando apenas o texto. */
export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
