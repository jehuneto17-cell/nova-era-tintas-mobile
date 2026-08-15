"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, MapPin, CreditCard } from "lucide-react";
import { Toast } from "@/components/Toast";
import { TabBar } from "@/components/TabBar";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { brl, useStore, type CartLine } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { criarPedido } from "@/lib/pedidos";
import type { PedidoItem } from "@/lib/types";

type CheckoutData = { endereco: string; frete: number; enderecoMudou: boolean };

function gerarNumero() {
  return "#" + Math.floor(100000 + Math.random() * 900000);
}

function readCheckoutData(): CheckoutData | null {
  try {
    const raw = sessionStorage.getItem("net_checkout");
    return raw ? (JSON.parse(raw) as CheckoutData) : null;
  } catch {
    return null;
  }
}

export default function ConfirmacaoPage() {
  const router = useRouter();
  const { flash } = useToast();
  const { items, subtotal, resetCart } = useStore();
  const { user, cliente, loading: authLoading } = useAuth();

  const [status, setStatus] = useState<"creating" | "done" | "error">("creating");
  const [pedidoId, setPedidoId] = useState<string | null>(null);
  const [numero, setNumero] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<{ items: CartLine[]; subtotal: number; frete: number; endereco: string } | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    if (authLoading) return;
    if (!user || !cliente) {
      router.replace("/login");
      return;
    }
    if (items.length === 0 && status === "creating") {
      router.replace("/carrinho");
      return;
    }
    started.current = true;

    const checkoutData = readCheckoutData();
    const capturedItems = items;
    const capturedSubtotal = subtotal;
    const frete = checkoutData?.frete ?? 0;
    const endereco = checkoutData?.endereco ?? "";

    const itens: PedidoItem[] = capturedItems.map((i) => ({
      produtoId: i.produtoId,
      nome: i.title,
      variacao: i.variacao,
      qtd: i.qty,
      preco: i.price,
    }));
    const numeroGerado = gerarNumero();

    criarPedido({
      numero: numeroGerado,
      clienteId: cliente.id,
      cliente: cliente.nome,
      telefone: cliente.telefone,
      itens,
      frete,
      endereco,
      enderecoMudou: checkoutData?.enderecoMudou ?? false,
    })
      .then((id) => {
        setPedidoId(id);
        setNumero(numeroGerado);
        setSnapshot({ items: capturedItems, subtotal: capturedSubtotal, frete, endereco });
        setStatus("done");
        resetCart();
        try {
          sessionStorage.removeItem("net_checkout");
        } catch {
          // ignore
        }
      })
      .catch(() => {
        setStatus("error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, cliente]);

  const retry = () => {
    started.current = false;
    setStatus("creating");
  };

  if (status === "creating") {
    return (
      <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-3">
        <span className="w-9 h-9 rounded-full border-[3px] border-[#E5E5E5] border-t-ne-green" style={{ animation: "ne-spin .8s linear infinite" }} />
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>Registrando seu pedido...</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-4 px-8 text-center">
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, color: "#E63946" }}>
          Não foi possível registrar seu pedido
        </div>
        <div className="text-[13px] text-[#999999]">Verifique sua conexão e tente novamente.</div>
        <button
          type="button"
          onClick={retry}
          className="h-12 px-6 border-0 rounded-2xl bg-ne-green text-white cursor-pointer"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14 }}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const total = (snapshot?.subtotal ?? 0) + (snapshot?.frete ?? 0);

  return (
    <div className="absolute inset-0 bg-white">
      <div className="absolute top-0 left-0 right-0 z-30 box-border px-4 pt-[46px] pb-2.5 bg-white border-b border-[#EDEFED] flex items-center gap-2">
        <div className="flex-none w-7" />
        <div className="flex-1 text-center whitespace-nowrap" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: "#000" }}>
          Pedido Registrado
        </div>
        <Check size={28} color="#00B20B" strokeWidth={2.6} className="flex-none" />
      </div>

      <div className="ne-scroll absolute inset-x-0 top-[96px] bottom-[72px]">
        <div className="px-4 pt-5 flex flex-col">
          <div className="flex items-center gap-3.5 p-4 rounded-lg border-l-4 border-ne-green bg-[#E8F5E9] mb-6">
            <div style={{ animation: "ne-pop .28s ease-in both" }}>
              <Check size={48} color="#00B20B" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em", color: "#00B20B" }}>Obrigado!</div>
              <div className="text-sm text-[#999999]">Seu pedido foi registrado. Falta só o pagamento via PIX.</div>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-1">
            <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#999999" }}>Número do Pedido</span>
            <button
              type="button"
              onClick={() => {
                if (numero && navigator.clipboard) navigator.clipboard.writeText(numero).catch(() => {});
                flash("Número copiado!");
              }}
              className="self-start flex items-center gap-2 border-0 bg-transparent p-0 cursor-pointer hover:text-ne-blue transition-colors"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, color: "#000" }}
            >
              <span>{numero}</span>
              <Copy size={15} color="#999999" />
            </button>
          </div>

          <div className="mb-5">
            <div className="mb-3" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: "#000" }}>Itens do Pedido</div>
            {snapshot?.items.map((it) => (
              <div key={`${it.produtoId}::${it.variacao}`} className="flex gap-3 py-3 border-b border-[#EDEFED]">
                <div className="w-20 h-20 flex-none rounded-lg overflow-hidden bg-[#F1F3F1]">
                  {it.shotUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.shotUrl} alt={it.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlaceholder label={it.shot} />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1 justify-center">
                  <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#0088B7" }}>{it.title}</div>
                  <div className="text-xs text-[#999999]">Qtd: {it.qty} · {it.specs}</div>
                  <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#00B20B" }}>{brl(it.price * it.qty)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <div className="mb-3" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: "#000" }}>Resumo</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5C6A62]">Subtotal</span>
                <span className="text-sm text-[#000]">{brl(snapshot?.subtotal ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5C6A62]">Frete</span>
                <span className="text-sm font-semibold" style={{ color: (snapshot?.frete ?? 0) === 0 ? "#00B20B" : "#000" }}>
                  {(snapshot?.frete ?? 0) === 0 ? "Grátis" : brl(snapshot?.frete ?? 0)}
                </span>
              </div>
              <div className="h-px bg-[#E5E5E5] my-1" />
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, color: "#000" }}>Total a Pagar</span>
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: "#00B20B" }}>{brl(total)}</span>
              </div>
            </div>
          </div>

          {snapshot?.endereco && (
            <div className="mb-5">
              <div className="mb-3" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: "#000" }}>Entregar em</div>
              <div className="flex gap-2.5 p-3 rounded-lg bg-[#F5F5F5]">
                <MapPin size={20} color="#00B20B" strokeWidth={2} className="flex-none mt-px" />
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span className="text-sm text-[#000]">{snapshot.endereco}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-2 flex flex-col gap-3 pb-6">
            <button
              type="button"
              onClick={() => pedidoId && router.push(`/pagamento?id=${pedidoId}`)}
              className="w-full h-14 border-0 rounded-[24px] bg-ne-green text-white cursor-pointer flex items-center justify-center gap-2.5 hover:bg-[#009209] hover:scale-[1.015] transition-all"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16 }}
            >
              <CreditCard size={19} />
              <span>Pagar Agora</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full h-14 border-2 border-[#E5E5E5] rounded-[24px] bg-white text-black cursor-pointer hover:border-ne-green hover:scale-[1.015] transition-all"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16 }}
            >
              Pagar Depois
            </button>
          </div>
        </div>
      </div>

      <TabBar />
      <Toast />
    </div>
  );
}
