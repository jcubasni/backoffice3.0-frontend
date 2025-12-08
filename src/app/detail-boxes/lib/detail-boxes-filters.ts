import { DetailBoxesStatus } from "../types/detail-boxes.type"

export const detailBoxesFilters = [
  {
    id: "all",
    title: "Todas",
  },
  {
    id: "open",
    title: "Abiertas",
    statusCode: DetailBoxesStatus.OPEN,
  },
  {
    id: "preclosed",
    title: "Pre-Cerradas",
    statusCode: DetailBoxesStatus.PRECLOSED,
  },
  {
    id: "closed",
    title: "Cerradas",
    statusCode: DetailBoxesStatus.CLOSED,
  },
  {
    id: "preliquidated",
    title: "Pre-Liquidadas",
    statusCode: DetailBoxesStatus.PRELIQUIDATED,
  },
  {
    id: "liquidated",
    title: "Liquidadas",
    statusCode: DetailBoxesStatus.LIQUIDATED,
  },
]

export const formatDetailBoxesStatus = (status: number): string => {
  switch (status) {
    case DetailBoxesStatus.OPEN:
      return "Abierta"
    case DetailBoxesStatus.PRECLOSED:
      return "Pre-Cerrada"
    case DetailBoxesStatus.CLOSED:
      return "Cerrada"
    case DetailBoxesStatus.PRELIQUIDATED:
      return "Pre-Liquidada"
    case DetailBoxesStatus.LIQUIDATED:
      return "Liquidada"
    default:
      return "Sin estado"
  }
}
