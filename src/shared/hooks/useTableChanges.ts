import { useCallback } from "react"

export function useTableChanges<T, U>(
  originalData: T[],
  getIdField: (item: T) => string | number,
  getChangeFields: (item: T, original: T) => boolean,
  mapToUpdate: (item: T) => U,
) {
  const getChanges = useCallback(
    (currentData: T[]): U[] => {
      const changes: U[] = []

      currentData.forEach((item) => {
        const original = originalData.find(
          (orig) => getIdField(orig) === getIdField(item),
        )

        if (original && getChangeFields(item, original)) {
          changes.push(mapToUpdate(item))
        }
      })

      return changes
    },
    [originalData, getIdField, getChangeFields, mapToUpdate],
  )

  return { getChanges }
}
