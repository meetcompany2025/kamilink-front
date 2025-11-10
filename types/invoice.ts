// src/types/invoice.ts
export interface Invoice {
  id: string
  invoice_number: string
  issue_date: string
  total_amount: number
  status: "pending" | "paid" | "overdue" | "cancelled"
  invoice_type: "client_invoice" | "transporter_receipt"
  freight_request?: {
    tracking_number?: string
    origin_city: string
    destination_city: string
  }
}
