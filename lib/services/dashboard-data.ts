import { createClient } from "@/lib/supabase/client"

export class DashboardDataService {
  private supabase = createClient()

  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.from("users").select("count").limit(1)
      return !error
    } catch (error) {
      console.error("[DASHBOARD] Connection test failed:", error)
      return false
    }
  }

  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser()

      if (error) throw error
      return user
    } catch (error) {
      console.error("[DASHBOARD] Error getting current user:", error)
      return null
    }
  }

  async getUserProfile(userId: string) {
    try {
      const { data, error } = await this.supabase.from("users").select("*").eq("id", userId).single()

      if (error) {
        if (error.code === "PGRST116") {
          console.log("[DASHBOARD] User profile not found")
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error("[DASHBOARD] Error fetching user profile:", error)
      return null
    }
  }

  async getFreightRequests(userId: string, userType: string) {
    try {
      let query = this.supabase.from("freight_requests").select(`
        *,
        pickup_address:addresses!freight_requests_pickup_address_id_fkey(*),
        delivery_address:addresses!freight_requests_delivery_address_id_fkey(*)
      `)

      if (userType === "client") {
        query = query.eq("client_id", userId)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("[DASHBOARD] Error fetching freight requests:", error)
      return []
    }
  }

  async getRecentActivity(userId: string) {
    try {
      // This is a simplified version - you might want to create a proper activity log table
      const { data, error } = await this.supabase
        .from("freight_requests")
        .select("id, status, created_at, cargo_description")
        .eq("client_id", userId)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("[DASHBOARD] Error fetching recent activity:", error)
      return []
    }
  }

  async getStats(userId: string, userType: string) {
    try {
      const stats = {
        totalRequests: 0,
        activeRequests: 0,
        completedRequests: 0,
        pendingRequests: 0,
      }

      let query = this.supabase.from("freight_requests").select("status")

      if (userType === "client") {
        query = query.eq("client_id", userId)
      }

      const { data, error } = await query

      if (error) throw error

      if (data) {
        stats.totalRequests = data.length
        stats.activeRequests = data.filter((req) => req.status === "active").length
        stats.completedRequests = data.filter((req) => req.status === "completed").length
        stats.pendingRequests = data.filter((req) => req.status === "pending").length
      }

      return stats
    } catch (error) {
      console.error("[DASHBOARD] Error fetching stats:", error)
      return {
        totalRequests: 0,
        activeRequests: 0,
        completedRequests: 0,
        pendingRequests: 0,
      }
    }
  }
}

export const dashboardService = new DashboardDataService()
