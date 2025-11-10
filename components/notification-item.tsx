"use client"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Bell, MessageSquare, Package, AlertCircle } from "lucide-react"
import type { Notification, NotificationType } from "@/types/notifications"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const { id, title, message, type, isRead, createdAt, relatedId } = notification

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "FREIGHT_STATUS":
        return <Package className="h-5 w-5 text-blue-500" />
      case "NEW_REQUEST":
        return <Bell className="h-5 w-5 text-green-500" />
      case "MESSAGE":
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      case "SYSTEM":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
    }
  }

  const getHref = () => {
    switch (type) {
      case "FREIGHT_STATUS":
        return relatedId ? `/services/tracking?id=${relatedId}` : "/dashboard"
      case "NEW_REQUEST":
        return relatedId ? `/services/quotes?id=${relatedId}` : "/services/quotes"
      case "MESSAGE":
        return "/messages"
      default:
        return "#"
    }
  }

  const handleClick = () => {
    if (!isRead) {
      onMarkAsRead(id)
    }
  }

  return (
    <Link
      href={getHref()}
      onClick={handleClick}
      className={cn("block p-4 border-b hover:bg-muted/50 transition-colors", !isRead && "bg-muted/30")}
    >
      <div className="flex gap-3">
        <div className="mt-0.5">{getIcon(type)}</div>
        <div className="flex-1">
          <h4 className={cn("font-medium", !isRead && "font-semibold")}>{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ptBR })}
          </p>
        </div>
        {!isRead && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>}
      </div>
    </Link>
  )
}
