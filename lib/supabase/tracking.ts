import { createClient } from "./client"

export async function addTrackingUpdate(
  freightRequestId: string,
  location: string,
  status: string,
  description?: string,
  coordinates?: { latitude: number; longitude: number },
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tracking")
    .insert({
      freight_request_id: freightRequestId,
      location,
      status,
      description: description || null,
      latitude: coordinates?.latitude || null,
      longitude: coordinates?.longitude || null,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getTrackingUpdates(freightRequestId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tracking")
    .select("*")
    .eq("freight_request_id", freightRequestId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data
}

export async function getTrackingByNumber(trackingNumber: string) {
  const supabase = createClient()

  // First get the freight request
  const { data: freightRequest, error: freightError } = await supabase
    .from("freight_requests")
    .select("*")
    .eq("tracking_number", trackingNumber)
    .single()

  if (freightError) throw freightError

  if (!freightRequest) {
    return null
  }

  // Then get the tracking updates
  const { data: updates, error: updatesError } = await supabase
    .from("tracking")
    .select("*")
    .eq("freight_request_id", freightRequest.id)
    .order("created_at", { ascending: false })

  if (updatesError) throw updatesError

  return {
    freightRequest,
    updates,
  }
}
