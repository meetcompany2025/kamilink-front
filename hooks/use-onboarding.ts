"use client"

import { useState, useEffect } from "react"

export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(true)

  useEffect(() => {
    const onboardingStatus = localStorage.getItem("kamilink-onboarding-completed")
    if (!onboardingStatus) {
      setHasSeenOnboarding(false)
    }
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem("kamilink-onboarding-completed", "true")
    setHasSeenOnboarding(true)
  }

  return {
    hasSeenOnboarding,
    completeOnboarding,
  }
}
