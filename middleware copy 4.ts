// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = [
  "/", "/login", "/register", "/forgot-password",
  "/reset-password", "/about", "/contact", "/help",
];

// Rotas protegidas com prefixos dinâmicos
const protectedPrefixes = [
  "/dashboard",
  "/services",
  "/profile",
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("token")?.value;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedPrefixes.some(prefix =>
    pathname.startsWith(prefix)
  );

  // ✅ 1. Se for rota pública → libera SEM token
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // ✅ 2. Se for rota protegida e não tiver token → login
  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ 3. Se tiver token → validar expiração
  if (authToken) {
    try {
      const decoded: any = jwtDecode(authToken);
      const expired = decoded.exp * 1000 < Date.now();

      if (expired) {
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.delete("token");
        return res;
      }

      // Se logado e tenta ir para login/register → manda para dashboard
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
