# CLAUDE.md

Este arquivo fornece orientação ao Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Comandos

- `npm run dev` — inicia o servidor de desenvolvimento (Next.js, Turbopack) em http://localhost:3000
- `npm run build` — build de produção
- `npm run start` — serve o build de produção
- `npm run lint` — roda o ESLint (flat config: `eslint-config-next` core-web-vitals + typescript)

Não há test runner configurado neste projeto.

## Arquitetura

Este é um protótipo de frontend em **Next.js 16 App Router** para a "Nova Era Tintas", uma loja virtual mobile-first (tintas, pincéis, rolos). Todos os dados de produtos/pedidos são **mock em memória** — não há backend, camada de API ou persistência além do `sessionStorage`.

### Casca de celular (phone shell)

Todas as rotas são renderizadas dentro de uma moldura de celular simulada, não como uma página responsiva comum:

- `src/app/layout.tsx` envolve todas as páginas em `.ne-viewport` > `.ne-phone` (ver `globals.css`). Em telas ≥860px isso é exibido como uma moldura de celular fixa e centralizada (390×844, cantos arredondados, sombra); em telas mais estreitas fica full-bleed.
- `.ne-phone` tem `overflow: hidden` com `position: relative`, então cada página precisa gerenciar sua própria rolagem interna (via a classe utilitária `.ne-scroll`), e qualquer header/tab bar fixo é posicionado de forma absoluta *dentro* de `.ne-phone`, não do viewport.
- `SplashGate` (`src/components/SplashGate.tsx`) envolve os children e exibe uma splash screen única por sessão no primeiro carregamento (controlada por `sessionStorage["ne-splash-seen"]`), depois redireciona para `/entrada`.

Tenha essa restrição em mente ao adicionar páginas: os layouts devem assumir um canvas de celular fixo de 390px de largura, não o viewport completo do navegador.

### Estado: um único contexto global, sem biblioteca externa

`src/lib/store.tsx` (`AppProviders` / `useApp()`) é todo o estado da aplicação: carrinho, favoritos e uma fila de toasts. É um Context puro do React + `useState`, somente client-side (`"use client"`), inicializado com dados hardcoded de carrinho/favoritos — nada é persistido entre recarregamentos. `useCartItems()` é um helper de estado derivado que cruza os itens do carrinho com `PRODUCTS`.

Ao adicionar funcionalidades com estado, estenda `AppState` em `store.tsx` em vez de introduzir uma nova biblioteca de estado ou contexto.

### Dados: catálogo mock estático

`src/lib/data.ts` é a fonte única de verdade para:
- `PRODUCTS` / `Product` — o catálogo de produtos (id, categoria, preço, etc.)
- `CATEGORIES` — lista de categorias com metadados de exibição
- `ORDERS` / `Order` / `OrderStatus` / `STATUS_META` — histórico de pedidos mock e o mapeamento de status para cor/label
- `brl()` — formatador de moeda (estilo `R$ 1.234,56`)

Não há camada de fetch/API; as páginas importam diretamente deste arquivo. Como não há imagens reais de produto, `ImagePlaceholder` (`src/components/ImagePlaceholder.tsx`) é usado como substituto em qualquer lugar que teria uma imagem, e `Product.ph` guarda uma descrição em texto do que o placeholder deveria representar.

### Estrutura de rotas

As rotas ficam em `src/app/*/page.tsx` (App Router, sem route groups). Rotas dinâmicas relevantes: `produto/[id]`, `produtos/[categoria]`, `pedido/[id]`. Os nomes de página/rota estão em português e mapeiam o fluxo da loja: `entrada` → `login`/`cadastro` → home (`/`) → `categorias`/`busca`/`resultados-busca` → `produto/[id]` → `carrinho` → `checkout` → `pagamento` → `enviar-comprovante`/`aguardando-confirmacao`/`comprovante-recusado` → `confirmacao` → `pedidos`/`pedido/[id]`/`pedido-negociacao`/`pedido-atualizado` → `perfil`/`editar-perfil`, além de `favoritos` e `avaliar`.

Componentes de chrome compartilhados ficam em `src/components/`: `TabBar` (navegação inferior, aba ativa derivada de `usePathname()`), `BackHeader` (header de navegação "voltar" usado por páginas internas), `StatusBar`/`PhoneStatusBarStatic` (barra de status estilo iOS fake para a casca do celular), `Toast` (renderiza `useApp().toast`), `SuccessConfetti`.

### Convenções de estilo

- Tailwind v4 (`@import "tailwindcss"` em `globals.css`, sem `tailwind.config` — os tokens de tema são definidos via `@theme inline` e custom properties CSS em `globals.css`).
- As cores da marca são variáveis CSS prefixadas com `--ne-*` (`--ne-green`, `--ne-dark`, `--ne-blue`, `--ne-red`, `--ne-yellow`) expostas como cores do Tailwind `ne-green`, `ne-dark`, etc.
- Duas famílias de fonte via `next/font/google`: `Archivo` (`--font-archivo`, títulos/ênfase, peso 500-800) e `Manrope` (`--font-manrope`, corpo de texto, peso 400-700) — aplique via `style={{ fontFamily: "var(--font-archivo)" }}` inline em vez de uma classe de fonte do Tailwind, seguindo o padrão dos componentes existentes.
- Animações keyframe customizadas já estão predefinidas em `globals.css` com prefixo `ne-` (ex.: `ne-fadeup`, `ne-toast`, `ne-confetti`, `ne-sheet`) — reutilize-as em vez de criar novas para transições comuns (padrões de fade/slide/toast/sheet/pop já existem).
- `cn()` (`src/lib/utils.ts`) é um simples concatenador de classes (filtra valores falsy) — não é `clsx`/`tailwind-merge`.
- Todos os componentes interativos/com estado são Client Components (`"use client"`); mantenha páginas como Server Components apenas quando não precisarem de `useApp()`, hooks de roteamento ou APIs de navegador.
