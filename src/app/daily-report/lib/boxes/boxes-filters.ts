import { Filter } from "@/shared/types/filter.type"
import { Box, BoxStatus } from "../../types/boxes.type"

export const boxesFilters: Filter<Box>[] = [
  {
    id: "all",
    title: "Todas",
    filterFn: (boxes: Box[]) => boxes,
  },
  {
    id: "closed",
    title: "Cerradas",
    filterFn: (boxes: Box[]) =>
      boxes.filter((box) => box.state === BoxStatus.CLOSED),
  },
  {
    id: "preclosed",
    title: "Pre-Cerradas",
    filterFn: (boxes: Box[]) =>
      boxes.filter((box) => box.state === BoxStatus.PRECLOSED),
  },
  {
    id: "liquidated",
    title: "Liquidadas",
    filterFn: (boxes: Box[]) =>
      boxes.filter((box) => box.state === BoxStatus.LIQUIDATED),
  },
]

export const formatBoxStatus = (status: BoxStatus): string => {
  switch (status) {
    case BoxStatus.OPEN:
      return "Abierta"
    case BoxStatus.PRECLOSED:
      return "Pre-Cerrada"
    case BoxStatus.CLOSED:
      return "Cerrada"
    case BoxStatus.PRELIQUIDATED:
      return "Pre-Liquidada"
    case BoxStatus.LIQUIDATED:
      return "Liquidada"
    default:
      return "Sin estado"
  }
}
