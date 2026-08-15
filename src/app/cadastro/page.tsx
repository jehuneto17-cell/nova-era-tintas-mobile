"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { SuccessConfetti } from "@/components/SuccessConfetti";
import { useAuth } from "@/lib/auth";
import { maskPhone } from "@/lib/utils";

const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function mapFirebaseAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  if (code === "auth/email-already-in-use") return "Email já cadastrado";
  if (code === "auth/invalid-email") return "Email inválido";
  if (code === "auth/weak-password") return "Senha muito fraca";
  return "Não foi possível criar a conta. Tente novamente";
}

type FieldKey = "name" | "email" | "phone" | "password" | "confirm";

export default function CadastroPage() {
  const router = useRouter();
  const { cadastrar } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string | null>>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [focused, setFocused] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [success, setSuccess] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLogoLoading(false), 400);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => () => { if (navTimer.current) clearTimeout(navTimer.current); }, []);

  const validateName = (v: string) => (!v.trim() ? "Nome é obrigatório" : v.trim().length < 3 ? "Mínimo 3 caracteres" : null);
  const validateEmail = (v: string) => (!v.trim() ? "Email é obrigatório" : !validEmail(v) ? "Email inválido" : null);
  const validatePhone = (v: string) => (v.replace(/\D/g, "").length < 10 ? "Telefone inválido" : null);
  const validatePwd = (v: string) => (!v ? "Senha é obrigatória" : v.length < 6 ? "Mínimo 6 caracteres" : null);
  const validateConfirm = (v: string, pwd: string) => (!v ? "Confirme sua senha" : v !== pwd ? "As senhas não coincidem" : null);

  const goHome = () => {
    navTimer.current = setTimeout(() => router.push("/"), 3500);
  };

  const submit = async () => {
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const pwdErr = validatePwd(password);
    const confirmErr = validateConfirm(confirm, password);
    setErrors({ name: nameErr, email: emailErr, phone: phoneErr, password: pwdErr, confirm: confirmErr });

    if (!terms) {
      setTermsError("Você precisa aceitar os termos para continuar");
    } else {
      setTermsError(null);
    }

    if (nameErr || emailErr || phoneErr || pwdErr || confirmErr || !terms) return;

    setLoading(true);
    setAuthError(null);
    try {
      await cadastrar(name.trim(), email.trim(), password, phone);
      setLoading(false);
      setSuccess(true);
      goHome();
    } catch (err) {
      setLoading(false);
      setAuthError(mapFirebaseAuthError(err));
    }
  };

  const socialLogin = () => {
    setLoading(true);
    setAuthError(null);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      goHome();
    }, 1200);
  };

  const disabled = loading;
  const bg = (k: FieldKey) => (errors[k] ? "#FFFFFF" : focused[k] ? "#FFFFFF" : "#F7F7F7");
  const border = (k: FieldKey) => (errors[k] ? "#E63946" : focused[k] ? "#00B20B" : "#F0F0F0");

  return (
    <div className="absolute inset-0 bg-white">
      <button
        type="button"
        onClick={() => router.push("/entrada")}
        className="absolute top-4 left-4 z-33 w-9 h-9 rounded-full bg-[#F5F5F5] cursor-pointer flex items-center justify-center hover:bg-[#EDEFED] transition-colors"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#012418" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div
        className="ne-scroll absolute inset-x-0 top-0 bottom-0 transition-all duration-300"
        style={{ opacity: success ? 0.35 : 1, filter: success ? "blur(2px)" : "blur(0px)" }}
      >
        <div className="min-h-[844px] box-border px-6 pt-8 pb-10 flex flex-col justify-center">
          <div className="flex flex-col items-center mb-6">
            {logoLoading ? (
              <div className="w-[100px] h-[100px] rounded-[20px] bg-[#012418] mb-6" style={{ animation: "ne-pulse 1.1s ease-in-out infinite" }} />
            ) : (
              <div className="w-[100px] h-[100px] rounded-[20px] overflow-hidden bg-[#012418] mb-6" style={{ animation: "ne-rise .3s ease-out both" }}>
                <ImagePlaceholder label="Logo Nova Era Tintas" />
              </div>
            )}
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 22, lineHeight: 1.3, letterSpacing: "-0.02em", color: "#012418" }}>
              Criar conta
            </div>
            <div className="mt-1.5 text-[13px] text-[#999999] text-center">Cadastre-se para começar a comprar</div>
          </div>

          <div className="flex gap-3 mb-5">
            <SocialButton label="Google" disabled={disabled} onClick={socialLogin} icon={<GoogleIcon />} />
            <SocialButton label="Apple" disabled={disabled} onClick={socialLogin} icon={<AppleIcon />} />
          </div>

          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex-1 h-px bg-[#E5E5E5]" />
            <span className="text-xs text-[#999999]">ou continue com</span>
            <div className="flex-1 h-px bg-[#E5E5E5]" />
          </div>

          {authError && (
            <div className="mb-4 py-3 px-3.5 rounded-md bg-[#FFE5E5] border-l-[3px] border-[#E63946] flex items-start gap-2">
              <span className="flex-none text-[#E63946] text-sm leading-tight">⚠</span>
              <span className="text-[13px] text-[#E63946] leading-snug">{authError}</span>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <Field
              label="Nome Completo"
              type="text"
              value={name}
              onChange={(v) => {
                setName(v);
                setErrors((s) => ({ ...s, name: undefined }));
              }}
              onFocus={() => setFocused((s) => ({ ...s, name: true }))}
              onBlur={() => {
                setFocused((s) => ({ ...s, name: false }));
                setErrors((s) => ({ ...s, name: validateName(name) }));
              }}
              disabled={disabled}
              placeholder="Seu nome completo"
              error={errors.name}
              bg={bg("name")}
              border={border("name")}
            />

            <Field
              label="Email"
              type="email"
              value={email}
              onChange={(v) => {
                setEmail(v);
                setErrors((s) => ({ ...s, email: undefined }));
                setAuthError(null);
              }}
              onFocus={() => setFocused((s) => ({ ...s, email: true }))}
              onBlur={() => {
                setFocused((s) => ({ ...s, email: false }));
                setErrors((s) => ({ ...s, email: validateEmail(email) }));
              }}
              disabled={disabled}
              placeholder="seu@email.com"
              error={errors.email}
              bg={bg("email")}
              border={border("email")}
            />

            <Field
              label="Telefone"
              type="tel"
              value={phone}
              onChange={(v) => {
                setPhone(maskPhone(v));
                setErrors((s) => ({ ...s, phone: undefined }));
              }}
              onFocus={() => setFocused((s) => ({ ...s, phone: true }))}
              onBlur={() => {
                setFocused((s) => ({ ...s, phone: false }));
                setErrors((s) => ({ ...s, phone: validatePhone(phone) }));
              }}
              disabled={disabled}
              placeholder="(00) 00000-0000"
              error={errors.phone}
              bg={bg("phone")}
              border={border("phone")}
            />

            <PasswordField
              label="Senha"
              value={password}
              show={showPwd}
              onToggleShow={() => setShowPwd((s) => !s)}
              onChange={(v) => {
                setPassword(v);
                setErrors((s) => ({ ...s, password: undefined }));
              }}
              onFocus={() => setFocused((s) => ({ ...s, password: true }))}
              onBlur={() => {
                setFocused((s) => ({ ...s, password: false }));
                setErrors((s) => ({ ...s, password: validatePwd(password) }));
              }}
              disabled={disabled}
              placeholder="••••••••"
              error={errors.password}
              bg={bg("password")}
              border={border("password")}
            />

            <PasswordField
              label="Confirmar Senha"
              value={confirm}
              show={showConfirm}
              onToggleShow={() => setShowConfirm((s) => !s)}
              onChange={(v) => {
                setConfirm(v);
                setErrors((s) => ({ ...s, confirm: undefined }));
              }}
              onFocus={() => setFocused((s) => ({ ...s, confirm: true }))}
              onBlur={() => {
                setFocused((s) => ({ ...s, confirm: false }));
                setErrors((s) => ({ ...s, confirm: validateConfirm(confirm, password) }));
              }}
              disabled={disabled}
              placeholder="••••••••"
              error={errors.confirm}
              bg={bg("confirm")}
              border={border("confirm")}
            />

            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => {
                  setTerms((s) => !s);
                  setTermsError(null);
                }}
                disabled={disabled}
                className="flex items-center gap-2.5 border-0 bg-transparent p-0 cursor-pointer text-left"
              >
                <span
                  className="flex-none w-8 h-[19px] rounded-full relative transition-colors"
                  style={{ background: terms ? "#00B20B" : "#D8DED9" }}
                >
                  <span
                    className="absolute top-0.5 w-[15px] h-[15px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.25)] transition-all"
                    style={{ left: terms ? 15 : 2 }}
                  />
                </span>
                <span className="text-[13px] text-[#999999] leading-snug">
                  Eu li e aceito os{" "}
                  <span className="text-ne-blue font-semibold">Termos de Serviço</span> e a{" "}
                  <span className="text-ne-blue font-semibold">Política de Privacidade</span>
                </span>
              </button>
              {termsError && <span className="flex items-center gap-1 text-[11px] text-[#E63946]">⚠ {termsError}</span>}
            </div>

            <div className="flex items-start gap-2 py-2 px-3 rounded-md bg-[#FFF8DC]">
              <Lock size={12} className="flex-none mt-0.5" color="#8A7A2E" />
              <span className="text-[11px] text-[#8A7A2E] leading-snug">Nunca pedimos sua senha por email ou mensagem</span>
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={disabled}
              className="w-full h-[52px] border-0 rounded-[26px] text-white flex items-center justify-center gap-2.5 transition-colors active:scale-[.98]"
              style={{
                background: "#00941F",
                fontFamily: "var(--font-archivo)",
                fontWeight: 700,
                fontSize: 16,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
              }}
            >
              {loading && <span className="w-4 h-4 rounded-full border-[2.5px] border-white/35 border-t-white" style={{ animation: "ne-spin .7s linear infinite" }} />}
              <span>{loading ? "Criando conta..." : "Criar conta"}</span>
            </button>

            <div className="text-center mt-2 text-[13px] text-[#999999]">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="border-0 bg-transparent p-0 cursor-pointer text-ne-blue hover:underline"
                style={{ fontFamily: "var(--font-manrope)", fontWeight: 700, fontSize: 13 }}
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {success && <SuccessConfetti message="Conta criada!" sub="Bem-vindo à Nova Era Tintas!" seed={33} />}
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled,
  placeholder,
  error,
  bg,
  border,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  disabled: boolean;
  placeholder: string;
  error?: string | null;
  bg: string;
  border: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, color: "#012418" }}>{label}</label>
      <input
        className="ne-in"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          height: 52,
          boxSizing: "border-box",
          padding: "0 16px",
          border: `1px solid ${border}`,
          borderRadius: 12,
          background: bg,
          fontFamily: "var(--font-manrope)",
          fontSize: 14,
          color: "#012418",
        }}
      />
      {error && <span className="flex items-center gap-1 text-[11px] text-[#E63946]">⚠ {error}</span>}
    </div>
  );
}

function PasswordField({
  label,
  value,
  show,
  onToggleShow,
  onChange,
  onFocus,
  onBlur,
  disabled,
  placeholder,
  error,
  bg,
  border,
}: {
  label: string;
  value: string;
  show: boolean;
  onToggleShow: () => void;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  disabled: boolean;
  placeholder: string;
  error?: string | null;
  bg: string;
  border: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, color: "#012418" }}>{label}</label>
      <div className="relative">
        <input
          className="ne-in"
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          style={{
            width: "100%",
            height: 52,
            boxSizing: "border-box",
            padding: "0 44px 0 16px",
            border: `1px solid ${border}`,
            borderRadius: 12,
            background: bg,
            fontFamily: "var(--font-manrope)",
            fontSize: 14,
            color: "#012418",
          }}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-0 h-[52px] border-0 bg-transparent p-0 cursor-pointer text-[#999999] flex items-center"
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
      {error && <span className="flex items-center gap-1 text-[11px] text-[#E63946]">⚠ {error}</span>}
    </div>
  );
}

function SocialButton({ label, icon, disabled, onClick }: { label: string; icon: React.ReactNode; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 h-12 border border-[#E5E5E5] rounded-xl bg-white text-[#012418] cursor-pointer flex items-center justify-center gap-2.5 hover:bg-[#F7F7F7] transition-colors"
      style={{ fontFamily: "var(--font-manrope)", fontWeight: 600, fontSize: 14 }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#000000">
      <path d="M16.365 1.43c0 1.14-.415 2.16-1.242 3.084-1.006 1.107-2.278 1.744-3.63 1.634-.045-1.09.418-2.19 1.216-3.02.797-.834 2.128-1.55 3.656-1.698zM20.13 17.16c-.29.646-.62 1.242-.997 1.792-1.34 2.01-2.812 2.86-4.09 2.884-1.03.02-1.35-.65-2.808-.65-1.458 0-1.83.63-2.79.673-1.28.05-2.68-.876-4.028-2.892-2.03-3-3.16-8.475-1.328-11.94.933-1.766 2.6-2.882 4.44-2.912 1.128-.02 2.19.756 2.9.756.71 0 2.02-.934 3.404-.798.58.024 2.21.234 3.34 1.77-.086.054-1.994 1.164-1.97 3.474.024 2.76 2.425 3.68 2.454 3.694-.02.06-.38 1.31-1.267 2.65z" />
    </svg>
  );
}
