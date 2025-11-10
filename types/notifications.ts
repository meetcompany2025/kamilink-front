export type NotificationType = "FREIGHT_STATUS" | "NEW_REQUEST" | "MESSAGE" | "SYSTEM"

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  relatedId?: string
  isRead: boolean
  createdAt: string
}

export interface NotificationCount {
  total: number
  unread: number
}

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedId?: string;
}
