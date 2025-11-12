// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { MapPin, X } from "lucide-react";
// import { useGoogleMaps } from "@/components/google-maps-provider";

// export interface MapLocation {
//   latitude: number;
//   longitude: number;
//   name?: string;
// }

// interface LocationPickerProps {
//   title: string;
//   onLocationSelect: (location: MapLocation) => void;
//   initialLocation?: MapLocation;
//   className?: string;
// }

// const containerStyle = {
//   width: "100%",
//   height: "250px",
// };

// const defaultCenter = { lat: -8.838333, lng: 13.234444 }; // Luanda, Angola

// export function LocationPicker({
//   title,
//   onLocationSelect,
//   initialLocation,
//   className = "",
// }: LocationPickerProps) {
//   const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(initialLocation || null);
//   const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

//   const { isLoaded, loadError } = useGoogleMaps();

//   // ✅ Google exige session token para Places API nova
//   const sessionToken = useRef(new google.maps.places.AutocompleteSessionToken());

//   useEffect(() => {
//     if (initialLocation) {
//       setSelectedLocation(initialLocation);
//     }
//   }, [initialLocation]);

//   const handlePlaceChanged = () => {
//     if (!autocompleteRef.current) return;
//     const place = autocompleteRef.current.getPlace();

//     if (!place.geometry || !place.geometry.location) return;

//     const location: MapLocation = {
//       latitude: place.geometry.location.lat(),
//       longitude: place.geometry.location.lng(),
//       name: place.formatted_address || place.name,
//     };

//     setSelectedLocation(location);
//     onLocationSelect(location);

//     // ✅ Renova token por melhores cobranças/autocomplete preciso
//     // sessionToken.current = new google.maps.places.AutocompleteSessionToken();
//   };

//   const handleClearLocation = () => {
//     setSelectedLocation(null);
//   };

//   const handleMapClick = useCallback(
//     (e: google.maps.MapMouseEvent) => {
//       if (!e.latLng) return;
//       const location: MapLocation = {
//         latitude: e.latLng.lat(),
//         longitude: e.latLng.lng(),
//         name: "Localização selecionada",
//       };
//       setSelectedLocation(location);
//       onLocationSelect(location);
//     },
//     [onLocationSelect]
//   );

//   if (loadError) {
//     return (
//       <div className="p-4 text-center bg-red-50 text-red-600 rounded-md">
//         Não foi possível carregar o Google Maps. Por favor, insira o endereço manualmente.
//       </div>
//     );
//   }

//   return (
//     <Card className={className}>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <MapPin className="h-5 w-5 text-primary" />
//           {title}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {isLoaded && (
//           <Autocomplete
//             onLoad={(ac) => (autocompleteRef.current = ac)}
//             onPlaceChanged={handlePlaceChanged}
//             options={{
//               fields: ["geometry", "formatted_address", "name", "place_id"],
//               // sessionToken: sessionToken.current, // ✅ evita API legada
//             }}
//           >
//             <input
//               type="text"
//               placeholder="Buscar endereço..."
//               className="w-full p-2 border rounded-md"
//             />
//           </Autocomplete>
//         )}

//         {selectedLocation ? (
//           <div className="bg-muted p-3 rounded-md relative">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="absolute top-1 right-1 h-6 w-6"
//               onClick={handleClearLocation}
//             >
//               <X className="h-4 w-4" />
//             </Button>
//             <p className="text-sm font-medium">{selectedLocation.name || "Localização selecionada"}</p>
//             <p className="text-xs text-muted-foreground mt-1">
//               Lat: {selectedLocation.latitude.toFixed(6)}, Lng: {selectedLocation.longitude.toFixed(6)}
//             </p>
//           </div>
//         ) : (
//           <p className="text-sm text-muted-foreground">Nenhuma localização selecionada</p>
//         )}

//         {isLoaded && (
//           <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={
//               selectedLocation
//                 ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
//                 : defaultCenter
//             }
//             zoom={selectedLocation ? 12 : 5}
//             onClick={handleMapClick}
//           >
//             {selectedLocation && (
//               <Marker
//                 position={{
//                   lat: selectedLocation.latitude,
//                   lng: selectedLocation.longitude,
//                 }}
//               />
//             )}
//           </GoogleMap>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
