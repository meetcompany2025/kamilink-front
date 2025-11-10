"use client"

import type React from "react"

import { useEffect, useState, memo } from "react"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
}

const FadeIn = memo(function FadeIn({ children, className, duration = 300, delay = 0 }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn("transition-opacity", isVisible ? "opacity-100" : "opacity-0", className)}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
})

export default FadeIn
export { FadeIn }
