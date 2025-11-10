import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes, ReactNode } from "react"

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  provider: string
  className?: string
}

export function SocialButton({ icon, provider, className, ...props }: SocialButtonProps) {
  return (
    <Button variant="outline" className={cn("flex items-center gap-2 w-full justify-center", className)} {...props}>
      {icon}
      <span>Continuar com {provider}</span>
    </Button>
  )
}
