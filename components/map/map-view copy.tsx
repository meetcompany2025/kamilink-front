// "use client"

// import { useEffect, useState, memo, useCallback } from "react"
// import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api"
// import { Card } from "@/components/ui/card"
// import { AlertCircle } from "lucide-react"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { useGoogleMaps } from "@/components/google-maps-provider"


// export interface MapLocation {
//   longitude: number
//   latitude: number
//   name?: string
//   description?: string
//   isOrigin?: boolean
//   isDestination?: boolean
// }

// interface MapViewProps {
//   locations: MapLocation[]
//   showRoute?: boolean
//   height?: string
//   className?: string
//   zoom?: number
//   center?: [number, number]
//   interactive?: boolean
//   vehiclePosition?: MapLocation
//   onMapLoaded?: (map: google.maps.Map) => void
//   onMapError?: (error: any) => void
// }

// export const MapView = memo(function MapView({
//   locations,
//   showRoute = true,
//   height = "400px",
//   className = "",
//   zoom = 6,
//   center = [13.234444, -8.838333], // Luanda
//   interactive = true,
//   vehiclePosition,
//   onMapLoaded,
//   onMapError,
// }: MapViewProps) {
//   const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)

//   const { isLoaded, loadError } = useGoogleMaps();

//   // Calcular rota se `showRoute` e houver 2 pontos
//   useEffect(() => {
//     if (isLoaded && showRoute && locations.length >= 2) {
//       const origin = { lat: locations[0].latitude, lng: locations[0].longitude }
//       const destination = { lat: locations[locations.length - 1].latitude, lng: locations[locations.length - 1].longitude }

//       const service = new google.maps.DirectionsService()
//       service.route(
//         {
//           origin,
//           destination,
//           travelMode: google.maps.TravelMode.DRIVING,
//         },
//         (result, status) => {
//           if (status === "OK" && result) {
//             setDirections(result)
//           } else {
//             console.error("Erro ao calcular rota:", status)
//             if (onMapError) onMapError(status)
//           }
//         },
//       )
//     }
//   }, [isLoaded, showRoute, locations, onMapError])

//   const handleLoad = useCallback(
//     (map: google.maps.Map) => {
//       if (onMapLoaded) onMapLoaded(map)
//     },
//     [onMapLoaded],
//   )

//   if (loadError) {
//     return (
//       <Card className={`overflow-hidden ${className}`}>
//         <div className="p-4">
//           <Alert className="mb-4">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Erro ao carregar Google Maps</AlertTitle>
//             <AlertDescription>
//               Não foi possível carregar o mapa. Verifique sua chave da API do Google Maps.
//             </AlertDescription>
//           </Alert>
//         </div>
//       </Card>
//     )
//   }

//   if (!isLoaded) {
//     return (
//       <Card className={`overflow-hidden ${className}`}>
//         <div className="p-6 text-center text-muted-foreground">Carregando mapa...</div>
//       </Card>
//     )
//   }

//   return (
//     <Card className={`overflow-hidden ${className}`}>
//       <GoogleMap
//         mapContainerStyle={{ width: "100%", height }}
//         center={{ lat: center[1], lng: center[0] }}
//         zoom={zoom}
//         options={{ disableDefaultUI: !interactive }}
//         onLoad={handleLoad}
//       >
//         {/* Marcadores dos locais */}
//         {locations.map((loc, idx) => (
//           <Marker
//             key={idx}
//             position={{ lat: loc.latitude, lng: loc.longitude }}
//             label={loc.isOrigin ? "O" : loc.isDestination ? "D" : undefined}
//           />
//         ))}

//         {/* Posição do veículo */}
//         {vehiclePosition && (
//           <Marker
//             position={{ lat: vehiclePosition.latitude, lng: vehiclePosition.longitude }}
//             label="🚚"
//             icon={{
//               url: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
//             }}
//           />
//         )}

//         {/* Rota */}
//         {directions && <DirectionsRenderer directions={directions} />}
//       </GoogleMap>
//     </Card>
//   )
// })
