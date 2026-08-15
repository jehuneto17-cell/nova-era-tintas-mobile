# Resumo — Migração do Mobile para Firestore real

Contexto pra quem for continuar isso em outro chat, com os três projetos abertos ao mesmo tempo (**Nova Era Tintas - Mobile**, **Nova Era Tintas - Web**, e o **painel admin**). Todos compartilham o mesmo projeto Firebase (`nova-era-tintas`) e deveriam compartilhar o mesmo `lib/types.ts`.

## O que foi pedido

Trocar todo dado mockado do app mobile (catálogo, categorias, pedidos, login, pagamento) por leitura/escrita real do Firestore, seguindo o schema descrito em `PROMPT_CONECTAR_APP_AO_FIRESTORE.md` (na raiz do repo mobile). O painel admin já escreve dados reais nessas coleções em produção.

## O que foi feito (mobile) — não commitado ainda

**Camada de serviço (`src/lib/`)** — portada quase verbatim do repo web, que já tinha essa camada funcionando: `firebase.ts`, `types.ts`, `produtos.ts`, `categorias.ts`, `pedidos.ts`, `clientes.ts`, `cupons.ts`, `configuracoes.ts`, `hooks.ts`, `cloudinary.ts`, `auth.tsx`, `mappers.ts` (parcial). `store.tsx` foi reescrito (carrinho denormalizado tipo `CartLine`, persistido em localStorage). Toast foi separado num `toast.tsx` próprio (o web não tem esse conceito). `data.ts` (mock antigo) foi deletado.

**Autenticação real** — login/cadastro usam Firebase Auth (`signInWithEmailAndPassword`/`createUserWithEmailAndPassword`); cadastro ganhou campo de telefone (não existia); perfil e perfil/editar leem/gravam `clientes/{uid}` real, com CRUD de endereços.

**Catálogo** — Home, categorias, produto/[id] (seletor de cor/volume ligado a `variacoes` real, com preço/estoque reais), produtos/[categoria] e busca — todos usando `useProdutos()`/`useCategoriasAtivas()`/`getProduto()` etc.

**Fluxo de compra reescrito** — carrinho → checkout (confirma endereço) → `/confirmacao` (cria pedido real via `criarPedido()`, `estado: "em_negociacao"`) → `/pagamento` (mostra PIX real de `configuracoes/pagamento`) → `/comprovante/enviar` (upload real pro Cloudinary + `enviarComprovante()`) → `/comprovante/aguardando` (`onSnapshot` em tempo real). O botão "Abrir WhatsApp" que antes finalizava o pedido foi removido — checkout agora exige login.

**Pedidos** — lista e detalhe usam `subscribePedidosDoCliente`/`subscribePedido`; timeline do detalhe renderiza `pedido.historico[]` real em vez de um fluxo fixo de 6 passos hardcoded.

**Build/lint** — `npm run build` e `npm run lint` limpos (só resta 1 erro de lint pré-existente em `SplashGate.tsx`, de antes desta sessão, não tocado).

## Pendências — schema compartilhado, precisa alinhar com admin + web

Três telas do mobile dependem de dados que **não existem ainda de forma utilizável** no schema Firestore compartilhado. Já troquei ideia com o Claude Code do painel admin sobre isso (ver `PERGUNTA_PARA_PAINEL_ADMIN.md` na raiz do mobile, com as perguntas originais) — aqui está o que ele respondeu:

### 1. `/pedidos/negociacao` e `/pedidos/atualizado` — **implementado nos 3 repos**

Essas telas mostram "antes vs depois" de uma edição de pedido (ex: preço de um item mudou). Antes desta etapa, esse recurso não existia — o drawer de edição de pedido no admin (`src/app/(admin)/pedidos/page.tsx`) era só esqueleto visual, sem `onClick`, sem gravação no Firestore.

**Schema decidido e aplicado nos três `lib/types.ts` (mobile, web, admin):**
```ts
export interface PedidoHistoricoEntrada {
  tipo?: "estado" | "edicao";      // novo, opcional (default implícito "estado")
  estado: string;                   // no admin continua PedidoEstado
  quando: string;
  quem: string;
  observacao?: string;
  itensAnteriores?: PedidoItem[];   // snapshot de antes, só quando tipo === "edicao"
  freteAnterior?: number;
}
```
Optou-se por estender `historico[]` em vez de criar um campo solto tipo `Pedido.itensAnteriores`: cada edição fica registrada (não só a última), segue o padrão já existente de "o que aconteceu, quando, por quem", e não exige lógica de limpeza (a entrada é imutável, append-only).

**Admin (`src/app/(admin)/pedidos/page.tsx`)** — drawer de edição agora funciona de verdade:
- Botões `−`/`+` de quantidade editam um rascunho local (`itensEditados`); quantidade 0 remove o item.
- "+ Adicionar item" abre um modal (`AdicionarItemModal`) com busca no catálogo real (`useProdutos()`) e seleção de variação (cor/volume), reaproveitando o formato de chave `` `${cor}|${volume}` `` já usado no mobile/web.
- "Salvar alterações" só aparece quando o rascunho difere do pedido salvo; grava `itens` novo + uma entrada `historico[]` com `tipo: "edicao"` e `itensAnteriores` = snapshot de antes da edição. "Descartar" reseta o rascunho.
- Timeline do histórico no drawer mostra entradas de edição com rótulo "Itens revisados" e lista os itens/preços anteriores.
- Só editável quando `pedido.estado === "em_negociacao"` (mesma trava que já existia na UI).

**Mobile:**
- `/pedidos/negociacao?id=...` — lê o pedido real via `subscribePedido`, mostra itens/total/endereço atuais. Redireciona para `/pedidos/[id]` se o estado deixar de ser `"em_negociacao"` (pedido fechado ou cancelado enquanto a tela estava aberta).
- `/pedidos/atualizado?id=...` — acha a última entrada `tipo === "edicao"` no `historico[]`, compara `itensAnteriores` com `pedido.itens` atual (por chave `produtoId|variacao`) e calcula o diff dinamicamente: itens que mudaram de preço/qtd ganham a tag "MUDOU" com o valor riscado, itens novos ganham "novo item", itens que sumiram aparecem esmaecidos com tag "REMOVIDO". Se não houver nenhuma edição registrada, mostra estado vazio em vez de dado inventado.
- `/pedidos/page.tsx`: o CTA "Negociar" (pedidos em `em_negociacao`) agora navega com `?id=` (antes ia sem parâmetro, o que teria quebrado a tela real).

**Build/lint:** limpos nos três repos (`npm run build` + `npm run lint` no mobile e no admin; `tsc --noEmit` no web).

**Web (`Nova Era Tintas - Web`)** — já tinha as 3 telas conectadas ao Firestore via `subscribePedido` (mais avançado que o mobile estava antes desta sessão), mas nenhuma usava o schema novo. Alinhado com o mobile:
- `/pedidos/atualizado` — tinha um histórico genérico sem diff; ganhou a mesma seção de diff de itens (MUDOU/novo item/REMOVIDO) usando `itensAnteriores`, mais resumo financeiro com valores riscados.
- `/comprovante/recusado` — motivo era hardcoded (`const MOTIVO = {...}`); trocado pelo mesmo parsing/campo estruturado usado no mobile. Ganhou também o card "Comprovante Anterior" (imagem real), que não existia no web antes.
- `/pedidos/negociacao` — botão "Cancelar Pedido" só fazia `router.push` sem gravar nada; agora chama `cancelarPedido()` (nova função em `lib/pedidos.ts`, grava `estado: "cancelado"` + entrada de histórico). Tela também redireciona para `/pedidos/[id]` se o pedido sair de `em_negociacao` enquanto aberta.
- `npx tsc --noEmit` e `npm run build` limpos (só warnings pré-existentes de `themeColor`/`react/display-name` não relacionados).

### 2. `/comprovante/recusado` — **implementado**

Esse fluxo já existia e funciona no admin (`src/app/(admin)/conferencia/page.tsx:76-105`). Comportamento real:
- Ao recusar um comprovante, o `estado` do pedido volta pra `"aguardando_pagamento"` (não existe `"recusado"` em `PedidoEstado`, e o admin não usa `"cancelado"` pra isso).
- `comprovanteUrl`, `comprovanteEnviadoEm`, `valorComprovante` são apagados (`null`).
- O motivo vai como texto livre em `historico[].observacao`, formato `"Comprovante recusado: {motivo}"`. Os motivos pré-cadastrados vêm de `configuracoes/pagamento.motivos_recusa`, mas o valor escolhido não é salvo em campo separado — só concatenado na string da observação.

**Implementado no mobile via parsing** — `estado === "aguardando_pagamento"` **e** a última entrada de `historico[]` tem `observacao` começando com `"Comprovante recusado:"`. É frágil (depende do texto exato), mas reflete o comportamento real do admin sem exigir mudança de schema.

- `/comprovante/aguardando` detecta a recusa via `onSnapshot` e redireciona automaticamente para `/comprovante/recusado?id=...` (cliente estava com a tela aberta esperando confirmação).
- `/pedidos/[id]` detecta o mesmo caso e troca o botão "Pagar Agora" por "Ver Motivo da Recusa" (cliente voltou depois, sem estar com a tela aberta no momento da recusa).
- `/comprovante/recusado` agora lê o pedido real (`subscribePedido`), extrai o motivo da observação, mostra o comprovante anterior de fato enviado (`pedido.comprovanteUrl`, se ainda presente) e usa WhatsApp real (`useWhatsapp`). Botão "Enviar Outro" leva para `/comprovante/enviar?id=...`.
- Como o admin apaga `comprovanteUrl` ao recusar, na prática o card "Comprovante Anterior" cai no fallback de placeholder na maioria dos casos — mantido do jeito que estava, só trocando pra imagem real quando disponível.

**Formalizado nos 3 repos** — `Pedido.ultimaRecusa?: { motivo: string; quando: string; comprovanteUrl?: string }` foi adicionado aos três `types.ts`. `conferencia/page.tsx` (admin) agora grava esse campo estruturado ao recusar, além de continuar gravando a observação de texto em `historico[]` (retrocompatibilidade — não quebra nada que já lia o texto). Importante: como o admin apaga `comprovanteUrl`/`comprovanteEnviadoEm`/`valorComprovante` do pedido ao recusar, `ultimaRecusa.comprovanteUrl` captura essa URL **antes** de apagar — é a única forma de mostrar o comprovante recusado depois do fato.

Mobile e web (`motivoRecusa()` em `comprovante/recusado/page.tsx` nos dois) agora preferem `pedido.ultimaRecusa?.motivo`, com fallback pro parsing de string (`historico[].observacao`) para pedidos recusados antes dessa mudança, que não têm o campo novo. O card "Comprovante Anterior" em ambos os apps usa `ultimaRecusa?.comprovanteUrl ?? pedido.comprovanteUrl` pelo mesmo motivo.

## Próximos passos sugeridos (pro chat com os 3 projetos abertos)

1. Pedidos recusados **antes** desta mudança não têm `ultimaRecusa` (o campo só passa a ser gravado a partir de agora) — o fallback pro parsing de string cobre isso, mas vale confirmar em produção que não sobrou nenhum pedido "preso" nesse estado esperando dado que nunca vai aparecer.
2. Nada foi commitado em nenhum dos três repos ainda — revisar e commitar quando estiver satisfeito.

## Arquivos de referência nesta pasta (mobile)

- `PROMPT_CONECTAR_APP_AO_FIRESTORE.md` — o schema original que guiou toda a migração.
- `PERGUNTA_PARA_PAINEL_ADMIN.md` — as perguntas que foram feitas ao admin (e cujas respostas estão resumidas acima).
- Este arquivo (`RESUMO_MIGRACAO_FIRESTORE.md`).

Nada foi commitado no git ainda — todas as mudanças estão como working tree changes no repo mobile.
