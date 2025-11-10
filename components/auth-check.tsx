"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

// Lista de rotas protegidas
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/services/freight",
  "/services/find-freight",
  "/services/register-vehicle",
  "/services/quotes",
  "/services/reports",
]

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar se a rota atual está na lista de rotas protegidas
    const isProtectedRoute = protectedRoutes.some((route) => pathname?.startsWith(route))

    // Se for uma rota protegida e o usuário não estiver autenticado, redirecionar para a página de login
    if (!isLoading && !user && isProtectedRoute) {
      router.push(`/login?redirectTo=${pathname}`)
    }
  }, [user, isLoading, router, pathname])

  return <>{children}</>
}
