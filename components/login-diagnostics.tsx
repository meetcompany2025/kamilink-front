"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface DiagnosticResult {
  test: string
  status: "success" | "error" | "pending"
  message: string
  details?: any
}

export function LoginDiagnostics() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [testEmail, setTestEmail] = useState("test@example.com")
  const [testPassword, setTestPassword] = useState("123456")

  const supabase = createClient()

  const addResult = (result: DiagnosticResult) => {
    setResults((prev) => [...prev, result])
  }

  const runDiagnostics = async () => {
    setIsRunning(true)
    setResults([])

    // Test 1: Supabase Client Connection
    addResult({ test: "Conexão Supabase", status: "pending", message: "Testando..." })
    try {
      const { data, error } = await supabase.from("users").select("count").limit(1)
      if (error) throw error
      addResult({
        test: "Conexão Supabase",
        status: "success",
        message: "Conexão estabelecida com sucesso",
      })
    } catch (error: any) {
      addResult({
        test: "Conexão Supabase",
        status: "error",
        message: `Falha na conexão: ${error.message}`,
        details: error,
      })
    }

    // Test 2: Auth Service Availability
    addResult({ test: "Serviço de Autenticação", status: "pending", message: "Verificando..." })
    try {
      const { data, error } = await supabase.auth.getSession()
      addResult({
        test: "Serviço de Autenticação",
        status: "success",
        message: "Serviço disponível",
      })
    } catch (error: any) {
      addResult({
        test: "Serviço de Autenticação",
        status: "error",
        message: `Serviço indisponível: ${error.message}`,
        details: error,
      })
    }

    // Test 3: Environment Variables
    addResult({ test: "Variáveis de Ambiente", status: "pending", message: "Verificando..." })
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      addResult({
        test: "Variáveis de Ambiente",
        status: "error",
        message: "Variáveis de ambiente não configuradas",
        details: { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey },
      })
    } else {
      addResult({
        test: "Variáveis de Ambiente",
        status: "success",
        message: "Variáveis configuradas corretamente",
      })
    }

    // Test 4: Database Tables
    addResult({ test: "Tabelas da Base de Dados", status: "pending", message: "Verificando..." })
    try {
      const { data: usersTable, error: usersError } = await supabase.from("users").select("id").limit(1)
      const { data: freightTable, error: freightError } = await supabase.from("freight_requests").select("id").limit(1)

      if (usersError || freightError) {
        throw new Error(`Tabelas não encontradas: ${usersError?.message || freightError?.message}`)
      }

      addResult({
        test: "Tabelas da Base de Dados",
        status: "success",
        message: "Todas as tabelas estão acessíveis",
      })
    } catch (error: any) {
      addResult({
        test: "Tabelas da Base de Dados",
        status: "error",
        message: `Erro nas tabelas: ${error.message}`,
        details: error,
      })
    }

    // Test 5: Test Login (if credentials provided)
    if (testEmail && testPassword) {
      addResult({ test: "Teste de Login", status: "pending", message: "Tentando login..." })
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        })

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            addResult({
              test: "Teste de Login",
              status: "success",
              message: "Sistema de login funcionando (credenciais inválidas como esperado)",
            })
          } else {
            throw error
          }
        } else {
          addResult({
            test: "Teste de Login",
            status: "success",
            message: "Login realizado com sucesso!",
          })

          // Sign out immediately
          await supabase.auth.signOut()
        }
      } catch (error: any) {
        addResult({
          test: "Teste de Login",
          status: "error",
          message: `Erro no login: ${error.message}`,
          details: error,
        })
      }
    }

    // Test 6: Network Connectivity
    addResult({ test: "Conectividade de Rede", status: "pending", message: "Testando..." })
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          apikey: supabaseKey || "",
          Authorization: `Bearer ${supabaseKey}`,
        },
      })

      if (response.ok) {
        addResult({
          test: "Conectividade de Rede",
          status: "success",
          message: "Conexão de rede funcionando",
        })
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error: any) {
      addResult({
        test: "Conectividade de Rede",
        status: "error",
        message: `Erro de rede: ${error.message}`,
        details: error,
      })
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "pending":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Diagnóstico de Login
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Email de Teste:</label>
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Senha de Teste:</label>
            <Input
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="senha123"
            />
          </div>
        </div>

        <Button onClick={runDiagnostics} disabled={isRunning} className="w-full">
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executando Diagnóstico...
            </>
          ) : (
            "Executar Diagnóstico Completo"
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-lg">Resultados:</h3>
            {results.map((result, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="font-medium">{result.test}</div>
                  <div
                    className={`text-sm ${
                      result.status === "error"
                        ? "text-red-600"
                        : result.status === "success"
                          ? "text-green-600"
                          : "text-blue-600"
                    }`}
                  >
                    {result.message}
                  </div>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">Ver detalhes</summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Próximos Passos:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Se houver erros de conexão, verifique as variáveis de ambiente</li>
              <li>• Se o login falhar, verifique se o usuário existe na base de dados</li>
              <li>• Se as tabelas não existirem, execute os scripts SQL de setup</li>
              <li>• Para problemas de rede, verifique a configuração do Supabase</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
