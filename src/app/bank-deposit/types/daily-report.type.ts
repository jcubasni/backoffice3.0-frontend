export type AvailableReports = {
  dailyReportId: string
  period: string
  totalAmountClosed: number
  totalDepositAmount: number
  balance: number
}

export type AddReportsToDeposit = {
  idDeposit: string
  assignDetails: AssignDetail[]
}

type AssignDetail = {
  dailyReportId: string
  depositAmount: number
}

export type DeleteReportFromDeposit = {
  id: string
  dailyReportIds: string[]
}

export type ReportsOfDeposit = {
  depositNumber: string
  depositAmount: number
  assignedReports: AssignedReport[]
}

export type AssignedReport = {
  id: string
  period: string
  totalDailyReportAmount: number
  totalDepositAmount: number
  balance: number
}
