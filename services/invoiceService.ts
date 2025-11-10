// src/services/invoiceService.ts
import api from "./api"
import { Invoice } from "@/types/invoice"

export const getUserInvoices = async (userId: string): Promise<Invoice[]> => {
  const response = await api.get(`/invoices/user/${userId}`)
  return response.data
}
