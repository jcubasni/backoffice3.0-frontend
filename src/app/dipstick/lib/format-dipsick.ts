import { DetailDipstick, Dipstick } from "../types/dipstick.type"

export function getDipstickChanges(
  original: Dipstick[],
  current: Dipstick[],
): DetailDipstick[] {
  // Build a map from record ID → original finalStick value
  const origMap = new Map<string, number>(
    original.map((r) => [r.id, r.finalStick]),
  )

  // Iterate through the current records and collect changes
  return current.reduce<DetailDipstick[]>((acc, row) => {
    const origVal = origMap.get(row.id)

    // If the original value exists and differs from the current,
    // record the change
    if (origVal !== undefined && row.finalStick !== origVal) {
      acc.push({
        id: row.id,
        finalStick: row.finalStick,
      })
    }

    return acc
  }, [])
}
