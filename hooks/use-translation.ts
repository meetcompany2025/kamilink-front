"use client"

import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"

export function useTranslation() {
  const { language } = useLanguage()

  function t(key: string, params?: Record<string, string | number>) {
    const keys = key.split(".")
    let value = translations[language]

    for (const k of keys) {
      if (value[k] === undefined) {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
      value = value[k]
    }

    if (typeof value !== "string") {
      console.warn(`Translation value is not a string: ${key}`)
      return key
    }

    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{{${paramKey}}}`, "g"), String(paramValue))
      }, value)
    }

    return value
  }

  return { t, language }
}
