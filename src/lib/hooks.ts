"use client";

import { useEffect, useState } from "react";
import { subscribeCategoriasAtivas } from "./categorias";
import { subscribeCores } from "./cores";
import { subscribeBranding, subscribeFrete, subscribePagamento, subscribeWhatsapp, subscribeBuscas, subscribeLoja } from "./configuracoes";
import { subscribeProdutos } from "./produtos";
import type {
  BrandingConfig,
  Categoria,
  BuscasConfig,
  FreteConfig,
  LojaConfig,
  PagamentoConfig,
  Produto,
  ProdutoCor,
  WhatsappConfig,
} from "./types";

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeProdutos((p) => {
      setProdutos(p);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { produtos, loading };
}

export function useCategoriasAtivas() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeCategoriasAtivas((c) => {
      setCategorias(c);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { categorias, loading };
}

/** Paleta global de cores da loja (coleção `cores`) — usada por produtos com todasCores=true. */
export function useCoresAtivas() {
  const [cores, setCores] = useState<ProdutoCor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeCores((c) => {
      setCores(c);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { cores, loading };
}

export function useBranding() {
  const [branding, setBranding] = useState<BrandingConfig | null>(null);

  useEffect(() => subscribeBranding(setBranding), []);

  return branding;
}

export function usePagamento() {
  const [pagamento, setPagamento] = useState<PagamentoConfig | null>(null);

  useEffect(() => subscribePagamento(setPagamento), []);

  return pagamento;
}

export function useWhatsapp() {
  const [whatsapp, setWhatsapp] = useState<WhatsappConfig | null>(null);

  useEffect(() => subscribeWhatsapp(setWhatsapp), []);

  return whatsapp;
}

export function useFrete() {
  const [frete, setFrete] = useState<FreteConfig | null>(null);

  useEffect(() => subscribeFrete(setFrete), []);

  return frete;
}

export function useBuscas() {
  const [buscas, setBuscas] = useState<BuscasConfig | null>(null);

  useEffect(() => subscribeBuscas(setBuscas), []);

  return buscas;
}

export function useLoja() {
  const [loja, setLoja] = useState<LojaConfig | null>(null);

  useEffect(() => subscribeLoja(setLoja), []);

  return loja;
}
