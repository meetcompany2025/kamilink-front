// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// const protectedRoutes = [
//   "/dashboard",
//   "/profile",
//   "/services",
// ]

// const authRoutes = ["/login", "/register"]

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value
//   const currentPath = request.nextUrl.pathname

//   let isAuthenticated = false
//   let profile: "CLIENT" | "TRANSPORTER" | "ADMIN" | null = null

//   if (token) {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL || "https://ancient-gabbi-meetcompany2025-27e3795c.koyeb.app"}/auth/me`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           credentials: "include",
//         }
//       )

//       if (res.ok) {
//         const data = await res.json()
//         isAuthenticated = true
//         profile = data?.profile ?? null
//       } else {
//         // Token inválido → limpar cookie e mandar p/ login
//         const response = NextResponse.redirect(new URL("/login", request.url))
//         response.cookies.delete("token")
//         return response
//       }
//     } catch (error) {
//       const response = NextResponse.redirect(new URL("/login", request.url))
//       response.cookies.delete("token")
//       return response
//     }
//   }

//   // ✅ Se autenticado e acessando login/register → redireciona
//   if (isAuthenticated && authRoutes.includes(currentPath)) {
//     const target =
//       profile === "CLIENT"
//         ? "/dashboard/client"
//         : profile === "TRANSPORTER"
//         ? "/dashboard/transporter"
//         : "/dashboard/admin"

//     return NextResponse.redirect(new URL(target, request.url))
//   }

//   // ✅ Se NÃO autenticado e tentando acessar rota protegida → manda p/ login
//   if (!isAuthenticated && protectedRoutes.some((route) => currentPath.startsWith(route))) {
//     const loginUrl = new URL("/login", request.url)
//     loginUrl.searchParams.set("redirectTo", currentPath + request.nextUrl.search)
//     return NextResponse.redirect(loginUrl)
//   }

//   return NextResponse.next()
// }

// // export const config = {
// //   matcher: [
// //     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
// //   ],
// // }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico)!.*)',
//   ],
// }
