import { useQuery } from "@tanstack/react-query"
import { getDailyReport } from "../services/daily-report.service"

export const useDailyReportService = (dailyReportId: string) => {
  return useQuery({
    queryKey: ["daily-report-pdf", dailyReportId],
    queryFn: () => getDailyReport(dailyReportId),
    enabled: !!dailyReportId,
  })
}
