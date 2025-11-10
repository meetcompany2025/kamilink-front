// GoogleMapsProvider.tsx
"use client"

import { useJsApiLoader } from "@react-google-maps/api"
import { createContext, ReactNode, useContext } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"
import { Card } from "./ui/card"

// Bibliotecas válidas do Google Maps API
// const libraries = ["places"] as (
//   | "places"
//   | "geometry"
//   | "drawing"
//   | "maps"
//   | "visualization"
// )[]

const libraries: ("places")[] = ["places"];


type GoogleMapsContextType = {
  isLoaded: boolean
  loadError: Error | undefined
}

// Contexto com valores padrão
const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
})

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.error("⚠️ ERRO: Variável NEXT_PUBLIC_GOOGLE_MAPS_API_KEY não foi definida no .env.local")
  }

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey ?? "",
    libraries,
    version: "weekly",
  })

  // Exibe erro caso o Maps não carregue
  if (loadError) {
    return (
      <Card className="overflow-hidden">
        <div className="p-4">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar Google Maps</AlertTitle>
            <AlertDescription>
              Não foi possível carregar o mapa. Verifique sua chave de API.
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    )
  }

  // Exibe loading enquanto carrega a API
  if (!isLoaded) {
    return (
      <Card className="overflow-hidden">
        <div className="p-6 text-center text-muted-foreground">
          Carregando mapa...
        </div>
      </Card>
    )
  }

  // Tudo carregado ✅
  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  )
}

// Hook auxiliar para acessar o contexto facilmente
export function useGoogleMaps() {
  return useContext(GoogleMapsContext)
}
