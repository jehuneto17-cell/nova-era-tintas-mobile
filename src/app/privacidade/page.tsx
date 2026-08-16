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

export default function PrivacidadePage() {
  const loja = useLoja();
  const nome = loja?.nome ?? "Nova Era Tintas";

  return (
    <>
      <BackHeader title="Política de Privacidade" />
      <div className="ne-scroll absolute inset-0 bg-[#F7F8F7] px-4 pt-[104px] pb-8">
        <p className="mb-5 border-b border-[#E5E5E5] pb-5 text-[13px] text-[#999999]" style={{ fontFamily: "var(--font-manrope)", lineHeight: 1.6 }}>
          Como tratamos os seus dados pessoais.
        </p>

        <div className="flex flex-col gap-3">
          <Section title="1. Dados coletados">
            Coletamos os dados necessários para processar seu cadastro e pedidos: nome, e-mail, telefone,
            endereços de entrega e, quando enviado, o comprovante de pagamento PIX.
          </Section>

          <Section title="2. Uso dos dados">
            Seus dados são usados exclusivamente para viabilizar a compra: conferência de pagamento,
            separação, envio do pedido e comunicação sobre o andamento (inclusive via WhatsApp, quando
            aplicável).
          </Section>

          <Section title="3. Compartilhamento">
            A {nome} não vende nem compartilha seus dados com terceiros para fins de marketing. Os dados
            ficam armazenados nos serviços de infraestrutura utilizados pela loja para operar o app e os
            pedidos.
          </Section>

          <Section title="4. Seus direitos">
            Você pode solicitar a atualização ou exclusão dos seus dados a qualquer momento, entrando em
            contato pelos canais de &ldquo;Nossas redes sociais&rdquo; no seu Perfil.
          </Section>
        </div>
      </div>
    </>
  );
}
