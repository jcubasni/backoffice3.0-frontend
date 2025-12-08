import {
  CurrencyEntry,
  CurrencyQuantities,
} from "@bank-deposit/types/currency.type"

export const coins = [
  { value: 0.1, name: "10 céntimos" },
  { value: 0.2, name: "20 céntimos" },
  { value: 0.5, name: "50 céntimos" },
  { value: 1, name: "1 sol" },
  { value: 2, name: "2 soles" },
  { value: 5, name: "5 soles" },
]

export const bills = [
  { value: 10, name: "10 soles" },
  { value: 20, name: "20 soles" },
  { value: 50, name: "50 soles" },
  { value: 100, name: "100 soles" },
  { value: 200, name: "200 soles" },
]

export function extractQuantities(
  data: CurrencyEntry[] | undefined,
  type: "MONEDA" | "BILLETE",
): CurrencyQuantities {
  return (data ?? [])
    .filter((entry) => entry.type === type)
    .reduce<CurrencyQuantities>((acc, curr) => {
      acc[curr.denomination] = curr.quantity
      return acc
    }, {})
}
