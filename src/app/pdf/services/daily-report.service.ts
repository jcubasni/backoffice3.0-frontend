import { fetchData } from "@/shared/lib/fetch-data"
import { DailyReportPDF } from "../types/daily-report.type"

export const getDailyReport = async (
  dailyReportId: string,
): Promise<DailyReportPDF> => {
  const response = await fetchData<DailyReportPDF>({
    url: `/daily-reports/${dailyReportId}/report`,
  })
  return response
}
