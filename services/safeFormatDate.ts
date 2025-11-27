 // helper seguro para formatar datas
  export const safeFormatDate = (value?: string | Date | null, locale = "pt-AO", opts?: Intl.DateTimeFormatOptions) => {
    if (!value) return "-"
    try {
      const d = typeof value === "string" ? new Date(value) : value
      if (Number.isNaN(d.getTime())) return "-"
      return d.toLocaleDateString(locale, opts)
    } catch {
      return "-"
    }
  }