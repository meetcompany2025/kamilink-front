export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string
          phone: string | null
          user_type: "client" | "transporter"
          company_name: string | null
          tax_id: string | null
          is_verified: boolean
          document_type: "BI" | "NIF" | "Passaporte" | null
          document_number: string | null
          provincia: string | null
          document_uploaded: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name: string
          phone?: string | null
          user_type: "client" | "transporter"
          company_name?: string | null
          tax_id?: string | null
          is_verified?: boolean
          document_type?: "BI" | "NIF" | "Passaporte" | null
          document_number?: string | null
          provincia?: string | null
          document_uploaded?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          phone?: string | null
          user_type?: "client" | "transporter"
          company_name?: string | null
          tax_id?: string | null
          is_verified?: boolean
          document_type?: "BI" | "NIF" | "Passaporte" | null
          document_number?: string | null
          provincia?: string | null
          document_uploaded?: boolean | null
        }
      }
      vehicles: {
        Row: {
          id: string
          created_at: string
          owner_id: string
          vehicle_type: string
          brand: string
          model: string
          license_plate: string
          capacity: string
          year: string | null
          dimensions: string | null
          is_verified: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          owner_id: string
          vehicle_type: string
          brand: string
          model: string
          license_plate: string
          capacity: string
          year?: string | null
          dimensions?: string | null
          is_verified?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          owner_id?: string
          vehicle_type?: string
          brand?: string
          model?: string
          license_plate?: string
          capacity?: string
          year?: string | null
          dimensions?: string | null
          is_verified?: boolean
        }
      }
      freight_requests: {
        Row: {
          id: string
          created_at: string
          client_id: string
          origin_address: string
          origin_city: string
          origin_state: string
          destination_address: string
          destination_city: string
          destination_state: string
          cargo_type: string
          weight: string
          dimensions: string | null
          quantity: string
          description: string | null
          pickup_date: string
          delivery_date: string
          requires_loading_help: boolean
          requires_unloading_help: boolean
          has_insurance: boolean
          status: "pending" | "assigned" | "in_transit" | "delivered" | "cancelled"
          tracking_number: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          client_id: string
          origin_address: string
          origin_city: string
          origin_state: string
          destination_address: string
          destination_city: string
          destination_state: string
          cargo_type: string
          weight: string
          dimensions?: string | null
          quantity: string
          description?: string | null
          pickup_date: string
          delivery_date: string
          requires_loading_help?: boolean
          requires_unloading_help?: boolean
          has_insurance?: boolean
          status?: "pending" | "assigned" | "in_transit" | "delivered" | "cancelled"
          tracking_number?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          client_id?: string
          origin_address?: string
          origin_city?: string
          origin_state?: string
          destination_address?: string
          destination_city?: string
          destination_state?: string
          cargo_type?: string
          weight?: string
          dimensions?: string | null
          quantity?: string
          description?: string | null
          pickup_date?: string
          delivery_date?: string
          requires_loading_help?: boolean
          requires_unloading_help?: boolean
          has_insurance?: boolean
          status?: "pending" | "assigned" | "in_transit" | "delivered" | "cancelled"
          tracking_number?: string | null
        }
      }
      freight_offers: {
        Row: {
          id: string
          created_at: string
          freight_request_id: string
          transporter_id: string
          vehicle_id: string | null
          price: number
          estimated_delivery_date: string | null
          notes: string | null
          status: "pending" | "accepted" | "rejected"
        }
        Insert: {
          id?: string
          created_at?: string
          freight_request_id: string
          transporter_id: string
          vehicle_id?: string | null
          price: number
          estimated_delivery_date?: string | null
          notes?: string | null
          status?: "pending" | "accepted" | "rejected"
        }
        Update: {
          id?: string
          created_at?: string
          freight_request_id?: string
          transporter_id?: string
          vehicle_id?: string | null
          price?: number
          estimated_delivery_date?: string | null
          notes?: string | null
          status?: "pending" | "accepted" | "rejected"
        }
      }
      tracking: {
        Row: {
          id: string
          created_at: string
          freight_request_id: string
          location: string
          status: string
          description: string | null
          latitude: number | null
          longitude: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          freight_request_id: string
          location: string
          status: string
          description?: string | null
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          freight_request_id?: string
          location?: string
          status?: string
          description?: string | null
          latitude?: number | null
          longitude?: number | null
        }
      }
      reviews: {
        Row: {
          id: string
          created_at: string
          freight_request_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          freight_request_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          freight_request_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
        }
      }
    }
  }
}
