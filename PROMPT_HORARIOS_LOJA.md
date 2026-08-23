# Prompt para o painel administrativo (Nova Era Tintas — Painel Adm)

Cole isto no assistente que tem acesso ao código do painel administrativo.

---

Preciso implementar no app da loja (mobile e web) uma lógica de "loja aberta/fechada agora" baseada no horário de funcionamento configurado em **Configurações : Loja**. Para isso preciso saber exatamente como e onde o painel admin está salvando esse dado hoje no Firestore.

Hoje, o app mobile/web tem documentado apenas isto sobre a coleção `configuracoes/loja`:

```ts
{ nome: string; cnpj: string; endereco: string; cidade: string; estado: string; horarios: string }
```

Ou seja, um campo `horarios` como **string única de texto livre** (ex: `"Seg-Sex 8h às 18h, Sáb 8h às 12h"`).

Isso não é suficiente para calcular programaticamente se a loja está aberta neste exato momento (dia da semana + hora atual), então preciso que você me responda:

1. **O campo `horarios` no documento `configuracoes/loja` é salvo exatamente como uma string livre?** Se sim, me mande um exemplo real do valor salvo atualmente.
2. **Ou já existe (ou dá pra existir) um formato estruturado por dia da semana**, com hora de abertura e fechamento? Se sim, me mande o formato exato dos campos/tipos (nomes de propriedade, tipos, se tem campo para "fechado no dia X", se suporta horário de almoço/intervalo, etc.).
3. Existe algum outro documento/coleção no Firestore (fora `configuracoes/loja`) que já guarde esse horário de funcionamento de forma estruturada, usado por alguma outra tela do painel (ex: para mostrar "aberto/fechado" no próprio admin)?
4. Se o formato ainda for só a string livre e for necessário mudar, **você pode alterar a tela de Configurações : Loja no painel** para salvar um formato estruturado do tipo abaixo (proposta, ajuste como preferir, mas mantenha compatível com múltiplos apps lendo o mesmo documento)?

```ts
// configuracoes/loja
{
  nome: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  horarios: {
    // chave: "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom"
    [dia: string]: {
      aberto: boolean;       // false = fechado o dia todo
      abre: string;          // "HH:mm", ex: "08:00"
      fecha: string;         // "HH:mm", ex: "18:00"
    }
  }
}
```

5. Não altere nada gravando dados fora do que já é feito hoje — quero só confirmar (ou migrar, se você concordar que faz sentido) o formato de `horarios` para que os apps consigam calcular corretamente:
   - **"Retire hoje"** → loja aberta agora, dentro do horário do dia.
   - **"Estamos fechados"** → loja fechada no momento, mas ainda é o mesmo dia (antes da meia-noite) e ela vai abrir de novo ainda hoje ou já passou do horário mas ainda não virou o dia.
   - **"Voltamos amanhã"** → já passou do horário de funcionamento de hoje (após o fechamento, até 00h).

Me responda com o formato exato e atual antes de eu mexer no app cliente, para eu não quebrar a leitura que já está em produção.
