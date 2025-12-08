import { Filter } from "@/shared/types/filter.type"
import { DailyReport, DailyReportStatus } from "../../types/daily-report.type"

export const dailyReportFilters: Filter<DailyReport>[] = [
  {
    id: "all",
    title: "Todas",
    filterFn: (reports: DailyReport[]) => reports,
  },
  {
    id: "closed",
    title: "Cerradas",
    filterFn: (reports: DailyReport[]) =>
      reports.filter((report) => report.state === DailyReportStatus.CLOSED),
  },
  {
    id: "open",
    title: "Pendientes",
    filterFn: (reports: DailyReport[]) =>
      reports.filter((report) => report.state === DailyReportStatus.OPENED),
  },
]
