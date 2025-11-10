// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import axios from "axios"

// // Rotas que requerem autenticação
// const protectedRoutes = [
//   "/dashboard",
//   "/profile",
//   "/services/freight",
//   "/services/find-freight",
//   "/services/register-vehicle",
//   "/services/quotes",
//   "/services/reports",
//   "/services/my-freights",
//   "/services/financial",
// ]

// // Rotas públicas que usuários autenticados não devem acessar
// const authRoutes = ["/login", "/register"]

// export async function middleware(request: NextRequest) {
//   const response = NextResponse.next()
//   const currentPath = request.nextUrl.pathname

//   const token = request.cookies.get("token")?.value
//   let isAuthenticated = false
//   let profile: "CLIENT" | "TRANSPORTER" | "ADMIN" | null = null

//   if (token) {
//     try {
//       const apiRes = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auth/me`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )
//       isAuthenticated = apiRes.status === 200
//       profile = apiRes.data?.profile ?? null
//     } catch (err) {
//       isAuthenticated = false
//       // 🔑 Se o token for inválido, remove cookie para evitar loop infinito
//       const res = NextResponse.redirect(new URL("/login", request.url))
//       res.cookies.delete("token")
//       return res
//     }
//   }

//   // 🔒 Usuário autenticado tentando acessar login/register → manda para dashboard certo
//   if (isAuthenticated && authRoutes.some((route) => currentPath.startsWith(route))) {
//     let dashboardPath = "/dashboard"

//     if (profile === "CLIENT") dashboardPath = "/dashboard/client"
//     if (profile === "TRANSPORTER") dashboardPath = "/dashboard/transporter"
//     if (profile === "ADMIN") dashboardPath = "/dashboard/admin"

//     if (currentPath !== dashboardPath) {
//       return NextResponse.redirect(new URL(dashboardPath, request.url))
//     }
//   }

//   // 🔑 Usuário não autenticado tentando acessar rota protegida
//   if (!isAuthenticated && protectedRoutes.some((route) => currentPath.startsWith(route))) {
//     const loginUrl = new URL("/login", request.url)
//     loginUrl.searchParams.set("redirectTo", currentPath + request.nextUrl.search)
//     return NextResponse.redirect(loginUrl)
//   }

//   return response
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// }
