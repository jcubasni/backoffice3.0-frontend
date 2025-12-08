import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { ChevronLeft, ClipboardPlus } from "lucide-react"
import { useState } from "react"
import z from "zod"
import { useGetBoxes } from "@/app/daily-report/hooks/useBoxesService"
import { useAddDailyReport } from "@/app/daily-report/hooks/useDailyReportsService"
import { boxesColumns } from "@/app/daily-report/lib/boxes/boxes-columns"
import { boxesFilters } from "@/app/daily-report/lib/boxes/boxes-filters"
import { Box } from "@/app/daily-report/types/boxes.type"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { TabFilter } from "@/shared/components/tab-filter"
import { DataTable } from "@/shared/components/ui/data-table"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { adjustDate } from "@/shared/lib/date"
import { Routes } from "@/shared/lib/routes"
import { Filter } from "@/shared/types/filter.type"

const generateSearchParams = z.object({
  date: z.string().refine((val) => !Number.isNaN(Date.parse(val))),
})

export const Route = createFileRoute("/(sidebar)/daily-report/generate")({
  component: RouteComponent,
  validateSearch: generateSearchParams,
  staticData: {
    headerTitle: "Lista de cajas",
  },
  onError: (error) => {
    if (error.routerCode === "VALIDATE_SEARCH") {
      throw redirect({ to: Routes.DailyReport, replace: true })
    }
  },
})

function RouteComponent() {
  const { date } = Route.useSearch()
  const navigate = useNavigate()
  const createReport = useAddDailyReport()
  const [currentFilter, setCurrentFilter] = useState<Filter<Box>>(
    boxesFilters[0],
  )

  const { data, isLoading, isFetching } = useGetBoxes({
    startDate: date,
    endDate: adjustDate(date, 1),
  })

  const filterBoxes = currentFilter.filterFn(data ?? [])

  const table = useDataTable({
    data: filterBoxes,
    columns: boxesColumns,
    isLoading: isLoading || isFetching,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableRowClickToggle: false,
  })

  const handleGenerateReport = () => {
    const selectedBoxes = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id)
    createReport.mutate({
      dailyReportDate: date,
      cashRegisterIds: selectedBoxes,
    })
  }

  return (
    <>
      <HeaderContent>
        <HeaderContent.Right>
          <Button
            size="header"
            onClick={() => {
              navigate({ to: Routes.DailyReport })
            }}
          >
            <ChevronLeft />
            Regresar
          </Button>
          <Button
            size="header"
            disabled={table.getSelectedRowModel().rows.length === 0}
            onClick={handleGenerateReport}
          >
            <ClipboardPlus />
            Generar Parte diario
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <TabFilter.Container>
        {boxesFilters.map((filter, index) => (
          <TabFilter
            key={index}
            active={currentFilter.id === filter.id}
            onClick={() => setCurrentFilter(filter)}
          >
            {filter.title}
          </TabFilter>
        ))}
      </TabFilter.Container>
      <DataTable table={table} />
    </>
  )
}
