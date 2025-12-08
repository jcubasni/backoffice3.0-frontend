import { useCallback } from "react"
import type { FieldValues } from "react-hook-form"

export function useFormChanges<T extends FieldValues>() {
  const getChangedFields = useCallback(
    (currentData: T, initialData: Partial<T>): Partial<T> => {
      const changes: Partial<T> = {}

      Object.keys(currentData).forEach((key) => {
        const currentValue = currentData[key as keyof T]
        const initialValue = initialData[key as keyof T]

        // Handle arrays (like localIds)
        if (Array.isArray(currentValue) && Array.isArray(initialValue)) {
          if (
            JSON.stringify(currentValue.sort()) !==
            JSON.stringify(initialValue.sort())
          ) {
            changes[key as keyof T] = currentValue
          }
        } else if (currentValue !== initialValue) {
          changes[key as keyof T] = currentValue
        }
      })

      return changes
    },
    [],
  )

  const hasChanges = useCallback(
    (currentData: T, initialData: Partial<T>): boolean => {
      return Object.keys(getChangedFields(currentData, initialData)).length > 0
    },
    [getChangedFields],
  )

  return {
    getChangedFields,
    hasChanges,
  }
}
