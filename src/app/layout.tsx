import type { Metadata, Viewport } from "next";
import { Archivo, Manrope } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/lib/store";

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
        <AppProviders>
          <div className="ne-viewport">
            <div className="ne-phone">{children}</div>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
