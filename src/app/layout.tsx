import type { Metadata, Viewport } from "next";
import { Archivo, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/lib/toast";
import { SplashGate } from "@/components/SplashGate";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nova Era Tintas",
  description: "Tintas, pincéis, rolos e acabamentos — Nova Era Tintas",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nova Era Tintas",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#012418",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${manrope.variable}`}>
      <body>
        <AuthProvider>
          <StoreProvider>
            <ToastProvider>
              <div className="ne-viewport">
                <div className="ne-phone">
                  <SplashGate>{children}</SplashGate>
                </div>
              </div>
            </ToastProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
