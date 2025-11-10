"use client"
import { useRouter } from "next/navigation"

export function useProductionRedirect() {
  const router = useRouter()

  const redirect = (path: string, delay = 0) => {
    const isProduction = typeof window !== "undefined" && window.location.hostname !== "localhost"

    console.log("[PRODUCTION_REDIRECT] Redirecting to:", path, "Production:", isProduction)

    if (delay > 0) {
      setTimeout(() => {
        if (isProduction) {
          window.location.replace(path)
        } else {
          router.replace(path)
        }
      }, delay)
    } else {
      if (isProduction) {
        window.location.replace(path)
      } else {
        router.replace(path)
      }
    }
  }

  const forceRedirect = (path: string) => {
    console.log("[PRODUCTION_REDIRECT] Force redirecting to:", path)

    // Tentar múltiplas formas de redirecionamento
    if (typeof window !== "undefined") {
      // Método 1: window.location.replace
      window.location.replace(path)

      // Método 2: window.location.href (fallback)
      setTimeout(() => {
        window.location.href = path
      }, 100)

      // Método 3: router.replace (fallback)
      setTimeout(() => {
        router.replace(path)
      }, 200)
    }
  }

  return { redirect, forceRedirect }
}
