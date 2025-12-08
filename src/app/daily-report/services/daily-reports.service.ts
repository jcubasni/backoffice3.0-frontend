import { fetchData } from "@/shared/lib/fetch-data"
import { AddDailyReport } from "../types/add-daily-report.type"
import { DailyReport, DailyReportBoxes } from "../types/daily-report.type"

export const getDailyReports = async (): Promise<DailyReport[]> => {
  const response = await fetchData<DailyReport[]>({
    url: "/daily-reports",
  })
  return response
}

export const getDailyReportBoxes = async (
  dailyReportId: string,
): Promise<DailyReportBoxes[]> => {
  const response = await fetchData<DailyReportBoxes[]>({
    url: `/daily-reports/${dailyReportId}/cash-registers`,
  })
  return response
}

export const addDailyReport = async (data: AddDailyReport) => {
  const response = await fetchData<any>({
    url: "/daily-reports",
    method: "POST",
    body: data,
  })
  return response
}

export const closeDailyReport = async (dailyReportId: string) => {
  const response = await fetchData<any>({
    url: `/daily-reports/${dailyReportId}/close`,
    method: "PATCH",
  })
  return response
}
