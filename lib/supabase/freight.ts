import { createClient } from "./client"

export async function createFreightRequest(freightData: any, userId: string) {
  const supabase = createClient()

  // Generate a tracking number
  const trackingNumber = `KL-${Math.floor(Math.random() * 1000000)}`

  const { data, error } = await supabase
    .from("freight_requests")
    .insert({
      client_id: userId,
      origin_address: freightData.originAddress,
      origin_city: freightData.originCity,
      origin_state: freightData.originState,
      destination_address: freightData.destinationAddress,
      destination_city: freightData.destinationCity,
      destination_state: freightData.destinationState,
      cargo_type: freightData.cargoType,
      weight: freightData.weight,
      dimensions:
        freightData.length && freightData.width && freightData.height
          ? `${freightData.length}x${freightData.width}x${freightData.height}`
          : null,
      quantity: freightData.quantity,
      description: freightData.description || null,
      pickup_date: freightData.pickupDate,
      delivery_date: freightData.deliveryDate,
      requires_loading_help: freightData.requiresLoadingHelp || false,
      requires_unloading_help: freightData.requiresUnloadingHelp || false,
      has_insurance: freightData.hasInsurance || false,
      status: "pending",
      tracking_number: trackingNumber,
      attachments: freightData.attachments || [],
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getFreightRequestsByClient(clientId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("freight_requests")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data
}

export async function getAvailableFreightRequests() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("freight_requests")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) throw error

  return data
}

export async function getFreightRequestById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("freight_requests")
    .select(`
      *,
      client:client_id(id, name, email, phone, is_verified),
      freight_offers(*)
    `)
    .eq("id", id)
    .single()

  if (error) throw error

  return data
}

export async function createFreightOffer(freightRequestId: string, transporterId: string, offerData: any) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("freight_offers")
    .insert({
      freight_request_id: freightRequestId,
      transporter_id: transporterId,
      vehicle_id: offerData.vehicleId || null,
      price: offerData.price,
      estimated_delivery_date: offerData.estimatedDeliveryDate || null,
      notes: offerData.notes || null,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getFreightOffersByTransporter(transporterId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("freight_offers")
    .select(`
      *,
      freight_request:freight_request_id(*)
    `)
    .eq("transporter_id", transporterId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data
}

export async function updateFreightRequestStatus(id: string, status: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("freight_requests").update({ status }).eq("id", id).select().single()

  if (error) throw error

  return data
}

export async function acceptFreightOffer(offerId: string, freightRequestId: string) {
  const supabase = createClient()

  // Start a transaction by using multiple operations
  // 1. Update the offer status to accepted
  const { error: offerError } = await supabase.from("freight_offers").update({ status: "accepted" }).eq("id", offerId)

  if (offerError) throw offerError

  // 2. Update the freight request status to assigned
  const { error: requestError } = await supabase
    .from("freight_requests")
    .update({ status: "assigned" })
    .eq("id", freightRequestId)

  if (requestError) throw requestError

  // 3. Reject all other offers for this freight request
  const { error: rejectError } = await supabase
    .from("freight_offers")
    .update({ status: "rejected" })
    .eq("freight_request_id", freightRequestId)
    .neq("id", offerId)

  if (rejectError) throw rejectError

  return { success: true }
}

export async function getFreightRequestByTrackingNumber(trackingNumber: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("freight_requests")
    .select(`
      *,
      client:client_id(id, name, email, phone, is_verified),
      freight_offers(*)
    `)
    .eq("tracking_number", trackingNumber)
    .single()

  if (error) throw error

  return data
}
