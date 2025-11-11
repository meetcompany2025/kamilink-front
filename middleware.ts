import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtDecode } from "jwt-decode"

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/privacy",
  "/about",
  "/services/main",
  "/help",
  "/terms",
]

// 🔹 Verifica se a rota é privada (inclusive dinâmicas)
function isProtectedRoute(pathname: string) {
  if (publicRoutes.some(route => pathname.startsWith(route))) return false

  // Qualquer coisa dentro de /dashboard, /services, /profile, etc é privada
  const privatePrefixes = ["/dashboard", "/services", "/profile", "/admin"]
  return privatePrefixes.some(prefix => pathname.startsWith(prefix))
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value

  if (isProtectedRoute(pathname)) {
    if (!token) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("redirectTo", pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      jwtDecode(token) // apenas valida formato básico
    } catch {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("redirectTo", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
}

//  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico)$).*)",
