import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MOBILE_UA = /Android|iPhone|iPad/i;
// só nos domínios de produção: localhost e *.vercel.app continuam abrindo o app no desktop
const PROD_HOSTS = ["novaeratintas.store", "www.novaeratintas.store"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const ua = request.headers.get("user-agent") ?? "";

  if (!PROD_HOSTS.includes(host) || MOBILE_UA.test(ua)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL(pathname + search, "https://loja.novaeratintas.store"));
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
