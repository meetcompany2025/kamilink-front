"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProductionDebug() {
  const { user, userProfile, isLoading, session } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDebugInfo({
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      })
    }
  }, [])

  const handleForceRedirect = () => {
    const dashboardPath = userProfile?.user_type === "transporter" ? "/dashboard/transporter" : "/dashboard/client"
    console.log("[FORCE_REDIRECT] Attempting redirect to:", dashboardPath)

    // Tentar todos os métodos
    window.location.replace(dashboardPath)
    setTimeout(() => (window.location.href = dashboardPath), 100)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Debug de Produção - Redirecionamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Usuário:</strong> {user ? "✅ Logado" : "❌ Não logado"}
          </div>
          <div>
            <strong>Perfil:</strong> {userProfile ? "✅ Carregado" : "❌ Não carregado"}
          </div>
          <div>
            <strong>Loading:</strong> {isLoading ? "⏳ Carregando" : "✅ Completo"}
          </div>
          <div>
            <strong>Sessão:</strong> {session ? "✅ Ativa" : "❌ Inativa"}
          </div>
          <div>
            <strong>Hostname:</strong> {debugInfo.hostname}
          </div>
          <div>
            <strong>Pathname:</strong> {debugInfo.pathname}
          </div>
        </div>

        {userProfile && (
          <div className="p-4 bg-muted rounded">
            <strong>Dados do Perfil:</strong>
            <pre className="text-xs mt-2">{JSON.stringify(userProfile, null, 2)}</pre>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleForceRedirect} variant="outline">
            Forçar Redirecionamento
          </Button>
          <Button
            onClick={() => {
              console.log("Debug Info:", { user, userProfile, session, debugInfo })
            }}
            variant="outline"
          >
            Log Debug Info
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
