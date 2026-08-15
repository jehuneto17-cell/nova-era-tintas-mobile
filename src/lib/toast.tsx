"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type ToastState = { id: number; message: string } | null;

type ToastValue = {
  toast: ToastState;
  flash: (message: string) => void;
};

const ToastContext = createContext<ToastValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastId = useRef(0);

  const flash = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastId.current += 1;
    setToast({ id: toastId.current, message });
    toastTimer.current = setTimeout(() => setToast(null), 2100);
  }, []);

  return <ToastContext.Provider value={{ toast, flash }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
