"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function DebugUserData() {
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [authData, setAuthData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { user, userProfile } = useAuth()
  const supabase = createClient()

  const fetchUserData = async () => {
    if (!user) {
      setError("Usuário não autenticado")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Buscar dados do usuário da tabela auth.users
      const { data: authUserData, error: authError } = await supabase.auth.getUser()

      if (authError) {
        throw authError
      }

      setAuthData(authUserData.user)

      // Buscar dados do perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) {
        throw profileError
      }

      setUserData(profileData)
    } catch (error: any) {
      console.error("Erro ao buscar dados:", error)
      setError(error.message || "Erro ao buscar dados do usuário")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Depuração de Dados do Usuário</CardTitle>
        <CardDescription>Ferramenta para verificar os dados do usuário no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <Button onClick={fetchUserData} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                "Verificar Dados do Usuário"
              )}
            </Button>

            {userData && (
              <Button
                variant="outline"
                onClick={() => {
                  setUserData(null)
                  setAuthData(null)
                }}
              >
                Limpar
              </Button>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
              <p className="font-medium">Erro:</p>
              <p>{error}</p>
            </div>
          )}

          {authData && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Dados de Autenticação:</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">{JSON.stringify(authData, null, 2)}</pre>
            </div>
          )}

          {userData && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Dados do Perfil:</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">{JSON.stringify(userData, null, 2)}</pre>
            </div>
          )}

          {userProfile && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Perfil do Contexto de Autenticação:</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(userProfile, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
