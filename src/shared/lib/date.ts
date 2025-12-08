import { addDays, format } from "date-fns"
import { es } from "date-fns/locale"
import { formatInTimeZone, toZonedTime } from "date-fns-tz"

export function formatDate(date: string | Date, dateFormat = "yyyy-MM-dd") {
  // Si es string y termina en Z, es UTC
  if (typeof date === "string" || date?.toString().endsWith("Z")) {
    const d = new Date(date)
    return formatInTimeZone(d, "UTC", dateFormat, { locale: es })
  }
  // Si es string sin Z, agregar tiempo local para evitar desfase
  if (typeof date === "string") {
    const localDate = new Date(`${date}T00:00:00`)
    return format(localDate, dateFormat, { locale: es })
  }
  // Si ya es Date, usar directamente
  const formatted = format(date, dateFormat, { locale: es })
  return formatted
}

export function formatTime(date: string | Date, timeFormat = "HH:mm") {
  if (typeof date === "object") return formatTime(date.toString(), timeFormat)
  // Si es string y termina en Z, es UTC
  if (typeof date === "string" && date.endsWith("Z")) {
    const d = new Date(date)
    return formatInTimeZone(d, "UTC", timeFormat, { locale: es })
  }
  // Si es string sin Z, agregar tiempo local para evitar desfase
  if (typeof date === "string") {
    const localDate = new Date(`${date}T00:00:00`)
    return format(localDate, timeFormat, { locale: es })
  }
  // Si ya es Date, usar directamente
  const formatted = format(date, timeFormat, { locale: es })
  return formatted
}

export function formatDateTime(
  date: string | Date,
  dateFormat = "yyyy-MM-dd HH:mm",
) {
  if (typeof date === "object")
    return formatDateTime(date.toString(), dateFormat)
  // Si es string y termina en Z, es UTC
  if (typeof date === "string" && date.endsWith("Z")) {
    const d = new Date(date)
    return formatInTimeZone(d, "UTC", dateFormat, { locale: es })
  }
  // Si es string sin Z, agregar tiempo local para evitar desfase (solo si es fecha sin hora)
  if (typeof date === "string") {
    const localDate = date.includes("T")
      ? new Date(date)
      : new Date(`${date}T00:00:00`)
    return format(localDate, dateFormat, { locale: es })
  }
  // Si ya es Date, usar directamente
  const formatted = format(date, dateFormat, { locale: es })
  return formatted
}

export function adjustDate(date: string | Date, days: number): string {
  const utcDate = toZonedTime(
    typeof date === "string" ? new Date(date) : date,
    "UTC",
  )
  const shifted = addDays(utcDate, days)
  return format(shifted, "yyyy-MM-dd")
}

export function parseLocalDate(
  dateString: string | undefined,
): Date | undefined {
  if (!dateString) return undefined
  // Agregar tiempo local para evitar el desfase de zona horaria
  return new Date(`${dateString}T00:00:00`)
}
