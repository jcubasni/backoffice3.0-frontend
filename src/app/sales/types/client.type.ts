export type RetentionResponse = {
  id: number
  startDate?: string
  endDate?: string
  active: boolean
  retentionType: RetentionTypeResponse
}

type RetentionTypeResponse = {
  id: number
  description: string
  percentage: number
  active: boolean
}
