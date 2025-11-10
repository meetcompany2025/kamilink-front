"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"


export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    
   
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {isLoading ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Processando autenticação...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : error ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Erro de Autenticação</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Voltar para o Login
          </button>
        </div>
      ) : null}
    </div>
  )
}
