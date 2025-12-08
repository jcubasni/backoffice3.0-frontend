import { BoxStatus } from "./boxes.type"

export type DailyReport = {
  id: string
  period: string
  openedAt: string
  closedAt: string | null
  createdAt: string
  allLiquidated: boolean
  state: BoxStatus
}

export enum DailyReportStatus {
  OPENED = "A",
  CLOSED = "C",
}

export type DailyReportBoxes = {
  id: string
  cashRegisterCode: string
  opennigDate: string
  closedDate: string | null
  user: string
  state: BoxStatus
}
