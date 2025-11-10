import api from "@/services/api"

export async function getAdminDashboard() {
  const response = await api.get("/users/dashboard")
  return response.data
}
