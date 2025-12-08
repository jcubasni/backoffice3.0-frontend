export type PreviewDailyReport = {
  id: number
  opennigDate: string
  closedDate: string | null
  user: string
  state: PreviewDailyReportStatus
}

export enum PreviewDailyReportStatus {
  OPEN = 1,
  PRECLOSED = 3,
  CLOSED = 2,
  LIQUIDATED = 4,
}
