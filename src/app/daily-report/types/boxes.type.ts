export type Box = {
  id: number
  cashRegisterCode: string
  opennigDate: string
  closedDate: string | null
  user: string
  state: BoxStatus
}
export type BoxParams = {
  startDate: string
  endDate: string
}
export enum BoxStatus {
  OPEN = 1,
  PRECLOSED = 3,
  CLOSED = 2,
  PRELIQUIDATED = 5,
  LIQUIDATED = 4,
}

export type DeleteDailyReportBoxParams = {
  dailyReportId: string
  cashRegisterId: number
}

export type AddDailyReportBoxParams = {
  dailyReportId: string
  cashRegisterIds: number[]
}
