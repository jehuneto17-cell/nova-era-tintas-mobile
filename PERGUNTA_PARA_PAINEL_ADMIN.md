# Pergunta para o Claude Code do painel admin (Nova Era Tintas)

Estou terminando a migração do app mobile de mock para Firestore real (mesmo projeto `nova-era-tintas` que o painel admin usa). Sobrou duas telas que dependem de dados que **não existem** no schema que me foi passado (`lib/types.ts` / `Pedido`), e preciso saber se o painel admin já tem (ou planeja ter) esses campos, antes de eu inventar algo do meu lado.

## 1. Pedido em negociação / pedido atualizado

O mobile tem duas telas (`/pedidos/negociacao` e `/pedidos/atualizado`) que mostram um "antes vs depois" quando a loja altera um pedido em negociação — ex: preço de um item mudou de R$ 58,00 pra R$ 55,00, e a tela mostra os dois valores riscado/atual.

O `Pedido` atual só guarda o estado *atual* de `itens[]` — não existe nenhum snapshot do estado anterior antes de uma edição.

**Perguntas:**
- O painel admin, ao editar um pedido em negociação, grava em algum lugar o valor/itens *anteriores* à edição (além do `historico[]` de mudança de estado)?
- Se sim: qual o nome exato do campo/coleção e o formato?
- Se não: faz sentido eu adicionar um campo tipo `Pedido.itensAnteriores: PedidoItem[]` (setado pelo admin ao editar, limpo depois que o cliente confirma), ou vocês preferem resolver isso de outra forma (ex: usar o `historico[]` com uma entrada de tipo "edicao" carregando um snapshot)?
- Esse campo precisaria ser replicado nos dois repositórios (mesmo tipo em `lib/types.ts` do web e do mobile) — tem algum outro app/dashboard além do painel admin que também leria esse pedido editado?

## 2. Comprovante recusado

O mobile tem uma tela (`/comprovante/recusado`) pra quando a loja recusa o comprovante PIX enviado pelo cliente, mostrando o motivo da recusa.

Hoje: `PedidoEstado` não tem um valor `"recusado"` (só tem `cancelado`), e `Pedido` não tem nenhum campo pra guardar *qual* motivo de recusa foi usado (mesmo existindo `PagamentoConfig.motivos_recusa`, que é só a lista de motivos possíveis cadastrada na config da loja).

**Perguntas:**
- Quando o admin recusa um comprovante, isso já acontece hoje no painel? Se sim, o que exatamente é gravado no pedido (algum campo, ou só uma entrada no `historico[]` com `observacao` livre)?
- Faz sentido adicionar `estado: "recusado"` em `PedidoEstado` + um campo `Pedido.motivoRecusa?: string` (um dos valores de `motivos_recusa`), ou vocês preferem que eu trate a recusa como `estado: "cancelado"` reaproveitando o que já existe, com o motivo só como texto livre no `historico[].observacao`?
- Esse fluxo de recusa é algo que o painel admin já implementa/planeja implementar, ou ainda não existe lá também?

---

Contexto: ambos os apps (mobile Next.js e web Next.js) compartilham o mesmo `lib/types.ts` e o mesmo banco Firestore do painel admin. Qualquer campo novo precisa ser adicionado nos três lugares de forma consistente, então prefiro alinhar antes de implementar.
