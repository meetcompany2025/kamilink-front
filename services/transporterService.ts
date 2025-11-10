import api from "@/services/api"


export async function registerTransporter(data: {
  fullName: string
  email: string
  phone: string
  password: string
  companyName?: string | null
  nif?: string | null
  documentType: string
  documentNumber: string
  provincia: string
  profile: "TRANSPORTER"
  vehicleTypes?: string[] | null
  experienceYears?: number | null
  licensePlate?: string | null
  driverLicense?: string
  availability?: boolean | null
}) {
  console.log(data);
  const response = await api.post("/users", data)
  return response.data
}

export async function getTransporterDashboard() {
  const response = await api.get("/users/dashboard")
  return response.data
}

export async function getAllTransporters() {
  const response = await api.get("transporters")
  return response.data
}

export async function getTransporterById(id: string) {
  const response = await api.get(`transporters/${id}`)
  return response.data
}
