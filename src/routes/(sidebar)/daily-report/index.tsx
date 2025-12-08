import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { z } from "zod"
import { DailyReportModals } from "@/app/daily-report/components/modals/modals-daily-report"
import { useGetDailyReports } from "@/app/daily-report/hooks/useDailyReportsService"
import { dailyReportColumns } from "@/app/daily-report/lib/daily-report/daily-report-columns"
import { dailyReportFilters } from "@/app/daily-report/lib/daily-report/daily-report-filters"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { TabFilter } from "@/shared/components/tab-filter"
import { DataTable } from "@/shared/components/ui/data-table"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { Routes } from "@/shared/lib/routes"
import { useModalStore } from "@/shared/store/modal.store"

const dailyReportSearchSchema = z.object({
  status: z.string().optional(),
})

export const Route = createFileRoute("/(sidebar)/daily-report/")({
  component: RouteComponent,
  validateSearch: dailyReportSearchSchema,
  staticData: {
    headerTitle: "Lista de cuadres",
  },
})

function RouteComponent() {
  const { status } = Route.useSearch()
  const navigate = useNavigate()

  const currentFilter = status
    ? dailyReportFilters.find((f) => f.id === status) || dailyReportFilters[0]
    : dailyReportFilters[0]

  const { data, isLoading, isFetching } = useGetDailyReports()

  const reportsFilter = currentFilter.filterFn(data ?? [])

  const table = useDataTable({
    data: reportsFilter,
    columns: dailyReportColumns,
    isLoading: isLoading || isFetching,
    enableRowSelection: true,
    enableRowClickToggle: false,
  })

  return (
    <>
      <HeaderContent>
        <HeaderContent.Right>
          <Button
            size="header"
            onClick={() => {
              useModalStore.getState().openModal("modal-create-daily-report")
            }}
          >
            <Plus />
            Generar cuadre
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <TabFilter.Container>
        {dailyReportFilters.map((filter, index) => (
          <TabFilter
            key={index}
            active={filter.id === currentFilter.id}
            onClick={() => {
              navigate({
                to: Routes.DailyReport,
                search: {
                  status: filter.id,
                },
              })
            }}
          >
            {filter.title}
          </TabFilter>
        ))}
      </TabFilter.Container>
      <DataTable table={table} />
      <DailyReportModals />
    </>
  )
}
