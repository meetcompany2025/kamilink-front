"use client"

import { useState, useEffect } from "react"

type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<ScreenSize>("md")

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setScreenSize("xs")
      } else if (width < 768) {
        setScreenSize("sm")
      } else if (width < 1024) {
        setScreenSize("md")
      } else if (width < 1280) {
        setScreenSize("lg")
      } else if (width < 1536) {
        setScreenSize("xl")
      } else {
        setScreenSize("2xl")
      }
    }

    // Inicializar
    handleResize()

    // Adicionar listener
    window.addEventListener("resize", handleResize)

    // Limpar listener
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return {
    screenSize,
    isMobile: screenSize === "xs" || screenSize === "sm",
    isTablet: screenSize === "md",
    isDesktop: screenSize === "lg" || screenSize === "xl" || screenSize === "2xl",
  }
}
