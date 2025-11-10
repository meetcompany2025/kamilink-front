"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import { checkSupabaseConnection } from "@/lib/supabase/client"

export default function ConnectionError() {
  const [isChecking, setIsChecking] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const checkConnection = async () => {
    setIsChecking(true)
    const isConnected = await checkSupabaseConnection()
    setIsChecking(false)

    if (isConnected) {
      // Se a conexão for restaurada, recarregar a página
      window.location.reload()
    } else {
      setRetryCount((prev) => prev + 1)
    }
  }

  useEffect(() => {
    // Tentar reconectar automaticamente a cada 30 segundos
    const interval = setInterval(() => {
      checkConnection()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Problema de Conexão</h2>
      <p className="mb-6 max-w-md">
        Não foi possível conectar ao servidor. Isso pode ser devido a problemas de rede ou o servidor pode estar
        temporariamente indisponível.
      </p>
      <Button onClick={checkConnection} disabled={isChecking} className="flex items-center gap-2">
        {isChecking ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Verificando...
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </>
        )}
      </Button>
      {retryCount > 0 && (
        <p className="mt-4 text-sm text-gray-500">
          Tentativas: {retryCount}. Verificando automaticamente a cada 30 segundos.
        </p>
      )}
    </div>
  )
}
