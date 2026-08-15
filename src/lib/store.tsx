"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS } from "./data";

type CartItem = { id: string; qty: number };

type ToastState = { id: number; message: string } | null;

type AppState = {
  cart: CartItem[];
  favorites: Record<string, boolean>;
  toast: ToastState;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  flash: (message: string) => void;
  cartCount: number;
  cartTotal: number;
};

const AppContext = createContext<AppState | null>(null);

export function AppProviders({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([
    { id: "p1", qty: 2 },
    { id: "p4", qty: 1 },
    { id: "p3", qty: 1 },
  ]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ p5: true });
  const [toast, setToast] = useState<ToastState>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastId = useRef(0);

  const flash = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastId.current += 1;
    setToast({ id: toastId.current, message });
    toastTimer.current = setTimeout(() => setToast(null), 2100);
  }, []);

  const addToCart = useCallback(
    (id: string, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === id);
        if (existing) {
          return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
        }
        return [...prev, { id, qty }];
      });
      const p = PRODUCTS.find((x) => x.id === id);
      if (p) flash(p.name.split(" ").slice(0, 3).join(" ") + " no carrinho");
    },
    [flash]
  );

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const on = !prev[id];
        const p = PRODUCTS.find((x) => x.id === id);
        if (p) flash(on ? "Salvo nos favoritos" : "Removido dos favoritos");
        return { ...prev, [id]: on };
      });
    },
    [flash]
  );

  const isFavorite = useCallback((id: string) => !!favorites[id], [favorites]);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartTotal = useMemo(
    () =>
      cart.reduce((s, i) => {
        const p = PRODUCTS.find((x) => x.id === i.id);
        return s + (p ? p.price * i.qty : 0);
      }, 0),
    [cart]
  );

  const value: AppState = {
    cart,
    favorites,
    toast,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    toggleFavorite,
    isFavorite,
    flash,
    cartCount,
    cartTotal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProviders");
  return ctx;
}

export function useCartItems() {
  const { cart } = useApp();
  return useMemo(
    () =>
      cart
        .map((i) => {
          const product = PRODUCTS.find((p) => p.id === i.id);
          return product ? { ...i, product } : null;
        })
        .filter((x): x is { id: string; qty: number; product: (typeof PRODUCTS)[number] } => !!x),
    [cart]
  );
}
