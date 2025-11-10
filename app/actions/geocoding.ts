"use server"

interface GeocodeResult {
  id: string
  place_name: string
  center: [number, number]
}

interface GeocodeResponse {
  features: GeocodeResult[]
}

export async function searchLocation(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) {
    return []
  }

  try {
    const mapboxToken = process.env.MAPBOX_TOKEN
    if (!mapboxToken) {
      throw new Error("Mapbox token not configured")
    }

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query,
      )}.json?access_token=${mapboxToken}&country=ao&language=pt`,
    )

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data: GeocodeResponse = await response.json()
    return data.features || []
  } catch (error) {
    console.error("Geocoding error:", error)
    return []
  }
}

export async function getMapboxPublicToken(): Promise<string | null> {
  // Return a limited-scope public token or null to disable maps
  // For security, we'll disable client-side maps entirely
  return null
}
