import { BoxStatus } from "../../types/boxes.type"
import { DailyReportStatus } from "../../types/daily-report.type"

export const formatDailyReportStatus = (status: DailyReportStatus): string => {
  switch (status) {
    case DailyReportStatus.OPENED:
      return "Pendiente"
    case DailyReportStatus.CLOSED:
      return "Cerrada"
    default:
      return "Sin estado"
  }
}

export const formatBoxStatus = (status: BoxStatus): string => {
  switch (status) {
    case BoxStatus.OPEN:
      return "Abierto"
    case BoxStatus.CLOSED:
      return "Cerrada"
    case BoxStatus.PRECLOSED:
      return "Pre-cerrada"
    case BoxStatus.PRELIQUIDATED:
      return "Pre-liquidada"
    case BoxStatus.LIQUIDATED:
      return "Liquidada"
    default:
      return "Sin estado"
  }
}

export const formatAddDailyReportStatus = (status: BoxStatus): string => {
  switch (status) {
    case BoxStatus.OPEN:
      return "Abierto"
    case BoxStatus.CLOSED:
      return "Cerrada"
    case BoxStatus.PRECLOSED:
      return "Pre-cerrada"
    case BoxStatus.PRELIQUIDATED:
      return "Pre-liquidada"
    case BoxStatus.LIQUIDATED:
      return "Liquidada"
    default:
      return "Sin estado"
  }
}
