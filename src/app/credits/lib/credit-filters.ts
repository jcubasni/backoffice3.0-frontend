import { Filter } from "@/shared/types/filter.type"
import { Credit } from "../types/credit.type"

export const creditFilters: Filter<Credit>[] = [
  {
    id: "all",
    title: "Todas",
    filterFn: (items: any[]) => items,
  },
  {
    id: "closed",
    title: "Canceladas",
    filterFn: (items: any[]) => items,
  },
  {
    id: "preclosed",
    title: "Por pagar",
    filterFn: (items: any[]) => items,
  },
  {
    id: "liquidated",
    title: "Sin facturar",
    filterFn: (items: any[]) => items,
  },
]
