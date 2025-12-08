import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { PdfDailyReport } from "@/app/pdf/components/daily-report/pdf-daily-report"
import { useTitleHeaderStore } from "@/shared/store/title-header.store"

const dailyReportPdfSearchParams = z.object({
  dailyReportId: z.string(),
})

export const Route = createFileRoute("/(sidebar)/pdf/daily-report")({
  component: RouteComponent,
  validateSearch: dailyReportPdfSearchParams,
  beforeLoad: () => {
    useTitleHeaderStore.setState({ title: "Reporte - Parte Diario" })
  },
})

function RouteComponent() {
  const { dailyReportId } = Route.useSearch()

  return (
    <div className="h-full w-full">
      <PdfDailyReport dailyReportId={dailyReportId} />
    </div>
  )
}
