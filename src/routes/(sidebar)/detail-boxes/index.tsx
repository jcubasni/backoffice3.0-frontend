"use client"

import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { File } from "lucide-react"
import { useEffect, useState } from "react"
import { ModalsBoxes } from "@/app/detail-boxes/components/modals/modals-boxes"
import { useGetDetailBoxes } from "@/app/detail-boxes/hooks/useDetailBoxesService"
import { detailBoxesColumns } from "@/app/detail-boxes/lib/detail-boxes-columns"
import { detailBoxesFilters } from "@/app/detail-boxes/lib/detail-boxes-filters"
import { DetailBoxesSearch, detailBoxesSearchParams } from "@/app/detail-boxes/schemas/detail-box.schema"
import {
  DetailBoxesParams,
  ShortageOverageParams,
} from "@/app/detail-boxes/types/detail-boxes.type"


import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { TabFilter } from "@/shared/components/tab-filter"
import { DataTable } from "@/shared/components/ui/data-table"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { Input } from "@/shared/components/ui/input"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { formatDate } from "@/shared/lib/date"
import { Dates } from "@/shared/lib/date-constans"
import { Routes } from "@/shared/lib/routes"
import { usePanelStore } from "@/shared/store/panel.store"
import { PanelsContainer } from "@/app/sale-report/components/deposit/panel-container"
import DepositReportModal from "@/app/sale-report/components/deposit/modal-filter-report"
import { useModalStore } from "@/shared/store/modal.store"


export const Route = createFileRoute("/(sidebar)/detail-boxes/")({
  component: RouteComponent,
  validateSearch: detailBoxesSearchParams,
  staticData: { headerTitle: "Detalle de cajas" },
})

function RouteComponent() {
  const { dailyReportId, period, startDate, endDate, statusCode } = Route.useSearch()
  const navigate = useNavigate()


  // Params para la API
  const [params, setParams] = useState<DetailBoxesParams>({
    startEndDate: startDate,
    endEndDate: endDate,
    statusCode,
    dailyReportId,
  })



  // Datos para la tabla
  const { data, isLoading, isFetching } = useGetDetailBoxes(params)

  const table = useDataTable({
    data,
    columns: detailBoxesColumns,
    isLoading: isLoading || isFetching,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableRowClickToggle: false,
  })

  useEffect(() => {
    setParams({
      startEndDate: startDate ? formatDate(startDate) : "",
      endEndDate: endDate ? formatDate(endDate) : "",
      statusCode,
      dailyReportId,
    })
  }, [startDate, endDate, statusCode, dailyReportId])

  // Navegar cuando cambian filtros
  const handleFilterChange = <K extends keyof DetailBoxesSearch>(key: K, value: DetailBoxesSearch[K]) => {
    navigate({ to: Routes.DetailBoxes, search: (prev) => ({ ...prev, [key]: value }) })
  }

 const handleOpenDepositReport = () => {
  const selectedRows = table.getSelectedRowModel().rows
  const cashRegisterIds = selectedRows.length
    ? selectedRows.map((row) => ({
        cashRegisterId: row.original.cashRegisterId,
        cashRegisterCode: row.original.cashRegisterCode,
      }))
    : undefined // Si no hay selección, enviamos undefined para que el modal sepa "todas"

  // Abrimos el modal, enviando solo los IDs/infos de cajas seleccionadas
  useModalStore.getState().openModal("modal-deposit-report", {
    cashRegisters: cashRegisterIds,
  })
}



  
  

  const handleOverageClick = () => {
    const cashRegisters = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.cashRegisterCode)
    const params: ShortageOverageParams = {
      startDate,
      endDate,
      cashRegisters,
    }
    usePanelStore.getState().openPanel("shortage-overage-report", params)
  }

  return (
    <>
      {/* Header con filtros y botones */}
      <HeaderContent>
        <HeaderContent.Left>
          <DatePicker
            label="Fecha inicio"
            onSelect={(date) => handleFilterChange("startDate", formatDate(date))}
            defaultValue={startDate}
            min={Dates.DetailBoxesStart}
            max={new Date()}
          />
          <DatePicker
            label="Fecha fin"
            onSelect={(date) => handleFilterChange("endDate", formatDate(date))}
            defaultValue={endDate}
            min={startDate ? new Date(startDate) : Dates.DetailBoxesStart}
            max={new Date()}
          />
          {!!dailyReportId && <Input label="Nº de Parte Diario" readOnly tabIndex={-1} value={period} />}
        </HeaderContent.Left>

        <HeaderContent.Right className="flex flex-wrap items-center gap-2">
          <Button onClick={handleOverageClick} disabled={table.getSelectedRowModel().rows.length === 0} >
            <File className="mr-2" />
            Reporte de Faltante y Sobrante
          </Button>

          <Button onClick={handleOpenDepositReport}>
            <File className="mr-2" />
            Reporte de Depósito de Cajas
          </Button>
        </HeaderContent.Right>
      </HeaderContent>

      


      <DepositReportModal />

      <PanelsContainer />

      {/* Filtros de estado */}
      <TabFilter.Container>
        {detailBoxesFilters.map((filter, index) => (
          <TabFilter
            key={index}
            active={statusCode === filter.statusCode}
            onClick={() => handleFilterChange("statusCode", filter.statusCode)}
          >
            {filter.title}
          </TabFilter>
        ))}
      </TabFilter.Container>

      {/* Tabla */}
      <DataTable table={table} />
      <ModalsBoxes />
    </>
  )
}
