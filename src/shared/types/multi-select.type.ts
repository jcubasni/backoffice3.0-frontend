import type { LucideIcon } from "lucide-react"

export interface MultiSelectOption {
  default?: boolean
  label: string
  value: string
  icon?: LucideIcon
}
