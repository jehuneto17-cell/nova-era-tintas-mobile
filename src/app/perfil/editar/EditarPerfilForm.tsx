"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Camera, Lock, Trash2, MapPin, Plus, Star } from "lucide-react";
import type { User } from "firebase/auth";
import { useToast } from "@/lib/toast";
import { atualizarCliente } from "@/lib/clientes";
import { maskPhone } from "@/lib/utils";
import type { Cliente, ClienteEndereco } from "@/lib/types";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export function EditarPerfilForm({ user, cliente }: { user: User; cliente: Cliente }) {
  const router = useRouter();
  const { flash } = useToast();

  const [nome, setNome] = useState(cliente.nome);
  const [telefone, setTelefone] = useState(cliente.telefone);
  const [errors, setErrors] = useState<{ nome?: string }>({});
  const [saving, setSaving] = useState(false);
  const [hasPhoto] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [addrLabel, setAddrLabel] = useState("");
  const [addrText, setAddrText] = useState("");
  const [savingAddr, setSavingAddr] = useState(false);

  const changed = useMemo(
    () => nome !== cliente.nome || telefone !== cliente.telefone,
    [cliente, nome, telefone]
  );

  const isValid = nome.trim().length >= 3;
  const canSave = changed && isValid && !saving;

  const save = async () => {
    if (!isValid) {
      setErrors({ nome: "Nome deve ter pelo menos 3 caracteres" });
      return;
    }
    if (!changed) return;
    setSaving(true);
    try {
      await atualizarCliente(user.uid, { nome: nome.trim(), telefone });
      setSaving(false);
      flash("Perfil atualizado");
    } catch {
      setSaving(false);
      flash("Erro ao salvar. Tente novamente");
    }
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setConfirmDelete(false);
  };

  const takePhoto = () => {
    flash("Upload de foto de perfil ainda não disponível");
    closeSheet();
  };

  const pickGallery = () => {
    flash("Upload de foto de perfil ainda não disponível");
    closeSheet();
  };

  const onDeletePhoto = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    closeSheet();
  };

  const addAddress = async () => {
    if (!addrLabel.trim() || !addrText.trim()) return;
    setSavingAddr(true);
    const novo: ClienteEndereco = {
      id: `end-${Date.now()}`,
      rotulo: addrLabel.trim(),
      texto: addrText.trim(),
      principal: cliente.enderecos.length === 0,
    };
    try {
      await atualizarCliente(user.uid, { enderecos: [...cliente.enderecos, novo] });
      setAddrLabel("");
      setAddrText("");
      flash("Endereço adicionado");
    } catch {
      flash("Erro ao adicionar endereço");
    } finally {
      setSavingAddr(false);
    }
  };

  const setPrincipal = async (id: string) => {
    const enderecos = cliente.enderecos.map((e) => ({ ...e, principal: e.id === id }));
    await atualizarCliente(user.uid, { enderecos });
  };

  const removeAddress = async (id: string) => {
    const enderecos = cliente.enderecos.filter((e) => e.id !== id);
    await atualizarCliente(user.uid, { enderecos });
  };

  return (
    <>
      <div className="ne-scroll absolute inset-0 bg-[#F7F8F7] pb-[104px]">
        {/* header */}
        <div className="sticky top-0 z-30 box-border px-3 pt-[46px] pb-2.5 bg-white border-b border-[#EDEFED] flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-none w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer flex items-center justify-center hover:bg-[#F5F5F5] hover:border-ne-green transition-colors"
          >
            <X size={18} color="#012418" strokeWidth={2.4} />
          </button>
          <div
            className="flex-1 min-w-0 text-center overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.01em", color: "#000" }}
          >
            Editar Perfil
          </div>
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className="flex-none px-1 cursor-pointer disabled:cursor-not-allowed"
            style={{
              fontFamily: "var(--font-archivo)",
              fontWeight: 700,
              fontSize: 14,
              color: canSave ? "#00B20B" : "#C4CCC7",
            }}
          >
            {saving ? "..." : "Salvar"}
          </button>
        </div>

        {/* avatar */}
        <div className="flex flex-col items-center pt-7">
          <div className="relative">
            <div
              className="w-[120px] h-[120px] rounded-full overflow-hidden bg-[#F1F3F1] box-content"
              style={{ border: "3px solid #00B20B" }}
            >
              <ImagePlaceholder shape="circle" label={hasPhoto ? "Foto de perfil" : "Sem foto"} iconSize={28} />
            </div>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="absolute bottom-0.5 right-0.5 w-9 h-9 rounded-full bg-ne-green border-[3px] border-white cursor-pointer flex items-center justify-center hover:bg-[#00c40d] transition-colors"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,.2)" }}
            >
              <Camera size={15} color="#FFFFFF" strokeWidth={2.2} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="mt-2.5 border-0 bg-transparent p-0 cursor-pointer text-ne-green hover:underline"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13 }}
          >
            Editar Foto
          </button>
        </div>

        {/* personal data */}
        <div className="px-4 pt-7">
          <div className="mb-3 px-1 uppercase text-[#999999]" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 11.5, letterSpacing: "0.06em" }}>
            Dados Pessoais
          </div>
          <div className="flex flex-col gap-4">
            <Field
              label="Nome Completo"
              value={nome}
              onChange={(v) => {
                setNome(v);
                setErrors((s) => ({ ...s, nome: undefined }));
              }}
              onBlur={() => setErrors((s) => ({ ...s, nome: nome.trim().length < 3 ? "Nome deve ter pelo menos 3 caracteres" : undefined }))}
              error={errors.nome}
              placeholder="Seu nome completo"
            />
            <div className="flex flex-col gap-1.5">
              <label style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, color: "#012418" }}>Email</label>
              <input
                className="ne-in"
                type="email"
                value={user.email ?? ""}
                disabled
                readOnly
                style={{
                  height: 50,
                  boxSizing: "border-box",
                  padding: "0 16px",
                  border: "1px solid #F0F0F0",
                  borderRadius: 12,
                  background: "#EDEFED",
                  fontFamily: "var(--font-manrope)",
                  fontSize: 14,
                  color: "#999999",
                  width: "100%",
                }}
              />
              <span className="text-[11px] text-[#999999]">O email de login não pode ser alterado aqui.</span>
            </div>
          </div>
        </div>

        {/* contact */}
        <div className="px-4 pt-6">
          <div className="mb-3 px-1 uppercase text-[#999999]" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 11.5, letterSpacing: "0.06em" }}>
            Contato
          </div>
          <Field
            label="Telefone"
            value={telefone}
            onChange={(v) => setTelefone(maskPhone(v))}
            placeholder="(35) 98414-1300"
          />
        </div>

        {/* addresses */}
        <div className="px-4 pt-6">
          <div className="mb-3 px-1 uppercase text-[#999999]" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 11.5, letterSpacing: "0.06em" }}>
            Endereços
          </div>
          <div className="flex flex-col gap-2.5">
            {cliente.enderecos.map((e) => (
              <div key={e.id} className="p-3.5 bg-white rounded-xl border border-[#EDEFED] flex items-start gap-3">
                <MapPin size={16} color="#00B20B" strokeWidth={2.2} className="flex-none mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, color: "#012418" }}>{e.rotulo}</span>
                    {e.principal && <Star size={11} fill="#FFB703" color="#FFB703" />}
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-[#666]">{e.texto}</div>
                  <div className="mt-1.5 flex items-center gap-3">
                    {!e.principal && (
                      <button
                        type="button"
                        onClick={() => setPrincipal(e.id)}
                        className="border-0 bg-transparent p-0 cursor-pointer text-[11.5px] font-semibold text-ne-blue hover:underline"
                      >
                        Tornar principal
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAddress(e.id)}
                      className="border-0 bg-transparent p-0 cursor-pointer text-[11.5px] font-semibold text-[#E63946] hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-3.5 bg-white rounded-xl border border-dashed border-[#E5E5E5] flex flex-col gap-2.5">
              <input
                type="text"
                value={addrLabel}
                onChange={(e) => setAddrLabel(e.target.value)}
                placeholder="Rótulo (ex: Casa, Trabalho)"
                className="h-10 box-border px-3 border border-[#E5E5E5] rounded-lg bg-[#F7F7F7] text-[13px]"
                style={{ fontFamily: "var(--font-manrope)" }}
              />
              <textarea
                value={addrText}
                onChange={(e) => setAddrText(e.target.value)}
                placeholder="Endereço completo (rua, número, bairro, cidade, CEP)"
                rows={2}
                className="box-border px-3 py-2 border border-[#E5E5E5] rounded-lg bg-[#F7F7F7] text-[13px] resize-none"
                style={{ fontFamily: "var(--font-manrope)" }}
              />
              <button
                type="button"
                onClick={addAddress}
                disabled={!addrLabel.trim() || !addrText.trim() || savingAddr}
                className="h-9 rounded-lg border-0 bg-ne-green text-white cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12.5 }}
              >
                <Plus size={14} />
                Adicionar Endereço
              </button>
            </div>
          </div>
        </div>

        {/* security note */}
        <div className="px-4 pt-6">
          <div className="flex items-start gap-2 py-3 px-3.5 rounded-xl bg-[#FFF8DC]">
            <Lock size={14} className="flex-none mt-0.5" color="#8A7A2E" />
            <span className="text-[11.5px] text-[#8A7A2E] leading-snug">
              Suas informações são protegidas e usadas apenas para melhorar sua experiência de compra.
            </span>
          </div>
        </div>
      </div>

      {/* sticky footer */}
      <div className="absolute left-0 right-0 bottom-0 z-31 box-border px-4 py-3 bg-white border-t border-[#EDEFED] flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 h-[50px] rounded-2xl border border-[#E63946]/40 bg-white cursor-pointer hover:bg-[#FFF1F1] transition-colors"
          style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#E63946" }}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!canSave}
          className="flowbtn flowbtn-green flex-1 h-[50px] rounded-2xl bg-white"
        >
          <span className="flowbtn-arrow right" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
          <span className="flowbtn-circle" aria-hidden="true" />
          <span className="flowbtn-text flex items-center gap-2">
            {saving && <span className="w-3.5 h-3.5 rounded-full border-2 border-current/30 border-t-current" style={{ animation: "ne-spin .7s linear infinite" }} />}
            {saving ? "Salvando..." : "Salvar"}
          </span>
        </button>
      </div>

      {/* photo bottom sheet */}
      {sheetOpen && (
        <>
          <div className="absolute inset-0 z-40 bg-black/45" style={{ animation: "ne-veil .2s ease-out" }} onClick={closeSheet} />
          <div
            className="absolute left-0 right-0 bottom-0 z-41 rounded-t-3xl bg-white px-4 pt-3 pb-8 box-border"
            style={{ animation: "ne-sheet .28s cubic-bezier(.22,1,.36,1)" }}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#E5E5E5]" />
            <div className="mb-3 px-1" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15, color: "#012418" }}>
              Foto de Perfil
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={takePhoto}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#F4F6F4] cursor-pointer hover:bg-[#E9EDE9] transition-colors text-left"
              >
                <Camera size={18} color="#012418" strokeWidth={2} />
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}>Tirar Foto</span>
              </button>
              <button
                type="button"
                onClick={pickGallery}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#F4F6F4] cursor-pointer hover:bg-[#E9EDE9] transition-colors text-left"
              >
                <ImagePlaceholder className="w-[18px] h-[18px] flex-none" iconSize={14} />
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}>Escolher da Galeria</span>
              </button>
              {hasPhoto && (
                <button
                  type="button"
                  onClick={onDeletePhoto}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-colors text-left"
                  style={{ background: confirmDelete ? "#FFE5E5" : "#FFF1F1" }}
                >
                  <Trash2 size={18} color="#E63946" strokeWidth={2} />
                  <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#E63946" }}>
                    {confirmDelete ? "Confirmar exclusão?" : "Deletar Foto"}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={closeSheet}
                className="mt-1 flex items-center justify-center px-4 py-3.5 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer hover:bg-[#F5F5F5] transition-colors"
              >
                <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}>Cancelar</span>
              </button>
            </div>
          </div>
        </>
      )}

      <Toast bottom={120} />
    </>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, color: "#012418" }}>{label}</label>
      <input
        className="ne-in"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{
          height: 50,
          boxSizing: "border-box",
          padding: "0 16px",
          border: `1px solid ${error ? "#E63946" : "#F0F0F0"}`,
          borderRadius: 12,
          background: "#F7F7F7",
          fontFamily: "var(--font-manrope)",
          fontSize: 14,
          color: "#012418",
          width: "100%",
        }}
      />
      {error && <span className="flex items-center gap-1 text-[11px] text-[#E63946]">⚠ {error}</span>}
    </div>
  );
}
