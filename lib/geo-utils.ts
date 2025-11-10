// Função para converter endereço em coordenadas (geocoding)
// Função para converter endereço em coordenadas usando Google Maps Geocoding API
export async function geocodeAddress(address: string): Promise<{ longitude: number; latitude: number } | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    )
    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location
      return { longitude: location.lng, latitude: location.lat }
    }
    return null
  } catch (error) {
    console.error("Erro ao geocodificar endereço (Google):", error)
    return null
  }
}

export async function getRouteInfoCli(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
): Promise<{ distance: number; time: number } | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    )
    const data = await response.json()

    if (data.routes && data.routes.length > 0) {
      const leg = data.routes[0].legs[0]
      const distanceKm = leg.distance.value / 1000 // metros → km
      const timeHours = leg.duration.value / 3600 // segundos → horas

      return {
        distance: Math.round(distanceKm * 10) / 10,
        time: Math.round(timeHours * 10) / 10,
      }
    }
    return null
  } catch (error) {
    console.error("Erro ao buscar rota (Google):", error)
    return null
  }
}

export async function getRouteInfo(
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral
): Promise<{ distance: number; time: number } | null> {
  return new Promise((resolve, reject) => {
    const service = new google.maps.DirectionsService()

    service.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result?.routes?.[0]?.legs?.[0]) {
          const leg = result.routes[0].legs[0]
          const distanceKm = leg.distance?.value ? leg.distance.value / 1000 : 0
          const timeHours = leg.duration?.value ? leg.duration.value / 3600 : 0

          resolve({
            distance: Math.round(distanceKm * 10) / 10,
            time: Math.round(timeHours * 10) / 10,
          })
        } else {
          reject("Erro ao calcular rota: " + status)
        }
      }
    )
  })
}

// Função para calcular a distância entre dois pontos (em km)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Raio da Terra em km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distância em km
  return Math.round(distance * 10) / 10 // Arredonda para 1 casa decimal
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Função para estimar o tempo de viagem (em horas)
export function estimateTravelTime(distanceKm: number): number {
  // Velocidade média estimada em km/h para Angola (considerando estradas e condições)
  const avgSpeed = 60
  return Math.round((distanceKm / avgSpeed) * 10) / 10 // Arredonda para 1 casa decimal
}

// Função para gerar pontos aleatórios ao longo de uma rota para simulação
export function generateRoutePoints(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  numPoints: number,
): Array<{ latitude: number; longitude: number }> {
  const points = []

  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints

    // Interpolação linear entre os pontos de início e fim
    const lat = startLat + fraction * (endLat - startLat)
    const lng = startLng + fraction * (endLng - startLng)

    // Adicionar um pouco de variação para simular uma rota real
    const jitter = 0.01 // Ajuste conforme necessário
    const randomLat = lat + (Math.random() - 0.5) * jitter
    const randomLng = lng + (Math.random() - 0.5) * jitter

    points.push({
      latitude: randomLat,
      longitude: randomLng,
    })
  }

  return points
}
