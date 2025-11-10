import { createClient } from "./client"

export async function createVehicle(vehicleData: any, ownerId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("vehicles")
    .insert({
      owner_id: ownerId,
      vehicle_type: vehicleData.vehicleType,
      brand: vehicleData.brand,
      model: vehicleData.model,
      license_plate: vehicleData.licensePlate,
      capacity: vehicleData.capacity,
      year: vehicleData.year || null,
      dimensions: vehicleData.dimensions || null,
      is_verified: false,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getVehiclesByOwner(ownerId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data
}

export async function getVehicleById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).single()

  if (error) throw error

  return data
}

export async function updateVehicle(id: string, vehicleData: any) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("vehicles")
    .update({
      vehicle_type: vehicleData.vehicleType,
      brand: vehicleData.brand,
      model: vehicleData.model,
      license_plate: vehicleData.licensePlate,
      capacity: vehicleData.capacity,
      year: vehicleData.year || null,
      dimensions: vehicleData.dimensions || null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function deleteVehicle(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("vehicles").delete().eq("id", id)

  if (error) throw error

  return { success: true }
}
