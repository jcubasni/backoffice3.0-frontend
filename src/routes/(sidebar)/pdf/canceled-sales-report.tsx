// src/pages/(sidebar)/pdf/canceled-sales-report.tsx
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { PdfCanceledSalesReport } from "@/app/pdf/components/pdf-canceled-sales-report"
import { useCanceledSalesReport } from "@/app/pdf/hooks/useReports"
import { ButtonCanceledSalesExcel } from "@/app/pdf/components/Excel/ButtonCanceledSalesExcel"
import { useTitleHeaderStore } from "@/shared/store/title-header.store"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { SyncLoader } from "react-spinners"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { parseLocalDate } from "@/shared/lib/date"
import { MultiSelectForm } from "@/shared/components/form/multi-select-form"
import { useForm, FormProvider } from "react-hook-form"

export const Route = createFileRoute("/(sidebar)/pdf/canceled-sales-report")({
  component: RouteComponent,
  beforeLoad: () => {
    useTitleHeaderStore.setState({ title: "Reporte - Ventas Anuladas" })
  },
})

interface FormValues {
  docTypes: string[]
}

function RouteComponent() {
  const [startDate, setStartDate] = useState("2025-09-01")
  const [endDate, setEndDate] = useState("2025-09-30")
  const [appliedFilters, setAppliedFilters] = useState<{
    startDate: string
    endDate: string
    docTypes: string[]
  } | null>(null)

  const [dirty, setDirty] = useState(false)

  // React Hook Form
  const methods = useForm<FormValues>({
    defaultValues: { docTypes: ["03"] },
  })

  const docTypes = methods.watch("docTypes")

  const { data, isFetching } = useCanceledSalesReport(
    appliedFilters?.startDate || "",
    appliedFilters?.endDate || "",
    appliedFilters?.docTypes || [],
    {
      enabled: appliedFilters !== null,
    },
  )

  const handleApplyFilters = () => {
    setAppliedFilters({ startDate, endDate, docTypes })
    setDirty(false)
  }

  const docTypeOptions = [
    { value: "01", label: "Factura" },
    { value: "03", label: "Boleta" },
    { value: "07", label: "Nota de Crédito" },
    { value: "08", label: "Nota de Débito" },
  ]

  return (
    <FormProvider {...methods}>
      <div className="flex h-full w-full flex-col gap-6">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Filtros del reporte</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
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

            <MultiSelectForm
              name="docTypes"
              label="Tipo de documento"
              options={docTypeOptions}
              defaultOptions={docTypes}
              onChange={(values) => {
                methods.setValue("docTypes", values)
                setDirty(true)
              }}
            />

            <div className="flex items-end">
              <Button onClick={handleApplyFilters} className="w-full">
                Aplicar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Botón de exportación */}
        {appliedFilters && !dirty && data && data.length > 0 && (
          <div className="flex justify-end">
            <ButtonCanceledSalesExcel
              data={data}
              startDate={appliedFilters.startDate}
              endDate={appliedFilters.endDate}
            />
          </div>
        )}

        {/* Reporte PDF */}
        {appliedFilters && !dirty && data && (
          <PdfCanceledSalesReport
            startDate={appliedFilters.startDate}
            endDate={appliedFilters.endDate}
            docTypes={appliedFilters.docTypes}
          />
        )}

        {/* Loading */}
        {isFetching && (
          <div className="flex h-full items-center justify-center">
            <SyncLoader />
          </div>
        )}
      </div>
    </FormProvider>
  )
}
