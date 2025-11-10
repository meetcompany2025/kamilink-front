"use client"

import { Suspense, lazy, useState } from "react"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { MapLocation } from "./map-view"

// Importação dinâmica do componente MapView
const MapView = lazy(() =>
  import("./map-view").then((mod) => ({
    default: mod.MapView,
  })),
)

interface DynamicMapViewProps {
  locations: MapLocation[]
  showRoute?: boolean
  height?: string
  className?: string
  zoom?: number
  center?: [number, number]
  interactive?: boolean
  vehiclePosition?: MapLocation
  onMapLoaded?: (map: any) => void
}

export function DynamicMapView(props: DynamicMapViewProps) {
  const [error, setError] = useState<string | null>(null)

  const handleMapError = (error: any) => {
    console.error("Erro no mapa:", error)
    setError("Não foi possível carregar o mapa. Por favor, use o método manual para inserir endereços.")
  }

  return (
    <Suspense
      fallback={
        <Card className={`overflow-hidden ${props.className}`}>
          <div className="flex items-center justify-center bg-slate-100" style={{ height: props.height || "400px" }}>
            <div className="text-center p-4">
              <p className="text-slate-600">Carregando mapa...</p>
            </div>
          </div>
        </Card>
      }
    >
      {error ? (
        <Card className={`overflow-hidden ${props.className}`}>
          <div className="p-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro no mapa</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div
              className="mt-4 bg-slate-100 rounded-md flex items-center justify-center"
              style={{ height: props.height || "400px", minHeight: "200px" }}
            >
              <div className="text-center p-4">
                <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">Mapa não disponível</p>
                <p className="text-sm text-slate-500 mt-1">Use a opção "Inserir Manualmente" para continuar.</p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <MapView {...props} onMapError={handleMapError} />
      )}
    </Suspense>
  )
}
