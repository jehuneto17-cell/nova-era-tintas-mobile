"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2x2, ShoppingBag, Heart, User } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/categorias", icon: Grid2x2, label: "Categorias" },
  { href: "/carrinho", icon: ShoppingBag, label: "Carrinho" },
  { href: "/favoritos", icon: Heart, label: "Favoritos" },
  { href: "/perfil", icon: User, label: "Perfil" },
] as const;

export function TabBar() {
  const pathname = usePathname();
  const { cartCount } = useApp();

  return (
    <nav
      aria-label="Navegação principal"
      className="absolute bottom-0 left-0 right-0 z-29 h-[72px] border-t border-[#E5E5E5] bg-white flex items-stretch"
    >
      {tabs.map(({ href, icon: Icon, label }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1.5 transition-colors duration-200",
              isActive ? "text-ne-green" : "text-[#999999] hover:text-[#012418]"
            )}
            style={{ fontFamily: "var(--font-manrope)", fontSize: 11, fontWeight: isActive ? 700 : 500 }}
          >
            <span className="relative block w-[22px] h-[22px]">
              <Icon size={22} strokeWidth={isActive ? 2.2 : 2} />
              {href === "/carrinho" && cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-1 box-border rounded-full border-2 border-white bg-ne-green text-white flex items-center justify-center"
                  style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 9 }}
                >
                  {cartCount}
                </span>
              )}
            </span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
