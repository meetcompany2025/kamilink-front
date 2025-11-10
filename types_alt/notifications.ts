export type NotificationType = "freight_status" | "new_offer" | "message" | "system"

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  related_id?: string
  is_read: boolean
  created_at: string
}

export interface NotificationCount {
  total: number
  unread: number
}
