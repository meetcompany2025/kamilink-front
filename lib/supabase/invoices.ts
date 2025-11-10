import { createClient } from "@/lib/supabase/client"

export interface Invoice {
  id: string
  invoice_number: string
  invoice_type: "client_invoice" | "transporter_receipt"
  issue_date: string
  due_date?: string
  payment_date?: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  status: "pending" | "paid" | "overdue" | "cancelled"
  notes?: string
  payment_terms?: string
  payment_method?: string
  company_name?: string
  company_address?: string
  company_tax_id?: string

  // Related data
  freight_request?: {
    id: string
    tracking_number: string
    origin_address: string
    origin_city: string
    origin_state: string
    destination_address: string
    destination_city: string
    destination_state: string
    cargo_type: string
    weight: string
    dimensions: string
    quantity: string
    description: string
    pickup_date: string
    delivery_date: string
  }

  client?: {
    id: string
    full_name: string
    email: string
    phone: string
    company_name?: string
    address?: string
  }

  transporter?: {
    id: string
    full_name: string
    email: string
    phone: string
    company_name?: string
    address?: string
  }

  items: InvoiceItem[]
  payments: InvoicePayment[]
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total_price: number
  item_type: string
  sort_order: number
}

export interface InvoicePayment {
  id: string
  payment_date: string
  amount: number
  payment_method: string
  reference_number?: string
  status: string
  notes?: string
}

export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  const supabase = createClient()

  try {
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(`
        *,
        freight_request:freight_requests(*),
        client:users!invoices_client_id_fkey(*),
        transporter:users!invoices_transporter_id_fkey(*),
        items:invoice_items(*),
        payments:invoice_payments(*)
      `)
      .eq("id", invoiceId)
      .single()

    if (error) {
      console.error("Error fetching invoice:", error)
      return null
    }

    return invoice as Invoice
  } catch (error) {
    console.error("Error fetching invoice:", error)
    return null
  }
}

export async function getUserInvoices(
  userId: string,
  type?: "client_invoice" | "transporter_receipt",
): Promise<Invoice[]> {
  const supabase = createClient()

  try {
    let query = supabase
      .from("invoices")
      .select(`
        *,
        freight_request:freight_requests(*),
        client:users!invoices_client_id_fkey(*),
        transporter:users!invoices_transporter_id_fkey(*),
        items:invoice_items(*),
        payments:invoice_payments(*)
      `)
      .or(`client_id.eq.${userId},transporter_id.eq.${userId}`)
      .order("created_at", { ascending: false })

    if (type) {
      query = query.eq("invoice_type", type)
    }

    const { data: invoices, error } = await query

    if (error) {
      console.error("Error fetching invoices:", error)
      return []
    }

    return invoices as Invoice[]
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return []
  }
}

export async function generateInvoiceNumber(type: "client_invoice" | "transporter_receipt"): Promise<string> {
  const supabase = createClient()

  const prefix = type === "client_invoice" ? "KL-INV" : "KL-REC"
  const year = new Date().getFullYear()

  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("invoice_number")
      .like("invoice_number", `${prefix}-${year}-%`)
      .order("invoice_number", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error generating invoice number:", error)
      return `${prefix}-${year}-001`
    }

    if (!data || data.length === 0) {
      return `${prefix}-${year}-001`
    }

    const lastNumber = data[0].invoice_number
    const numberPart = Number.parseInt(lastNumber.split("-").pop() || "0")
    const nextNumber = (numberPart + 1).toString().padStart(3, "0")

    return `${prefix}-${year}-${nextNumber}`
  } catch (error) {
    console.error("Error generating invoice number:", error)
    return `${prefix}-${year}-001`
  }
}
