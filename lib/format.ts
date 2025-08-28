import { format, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export const formatDate = (date: Date): string => {
  return format(date, "dd/MM/yyyy", { locale: es })
}

export const formatDateTime = (date: Date): string => {
  return format(date, "dd/MM/yyyy HH:mm", { locale: es })
}

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true, locale: es })
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("es-AR").format(num)
}

export const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`
}
