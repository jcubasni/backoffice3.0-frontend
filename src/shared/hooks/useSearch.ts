import { useMemo } from "react"

function getNestedValue(obj: any, path: string): any {
  if (typeof path !== "string") {
    return obj[path]
  }

  return path.split(".").reduce((current, key) => {
    return current?.[key]
  }, obj)
}

type SearchField<T> = keyof T | string
type SearchFields<T> = SearchField<T>[]

export function useSearch<T extends Record<string, any>>(
  data: T[] | undefined,
  searchTerm: string,
  searchFields: SearchFields<T>,
) : T[] {
  return useMemo(() => {
    if (!data || !data.length) return []
    if (!searchTerm) return data

    const term = searchTerm.toLowerCase()
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = getNestedValue(item, field as string)
        return value?.toString().toLowerCase().includes(term)
      }),
    )
  }, [data, searchTerm, searchFields])
}
