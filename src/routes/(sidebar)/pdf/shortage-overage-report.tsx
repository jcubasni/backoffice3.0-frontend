// src/pages/(sidebar)/pdf/shortage-overage-report.tsx
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { PdfShortageOverageReport } from "@/app/pdf/components/pdf-shortage-overage-report"
import { useShortageOverageReport } from "@/app/pdf/hooks/useReports"
import { ButtonShortageOverageExcel } from "@/app/pdf/components/Excel/ButtonShortageOverageExcel"
import { useTitleHeaderStore } from "@/shared/store/title-header.store"
import { SyncLoader } from "react-spinners"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { parseLocalDate } from "@/shared/lib/date"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

export const Route = createFileRoute("/(sidebar)/pdf/shortage-overage-report")({
  component: RouteComponent,
  beforeLoad: () => {
    useTitleHeaderStore.setState({ title: "Reporte - Faltantes y Sobrantes" })
  },
})


function RouteComponent() {
  const [startDate, setStartDate] = useState("2025-09-01")
  const [endDate, setEndDate] = useState("2025-09-30")
  const [appliedFilters, setAppliedFilters] = useState<{
    startDate: string
    endDate: string
  } | null>(null)
  const [dirty, setDirty] = useState(false)

  const { data, isFetching } = useShortageOverageReport(
    appliedFilters?.startDate || "",
    appliedFilters?.endDate || "",
    {
      enabled: appliedFilters !== null,
    },
  )

  const handleApplyFilters = () => {
    setAppliedFilters({ startDate, endDate })
    setDirty(false)
  }

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {/* 🔹 Card de filtros */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Filtros del reporte</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DatePicker
            label="Fecha inicio"
            defaultValue={startDate}
            max={new Date()}
            onSelect={(date) => {
              if (date) {
                setStartDate(date.toISOString().split("T")[0])
                setDirty(true)
              }
            }}
          />
          <DatePicker
            label="Fecha fin"
            defaultValue={endDate}
            min={parseLocalDate(startDate)}
            max={new Date()}
            onSelect={(date) => {
              if (date) {
                setEndDate(date.toISOString().split("T")[0])
                setDirty(true)
              }
            }}
          />
          <div className="flex items-end">
            <Button onClick={handleApplyFilters} className="w-full">
              Aplicar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 🔹 Botón de exportación */}
      {appliedFilters && !dirty && data && data.length > 0 && (
        <div className="flex justify-end">
          <ButtonShortageOverageExcel
            data={data}
            startDate={appliedFilters.startDate}
            endDate={appliedFilters.endDate}
          />
        </div>
      )}

      {/* 🔹 Reporte PDF */}
      {appliedFilters && !dirty && data && (
        <PdfShortageOverageReport
          startDate={appliedFilters.startDate}
          endDate={appliedFilters.endDate}
        />
      )}

      {/* 🔹 Loading */}
      {isFetching && (
        <div className="flex h-full items-center justify-center">
          <SyncLoader />
        </div>
      )}
    </div>
  )
}
