// // GoogleMapsProvider.tsx
// "use client"

// import { useJsApiLoader } from "@react-google-maps/api"
// import { AlertCircle } from "lucide-react"
// import { createContext, ReactNode, useContext } from "react"
// import { Alert, AlertTitle, AlertDescription } from "./ui/alert"
// import { Card } from "./ui/card"

// const libraries: ("places" | "geometry" | "visualization")[] = ["places"] // inclua todas que vai precisar
// // const libraries: ("places" | "maps")[] = ["places"] // inclua todas que vai precisar

// type GoogleMapsContextType = {
//   isLoaded: boolean
//   loadError: Error | undefined
// }

// const GoogleMapsContext = createContext<GoogleMapsContextType>({
//   isLoaded: false,
//   loadError: undefined,
// })

// export function GoogleMapsProvider({ children }: { children: ReactNode }) {
//   const { isLoaded, loadError } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyD4itmAQFvPteEK_LD9tvKTo5EY_FIcjQQ",
//     // googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY! --- IGNORE ---,
//     libraries,
//   })

//     if (loadError) {
//       return <div>Erro ao carregar o Google Maps</div>;
//     }

//     if (!isLoaded) {
//       return <div>Carregando mapa...</div>;
//     }

  

//   return (
//     <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
//       {children}
//     </GoogleMapsContext.Provider>
//   )
// }

// export function useGoogleMaps() {
//   return useContext(GoogleMapsContext)
// }
