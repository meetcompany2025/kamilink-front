// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/contact",
  "/services/main",
  "/help",
];

// ✅ Qualquer rota que COMEÇA com esses prefixos será privada
const protectedPrefixes = [
  "/dashboard",
  "/services",  // Isto cobre /services/x, /services/client/123, etc.
  "/profile",
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("token")?.value;

  // ✅ Verifica se a rota é pública (exata)
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // ✅ Verifica se a rota é protegida (prefixo, pega também rotas dinâmicas)
  const isProtectedRoute = protectedPrefixes.some(prefix =>
    pathname.startsWith(prefix) || pathname === prefix+"/"
  );

  // ✅ Se rota pública → deixa passar SEM token
  if (isPublicRoute) return NextResponse.next();

  // ✅ Se rota protegida e não tem token → redireciona login
  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Se tem token → validar expiração e tratar redirecionamentos
  if (authToken) {
    try {
      const decoded: any = jwtDecode(authToken);
      const expired = decoded.exp * 1000 < Date.now();

      if (expired) {
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.delete("token");
        res.cookies.delete("refresh_token");
        return res;
      }

      // Se logado e tentar ir para login ou register → mandar para dashboard
      if (["/login", "/register"].includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (err) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico)$).*)",
  ],
};
