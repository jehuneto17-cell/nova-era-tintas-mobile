"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Check,
  User,
  Package,
  Settings,
  FileText,
  ChevronRight,
  Share2,
  Mail,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { useBranding, useLoja } from "@/lib/hooks";
import { TabBar } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const MENU = [
  { id: "perfil", icon: User, label: "Meu Perfil" },
  { id: "pedidos", icon: Package, label: "Meus Pedidos" },
  { id: "config", icon: Settings, label: "Configurações" },
  { id: "redes", icon: Share2, label: "Nossas redes sociais" },
  { id: "termos", icon: FileText, label: "Termos & Privacidade" },
] as const;

const INSTAGRAM_URL = "https://www.instagram.com/novaeratintas";
const FACEBOOK_URL = "https://www.facebook.com/nova.era.336717";
const MAPS_URL = "https://www.google.com/maps/place/Nova+Era+Tintas/@-20.7462876,-46.7563641,17z/data=!3m1!4b1!4m6!3m5!1s0x94b6df1b0eac9e03:0x2c541f24ce949d26!8m2!3d-20.7462876!4d-46.7563641!16s%2Fg%2F11hz5vdqjx";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function whatsappUrl(whatsapp: string) {
  const digits = onlyDigits(whatsapp);
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}`;
}

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#012418" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="#012418">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}

export default function PerfilPage() {
  const router = useRouter();
  const { flash } = useToast();
  const { user, cliente, loading: authLoading, logout } = useAuth();
  const branding = useBranding();
  const loja = useLoja();
  const [showLogout, setShowLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showRedes, setShowRedes] = useState(false);
  const [showTermos, setShowTermos] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/entrada");
  }, [authLoading, user, router]);

  const onMenuClick = (id: string) => {
    if (id === "pedidos") {
      router.push("/pedidos");
      return;
    }
    if (id === "perfil") {
      flash("Você já está no seu perfil");
      return;
    }
    if (id === "config") {
      router.push("/perfil/editar");
      return;
    }
    if (id === "redes") {
      setShowRedes(true);
      return;
    }
    if (id === "termos") {
      setShowTermos(true);
      return;
    }
  };

  const goDelayed = (path: string) => {
    setTimeout(() => router.push(path), 800);
  };

  const openLogout = () => {
    setTimeout(() => setShowLogout(true), 800);
  };

  const confirmLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    setShowLogout(false);
    flash("Você saiu da sua conta");
    router.push("/entrada");
  };

  return (
    <>
      <div className="ne-scroll absolute inset-0 bg-[#F7F8F7] pb-[88px]">
        {/* hero */}
        <div
          className="relative"
          style={{
            height: 210,
            background: "#00B20B",
            borderRadius: "0 0 50% 50% / 0 0 46px 46px",
          }}
        >
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[46px]">
            <button
              type="button"
              onClick={() => flash("Menu em breve")}
              className="w-10 h-10 rounded-xl bg-white/15 cursor-pointer flex items-center justify-center hover:bg-white/25 transition-colors"
            >
              <Menu size={19} color="#FFFFFF" strokeWidth={2.2} />
            </button>
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 17, color: "#FFFFFF" }}>Meu Perfil</div>
            <button
              type="button"
              onClick={() => router.push("/perfil/editar")}
              className="px-3 py-1.5 rounded-full bg-white/15 cursor-pointer hover:bg-white/25 transition-colors"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12.5, color: "#FFFFFF" }}
            >
              Editar
            </button>
          </div>
        </div>

        {/* avatar overlap */}
        <div className="relative -mt-[76px] flex flex-col items-center px-4">
          <div className="relative">
            <div
              className="w-[140px] h-[140px] rounded-full overflow-hidden bg-[#F1F3F1] box-content"
              style={{ border: "5px solid #FFFFFF", boxShadow: "0 8px 24px rgba(1,36,24,.18)" }}
            >
              {cliente?.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cliente.fotoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <ImagePlaceholder shape="circle" label="Foto de perfil" iconSize={32} />
              )}
            </div>
            <div
              className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-ne-green border-[3px] border-white flex items-center justify-center"
              style={{ boxShadow: "0 2px 6px rgba(0,0,0,.2)" }}
            >
              <Check size={13} color="#FFFFFF" strokeWidth={3} />
            </div>
          </div>
          <div className="mt-3.5 text-center" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 19, letterSpacing: "-0.01em", color: "#012418" }}>
            {cliente?.nome || "—"}
          </div>
          <div className="mt-1 text-[13px] font-medium text-[#999999]">{user?.email || "—"}</div>
        </div>

        {/* menu list */}
        <div className="px-4 pt-6 flex flex-col gap-2.5">
          {MENU.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onMenuClick(m.id)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#F4F6F4] cursor-pointer hover:bg-[#E9EDE9] transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-white flex-none flex items-center justify-center">
                  <Icon size={17} color="#012418" strokeWidth={2} />
                </div>
                <span className="flex-1 min-w-0" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>
                  {m.label}
                </span>
                <ChevronRight size={17} color="#999999" strokeWidth={2.2} />
              </button>
            );
          })}
        </div>

        {/* flow buttons */}
        <div className="px-4 pt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => goDelayed("/pedidos")}
            className="flowbtn flowbtn-blue h-12 rounded-2xl bg-white"
          >
            <span className="flowbtn-arrow left" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
            <span className="flowbtn-circle" aria-hidden="true" />
            <span className="flowbtn-text">Meus Pedidos</span>
            <span className="flowbtn-arrow right" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </button>

          <button
            type="button"
            onClick={openLogout}
            className="flowbtn flowbtn-red h-12 rounded-2xl bg-white"
          >
            <span className="flowbtn-arrow left" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
            <span className="flowbtn-circle" aria-hidden="true" />
            <span className="flowbtn-text">Sair</span>
            <span className="flowbtn-arrow right" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </button>
        </div>

        <div className="pt-6 pb-1 text-center text-[11.5px] font-medium text-[#999999]">Versão do app: 1.0.0</div>
        <div className="pb-4 text-center text-[11px] font-medium text-[#999999]">
          Desenvolvido por{" "}
          <a
            href="https://www.instagram.com/jehu_dev_e.commerce/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ne-green hover:underline"
          >
            @JEHU_DEV_E.COMMERCE
          </a>
        </div>
      </div>

      {/* redes sociais sheet */}
      {showRedes && (
        <>
          <div
            className="absolute inset-0 z-40 bg-black/45"
            style={{ animation: "ne-veil .2s ease-out" }}
            onClick={() => setShowRedes(false)}
          />
          <div
            className="absolute left-0 right-0 bottom-0 z-41 rounded-t-3xl bg-white px-4 pt-3 pb-8 box-border"
            style={{ animation: "ne-sheet .28s cubic-bezier(.22,1,.36,1)" }}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#E5E5E5]" />
            <div className="mb-4 text-center" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, color: "#012418" }}>
              Nossas redes sociais
            </div>

            <div className="flex flex-col gap-2.5">
              {branding?.email && (
                <a
                  href={`mailto:${branding.email}`}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#F4F6F4] hover:bg-[#E9EDE9] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex-none flex items-center justify-center">
                    <Mail size={17} color="#012418" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-medium text-[#999999]">E-mail</div>
                    <div className="truncate" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>
                      {branding.email}
                    </div>
                  </div>
                </a>
              )}

              {branding?.whatsapp && (
                <a
                  href={whatsappUrl(branding.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#F4F6F4] hover:bg-[#E9EDE9] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex-none flex items-center justify-center">
                    <MessageCircle size={17} color="#012418" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-medium text-[#999999]">WhatsApp</div>
                    <div className="truncate" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>
                      {branding.whatsapp}
                    </div>
                  </div>
                </a>
              )}

              {branding?.redes_sociais?.instagram && (
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#F4F6F4] hover:bg-[#E9EDE9] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex-none flex items-center justify-center">
                    <InstagramIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-medium text-[#999999]">Instagram</div>
                    <div className="truncate" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>
                      {branding.redes_sociais.instagram}
                    </div>
                  </div>
                </a>
              )}

              {branding?.redes_sociais?.facebook && (
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#F4F6F4] hover:bg-[#E9EDE9] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex-none flex items-center justify-center">
                    <FacebookIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-medium text-[#999999]">Facebook</div>
                    <div className="truncate" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>
                      {branding.redes_sociais.facebook}
                    </div>
                  </div>
                </a>
              )}

              {loja?.endereco && (
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#F4F6F4] hover:bg-[#E9EDE9] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex-none flex items-center justify-center">
                    <MapPin size={17} color="#012418" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-medium text-[#999999]">Localização</div>
                    <div className="truncate" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>
                      {loja.endereco}
                    </div>
                  </div>
                </a>
              )}

              {!branding?.email && !branding?.whatsapp && !branding?.redes_sociais?.instagram && !branding?.redes_sociais?.facebook && !loja?.endereco && (
                <div className="px-4 py-6 text-center text-[13px] font-medium text-[#999999]">
                  {branding ? "Nenhuma informação de contato disponível." : "Carregando..."}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowRedes(false)}
              className="mt-5 w-full h-11 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer hover:bg-[#F5F5F5] transition-colors"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}
            >
              Fechar
            </button>
          </div>
        </>
      )}

      {/* termos & privacidade sheet */}
      {showTermos && (
        <>
          <div
            className="absolute inset-0 z-40 bg-black/45"
            style={{ animation: "ne-veil .2s ease-out" }}
            onClick={() => setShowTermos(false)}
          />
          <div
            className="absolute left-0 right-0 bottom-0 z-41 rounded-t-3xl bg-white px-4 pt-3 pb-8 box-border"
            style={{ animation: "ne-sheet .28s cubic-bezier(.22,1,.36,1)" }}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#E5E5E5]" />
            <div className="mb-4 text-center" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, color: "#012418" }}>
              Termos &amp; Privacidade
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => router.push("/termos")}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#F4F6F4] cursor-pointer hover:bg-[#E9EDE9] transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-white flex-none flex items-center justify-center">
                  <FileText size={17} color="#012418" strokeWidth={2} />
                </div>
                <span className="flex-1 min-w-0" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>
                  Termos de Serviço
                </span>
                <ChevronRight size={17} color="#999999" strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={() => router.push("/privacidade")}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#F4F6F4] cursor-pointer hover:bg-[#E9EDE9] transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-white flex-none flex items-center justify-center">
                  <FileText size={17} color="#012418" strokeWidth={2} />
                </div>
                <span className="flex-1 min-w-0" style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14, color: "#012418" }}>
                  Política de Privacidade
                </span>
                <ChevronRight size={17} color="#999999" strokeWidth={2.2} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowTermos(false)}
              className="mt-5 w-full h-11 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer hover:bg-[#F5F5F5] transition-colors"
              style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}
            >
              Fechar
            </button>
          </div>
        </>
      )}

      {/* logout modal */}
      {showLogout && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 px-8"
          style={{ animation: "ne-veil .2s ease-out" }}
          onClick={() => !loggingOut && setShowLogout(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[300px] rounded-2xl bg-white p-5"
            style={{ animation: "ne-pop .25s ease-out", boxShadow: "0 20px 50px rgba(0,0,0,.3)" }}
          >
            <div className="text-center" style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 16, color: "#012418" }}>
              Tem certeza que quer sair?
            </div>
            <div className="mt-1.5 text-center text-[12.5px] font-medium text-[#999999]">Você precisará entrar novamente para acessar sua conta.</div>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogout(false)}
                disabled={loggingOut}
                className="flex-1 h-11 rounded-xl border border-[#E5E5E5] bg-white cursor-pointer hover:bg-[#F5F5F5] transition-colors disabled:opacity-50"
                style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5, color: "#012418" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                disabled={loggingOut}
                className="flex-1 h-11 rounded-xl border-0 bg-[#E63946] text-white cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
                style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13.5 }}
              >
                {loggingOut && <span className="w-3.5 h-3.5 rounded-full border-2 border-white/35 border-t-white" style={{ animation: "ne-spin .7s linear infinite" }} />}
                {loggingOut ? "Saindo..." : "Sair"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast bottom={100} />
      <TabBar />
    </>
  );
}
