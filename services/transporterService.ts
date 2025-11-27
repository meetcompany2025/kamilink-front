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

export const TransporterDocumentService = {
  /**
   * Envia os documentos do transportador para o backend
   */
  async uploadDocuments(
    transporterId: string,
    identificationFile: File | null,
    driverLicenseFile: File | null,
    documentType: string // 'BI' ou 'NIF'
  ) {
    if (!identificationFile || !driverLicenseFile) {
      throw new Error("Ambos os documentos são obrigatórios")
    }

    const formData = new FormData()

    // Adiciona os arquivos
    formData.append("identification", identificationFile)
    formData.append("driverLicense", driverLicenseFile)

    // Adiciona os tipos de documento como JSON string
    const documentTypes = [documentType, "DRIVER_LICENSE"]
    formData.append("documentTypes", JSON.stringify(documentTypes))

    // Faz a requisição
    const res = await api.post(
      `/uploads/transporter-documents/${transporterId}/upload`,
      formData,
      { noJson: true } // Importante para FormData
    )

    return res.data
  },
}
