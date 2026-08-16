"use client";

import type { ReactNode } from "react";
import { useLoja } from "@/lib/hooks";
import { BackHeader } from "@/components/BackHeader";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
      <h2 className="mb-2" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14.5, color: "#012418" }}>
        {title}
      </h2>
      <p className="m-0 text-[13.5px] leading-relaxed text-[#333333]" style={{ fontFamily: "var(--font-manrope)" }}>
        {children}
      </p>
    </div>
  );
}

export default function TermosPage() {
  const loja = useLoja();
  const nome = loja?.nome ?? "Nova Era Tintas";

  return (
    <>
      <BackHeader title="Termos de Serviço" />
      <div className="ne-scroll absolute inset-0 bg-[#F7F8F7] px-4 pt-[104px] pb-8">
        <p className="mb-5 border-b border-[#E5E5E5] pb-5 text-[13px] text-[#999999]" style={{ fontFamily: "var(--font-manrope)", lineHeight: 1.6 }}>
          Condições de uso da loja virtual.
        </p>

        <div className="flex flex-col gap-3">
          <Section title="1. Sobre o serviço">
            A {nome} disponibiliza um catálogo de produtos para pintura, permitindo a montagem e o envio de
            pedidos através deste app.
          </Section>

          <Section title="2. Pagamento">
            Os pedidos são pagos via PIX. Após o pagamento, o cliente deve enviar o comprovante pelo app para
            conferência manual da loja. O pedido só é confirmado após a aprovação do comprovante.
          </Section>

          <Section title="3. Negociação de pedidos">
            A loja pode entrar em contato para negociar itens, quantidades ou valor de frete antes da
            confirmação final do pedido, sempre com o consentimento do cliente.
          </Section>

          <Section title="4. Cancelamento">
            Pedidos podem ser cancelados pelo cliente ou pela loja conforme o estado em que se encontram,
            respeitando o histórico e as políticas de cada etapa do processo de compra.
          </Section>

          <Section title="5. Alterações">
            Estes termos podem ser atualizados periodicamente. Recomendamos revisá-los de tempos em tempos.
          </Section>
        </div>
      </div>
    </>
  );
}
