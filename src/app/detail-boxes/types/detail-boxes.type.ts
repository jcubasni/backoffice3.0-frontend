export type DetailBoxes = {
  cashRegisterId: string
  cashRegisterCode: string
  openingDate: string
  responsible: Responsible
  statusCode: DetailBoxesStatus
}

type Responsible = {
  name: string
  username: string
}

export enum DetailBoxesStatus {
  OPEN = 1,
  PRECLOSED = 3,
  CLOSED = 2,
  LIQUIDATED = 4,
  PRELIQUIDATED = 5,
}

export type DetailBoxesParams = {
  startEndDate?: string
  endEndDate?: string
  statusCode?: DetailBoxesStatus
  dailyReportId?: string
}

export type ShortageOverageParams = {
  startDate?: string
  endDate?: string
  cashRegisters?: string[]
    mode?: "cashRegister" | "user" 
}

export type ShortageOverageResponse = {
  shiftName: string
  processDate: string
  cashRegisterCode: number
  cashierName: string
  depositCash: string
  depositCard: string
  totalDeposit: string
  salesCash: string
  salesCard: string
  totalSales: string
  shortageOverage: string
}
