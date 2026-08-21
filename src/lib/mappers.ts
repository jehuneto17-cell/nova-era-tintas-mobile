import { capaUrl } from "./produtos";
import type { CartLine } from "./store";
import type { Produto, ProdutoVariacao } from "./types";

/** A variação padrão de um produto para adicionar ao carrinho a partir de um card (menor preço entre as ativas com estoque). */
export function variacaoPadrao(
  produto: Produto
): [chave: string, variacao: ProdutoVariacao] | null {
  const entradas = Object.entries(produto.variacoes).filter(
    ([, v]) => v.ativo && v.estoque > 0
  );
  if (entradas.length === 0) return null;
  return entradas.reduce((menor, atual) => (atual[1].preco < menor[1].preco ? atual : menor));
}

/** Monta a linha de carrinho para um produto usando sua variação padrão (menor preço com estoque). */
export function toCartLine(produto: Produto): Omit<CartLine, "qty"> | null {
  const padrao = variacaoPadrao(produto);
  if (!padrao) return null;
  const [chave, variacao] = padrao;
  const specsCor = produto.todasCores ? "Qualquer cor" : `Cor: ${variacao.cor}`;
  return {
    produtoId: produto.id,
    variacao: chave,
    title: produto.nome,
    specs: `${specsCor} | Volume: ${variacao.volume}`,
    price: variacao.preco,
    oldPrice: null,
    shot: produto.nome.split(" ")[0],
    shotUrl: capaUrl(produto),
  };
}
