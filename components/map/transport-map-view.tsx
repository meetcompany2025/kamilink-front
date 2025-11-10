"use client"

import { useEffect, useState, memo, useCallback, useRef } from "react"
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useGoogleMaps } from "@/components/google-maps-provider"

export interface MapLocation {
  longitude: number
  latitude: number
  name?: string
  description?: string
  isOrigin?: boolean
  isDestination?: boolean
}

interface MapViewProps {
  locations: MapLocation[]
  showRoute?: boolean
  height?: string
  className?: string
  zoom?: number
  center?: [number, number]
  interactive?: boolean
  animateVehicle?: boolean   // 👈 new prop
  speed?: number             // meters per step
  onMapLoaded?: (map: google.maps.Map) => void
  onMapError?: (error: any) => void
}

export const MapView = memo(function MapView({
  locations,
  showRoute = true,
  height = "400px",
  className = "",
  zoom = 6,
  center = [13.234444, -8.838333], // Luanda
  interactive = true,
  animateVehicle = false,
  speed = 200, // meters per tick
  onMapLoaded,
  onMapError,
}: MapViewProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [vehiclePos, setVehiclePos] = useState<google.maps.LatLngLiteral | null>(null)
  const routePointsRef = useRef<google.maps.LatLng[]>([])
  const stepIndexRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const { isLoaded, loadError } = useGoogleMaps();

  // Calculate route
  useEffect(() => {
    if (isLoaded && showRoute && locations.length >= 2) {
      const origin = { lat: locations[0].latitude, lng: locations[0].longitude }
      const destination = { lat: locations[locations.length - 1].latitude, lng: locations[locations.length - 1].longitude }

      const service = new google.maps.DirectionsService()
      service.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result)
            routePointsRef.current = result.routes[0].overview_path
            setVehiclePos(routePointsRef.current[0].toJSON())
          } else {
            console.error("Erro ao calcular rota:", status)
            if (onMapError) onMapError(status)
          }
        },
      )
    }
  }, [isLoaded, showRoute, locations, onMapError])

  // Animate vehicle along the polyline
  useEffect(() => {
    if (!animateVehicle || routePointsRef.current.length === 0) return

    intervalRef.current = setInterval(() => {
      if (stepIndexRef.current < routePointsRef.current.length - 1) {
        stepIndexRef.current += 1
        setVehiclePos(routePointsRef.current[stepIndexRef.current].toJSON())
      } else {
        clearInterval(intervalRef.current!)
      }
    }, 1000) // move every second (adjust based on speed)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [animateVehicle, directions])

  const handleLoad = useCallback(
    (map: google.maps.Map) => {
      if (onMapLoaded) onMapLoaded(map)
    },
    [onMapLoaded],
  )

  if (loadError) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="p-4">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar Google Maps</AlertTitle>
            <AlertDescription>
              Não foi possível carregar o mapa. Verifique sua chave da API do Google Maps.
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    )
  }

  if (!isLoaded) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="p-6 text-center text-muted-foreground">Carregando mapa...</div>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height }}
        center={{ lat: center[1], lng: center[0] }}
        zoom={zoom}
        options={{ disableDefaultUI: !interactive }}
        onLoad={handleLoad}
      >
        {/* Markers for origin/destination */}
        {locations.map((loc, idx) => (
          <Marker
            key={idx}
            position={{ lat: loc.latitude, lng: loc.longitude }}
            label={loc.isOrigin ? "O" : loc.isDestination ? "D" : undefined}
          />
        ))}

        {/* Vehicle Marker */}
        {vehiclePos && (
          <Marker
            position={vehiclePos}
            label="🚚"
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
            }}
          />
        )}

        {/* Route */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </Card>
  )
})
