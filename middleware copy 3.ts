// import { NextRequest, NextResponse } from "next/server";
// import { jwtDecode } from "jwt-decode";

// const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/about", "/contact", "/help"];

// export default function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const authToken = request.cookies.get("token")?.value;

//   const isPublicRoute = publicRoutes.some(route => pathname === route);

//   // 1️⃣ Rota pública e sem token → segue
//   if (!authToken && isPublicRoute) {
//     return NextResponse.next();
//   }

//   // 2️⃣ Rota protegida sem token → login
//   if (!authToken && !isPublicRoute) {
//     const url = request.nextUrl.clone();
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   // 3️⃣ Token existe → validar expiração sem servidor
//   if (authToken) {
//     try {
//       const decoded: any = jwtDecode(authToken);
//       const expired = decoded.exp * 1000 < Date.now();

//       if (expired) {
//         const res = NextResponse.redirect(new URL("/login", request.url));
//         res.cookies.delete("token");
//         return res;
//       }

//       // 4️⃣ Se token válido e tentando ir para login/register → manda para dashboard
//       if (isPublicRoute && ["/login", "/register"].includes(pathname)) {
//         const url = request.nextUrl.clone();
//         url.pathname = "/dashboard";
//         return NextResponse.redirect(url);
//       }
//     } catch (err) {
//       // Token malformado → tratar como inválido
//       const res = NextResponse.redirect(new URL("/login", request.url));
//       res.cookies.delete("token");
//       return res;
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico)$).*)",
  ],
}