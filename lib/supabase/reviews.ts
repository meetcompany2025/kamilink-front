import { createClient } from "./client"

export async function createReview(
  freightRequestId: string,
  reviewerId: string,
  revieweeId: string,
  rating: number,
  comment?: string,
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      freight_request_id: freightRequestId,
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      rating,
      comment: comment || null,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getReviewsByUser(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:reviewer_id(id, name),
      freight_request:freight_request_id(*)
    `)
    .eq("reviewee_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data
}

export async function getUserRating(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("reviews").select("rating").eq("reviewee_id", userId)

  if (error) throw error

  if (!data || data.length === 0) {
    return null
  }

  // Calculate average rating
  const sum = data.reduce((acc, review) => acc + review.rating, 0)
  const average = sum / data.length

  return {
    average: Number.parseFloat(average.toFixed(1)),
    count: data.length,
  }
}
