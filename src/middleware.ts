import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  // Se já autenticado, evitar exibir páginas de login/cadastro
  if (token && (pathname === "/login" || pathname === "/cadastro")) {
    const to = new URL("/", req.url)
    return NextResponse.redirect(to)
  }

  // Proteger rotas principais, fichas e área de conta
  const isProtected = pathname === "/" || pathname.startsWith("/fichas") || pathname.startsWith("/auth")
  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/fichas/:path*", "/auth/:path*", "/login", "/cadastro"],
}