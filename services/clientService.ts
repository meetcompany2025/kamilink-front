import api from "@/services/api"


export async function registerClient(data: {
  fullName: string
  email: string
  phone: string
  password: string
  accountType: "INDIVIDUAL" | "COMPANY"
  companyName?: string | null
  nif?: string | null
  documentType: string
  documentNumber: string
  provincia: string
  profile: "CLIENT"
}) {
  console.log(data);
  const response = await api.post("/users", data)
  return response.data
}

export async function getClientDashboard() {
  const response = await api.get("/users/dashboard")
  return response.data
}

export async function getAllClients() {
  const response = await api.get("/clients")
  return response.data
}

export async function getClientById(id: string) {
  const response = await api.get(`/clients/${id}`)
  return response.data
}
