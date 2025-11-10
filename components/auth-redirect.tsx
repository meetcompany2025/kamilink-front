"use client"

import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"
import React from "react"

interface AuthRedirectProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthRedirect({ children, requireAuth = false }: AuthRedirectProps) {
  const { isLoading } = useAuth()

  if (requireAuth && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2 text-sm text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
