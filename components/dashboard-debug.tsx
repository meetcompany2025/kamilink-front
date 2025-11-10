"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, XCircle, Wifi, WifiOff } from "lucide-react"

interface DebugInfo {
  authStatus: string
  userExists: boolean
  profileExists: boolean
  databaseConnection: boolean
  supabaseConfig: boolean
  networkConnection: boolean
  userType: string | null
  userId: string | null
  errors: string[]
  warnings: string[]
}

export function DashboardDebug() {
  const { user, userProfile, isLoading } = useAuth()
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    authStatus: "checking",
    userExists: false,
    profileExists: false,
    databaseConnection: false,
    supabaseConfig: false,
    networkConnection: false,
    userType: null,
    userId: null,
    errors: [],
    warnings: [],
  })
  const [isDebugging, setIsDebugging] = useState(false)

  const runDiagnostics = async () => {
    setIsDebugging(true)
    const errors: string[] = []
    const warnings: string[] = []
    const info: DebugInfo = {
      authStatus: "unknown",
      userExists: false,
      profileExists: false,
      databaseConnection: false,
      supabaseConfig: false,
      networkConnection: false,
      userType: null,
      userId: null,
      errors: [],
      warnings: [],
    }

    try {
      // Test 1: Check Supabase configuration
      console.log("[DEBUG] Testing Supabase configuration...")
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        info.supabaseConfig = false
        errors.push("Variáveis de ambiente do Supabase não configuradas")
        console.error("[DEBUG] Missing Supabase environment variables")
      } else {
        info.supabaseConfig = true
        console.log("[DEBUG] Supabase configuration found")
      }

      // Test 2: Check network connectivity
      console.log("[DEBUG] Testing network connectivity...")
      try {
        const response = await fetch("https://httpbin.org/get", {
          method: "GET",
          signal: AbortSignal.timeout(5000),
        })
        if (response.ok) {
          info.networkConnection = true
          console.log("[DEBUG] Network connection successful")
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      } catch (error: any) {
        info.networkConnection = false
        errors.push(`Problema de conectividade de rede: ${error.message}`)
        console.error("[DEBUG] Network connectivity failed:", error)
      }

      // Test 3: Check auth status
      console.log("[DEBUG] Testing auth status...")
      if (isLoading) {
        info.authStatus = "loading"
      } else if (user) {
        info.authStatus = "authenticated"
        info.userExists = true
        info.userId = user.id
        console.log("[DEBUG] User authenticated:", user.id)
      } else {
        info.authStatus = "not_authenticated"
        warnings.push("Usuário não está autenticado")
      }

      // Test 4: Check database connection (only if we have config and network)
      if (info.supabaseConfig && info.networkConnection) {
        console.log("[DEBUG] Testing database connection...")
        try {
          const supabase = createClient()

          if (!supabase) {
            throw new Error("Cliente Supabase não pôde ser criado")
          }

          // Try a simple query with timeout
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

          const { data, error } = await supabase.from("users").select("count").limit(1).abortSignal(controller.signal)

          clearTimeout(timeoutId)

          if (error) {
            throw error
          }

          info.databaseConnection = true
          console.log("[DEBUG] Database connection successful")
        } catch (error: any) {
          info.databaseConnection = false
          if (error.name === "AbortError") {
            errors.push("Timeout na conexão com a base de dados (>10s)")
          } else if (error.message?.includes("Failed to fetch")) {
            errors.push("Falha na conexão com Supabase - verifique URL e chaves")
          } else if (error.code === "PGRST301") {
            errors.push("Tabela 'users' não encontrada na base de dados")
          } else {
            errors.push(`Erro de base de dados: ${error.message}`)
          }
          console.error("[DEBUG] Database connection failed:", error)
        }
      } else {
        warnings.push("Pulando teste de base de dados devido a problemas de configuração/rede")
      }

      // Test 5: Check user profile (only if user exists and DB is connected)
      if (user && info.databaseConnection) {
        console.log("[DEBUG] Testing user profile...")
        try {
          const supabase = createClient()
          const { data: profile, error } = await supabase.from("users").select("*").eq("id", user.id).single()

          if (error) {
            if (error.code === "PGRST116") {
              warnings.push("Perfil do usuário não encontrado na base de dados")
            } else {
              throw error
            }
          } else if (profile) {
            info.profileExists = true
            info.userType = profile.user_type
            console.log("[DEBUG] User profile found:", profile)
          }
        } catch (error: any) {
          errors.push(`Erro ao buscar perfil: ${error.message}`)
          console.error("[DEBUG] Profile fetch failed:", error)
        }
      }

      // Test 6: Check user type validity
      if (info.userType && !["client", "transporter"].includes(info.userType)) {
        errors.push(`Tipo de usuário inválido: ${info.userType}`)
      }

      info.errors = errors
      info.warnings = warnings
      setDebugInfo(info)
    } catch (error: any) {
      console.error("[DEBUG] Diagnostic failed:", error)
      setDebugInfo({
        ...info,
        errors: [...errors, `Erro geral no diagnóstico: ${error.message}`],
        warnings,
      })
    } finally {
      setIsDebugging(false)
    }
  }

  useEffect(() => {
    if (!isLoading) {
      runDiagnostics()
    }
  }, [user, userProfile, isLoading])

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getNetworkIcon = (status: boolean) => {
    return status ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Diagnóstico do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <span>Configuração do Supabase:</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(debugInfo.supabaseConfig)}
              <span className="font-mono text-sm">{debugInfo.supabaseConfig ? "configurado" : "faltando"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Conectividade de Rede:</span>
            <div className="flex items-center gap-2">
              {getNetworkIcon(debugInfo.networkConnection)}
              <span className="font-mono text-sm">{debugInfo.networkConnection ? "conectado" : "falhou"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Conexão com Base de Dados:</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(debugInfo.databaseConnection)}
              <span className="font-mono text-sm">{debugInfo.databaseConnection ? "conectado" : "falhou"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Status de Autenticação:</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(debugInfo.userExists)}
              <span className="font-mono text-sm">{debugInfo.authStatus}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Perfil do Usuário:</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(debugInfo.profileExists)}
              <span className="font-mono text-sm">{debugInfo.profileExists ? "encontrado" : "não encontrado"}</span>
            </div>
          </div>

          {debugInfo.userId && (
            <div className="flex items-center justify-between">
              <span>ID do Usuário:</span>
              <span className="font-mono text-sm text-xs">{debugInfo.userId}</span>
            </div>
          )}

          {debugInfo.userType && (
            <div className="flex items-center justify-between">
              <span>Tipo de Usuário:</span>
              <span className="font-mono text-sm">{debugInfo.userType}</span>
            </div>
          )}
        </div>

        {debugInfo.warnings.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Avisos:</h4>
            <ul className="space-y-1">
              {debugInfo.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-yellow-700">
                  ⚠️ {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {debugInfo.errors.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Erros Encontrados:</h4>
            <ul className="space-y-1">
              {debugInfo.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-700">
                  ❌ {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {debugInfo.errors.length === 0 && debugInfo.warnings.length === 0 && !isDebugging && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">✅ Sistema Funcionando Corretamente</h4>
            <p className="text-sm text-green-700">Todos os testes passaram com sucesso!</p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button onClick={runDiagnostics} disabled={isDebugging} variant="outline">
            {isDebugging ? "Executando..." : "Executar Diagnóstico"}
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            Recarregar Página
          </Button>
          <Button onClick={() => (window.location.href = "/login")} variant="outline">
            Ir para Login
          </Button>
        </div>

        {/* Environment Variables Display (for debugging) */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
          <h5 className="font-medium mb-2">Informações de Configuração:</h5>
          <div className="space-y-1 font-mono">
            <div>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configurado" : "❌ Não encontrado"}</div>
            <div>
              SUPABASE_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Configurado" : "❌ Não encontrado"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
