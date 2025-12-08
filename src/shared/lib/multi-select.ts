import type { MultiSelectOption } from "@/shared/types/multi-select.type"

export function dataToMulti<T>(
  items: T[] | undefined,
  valueField: keyof T,
  labelField: keyof T,
): MultiSelectOption[] {
  if (!items) return []
  return items.map((item) => ({
    value: String(item[valueField]),
    label: String(item[labelField]),
  }))
}
