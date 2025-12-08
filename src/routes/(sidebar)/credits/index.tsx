import { createFileRoute, Link } from "@tanstack/react-router"
import { User } from "lucide-react"
import { useState } from "react"
import { creditColumns } from "@/app/credits/lib/credit-columns"
import { creditFilters } from "@/app/credits/lib/credit-filters"
import { Credit } from "@/app/credits/types/credit.type"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TabFilter } from "@/shared/components/tab-filter"
import { DataTable } from "@/shared/components/ui/data-table"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { Input } from "@/shared/components/ui/input"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { Routes } from "@/shared/lib/routes"
import { Filter } from "@/shared/types/filter.type"

export const Route = createFileRoute("/(sidebar)/credits/")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Creditos",
  },
})

function RouteComponent() {
  const [currentFilter, setCurrentFilter] = useState<Filter<Credit>>(
    creditFilters[0],
  )
  const table = useDataTable({
    columns: creditColumns,
    data: [],
  })

  return (
    <>
      <h2 className="border-b font-semibold text-lg">Datos del cliente</h2>
      <div className="grid grid-cols-3 items-end justify-end gap-4">
        <Input label="Identificacion" />
        <Input label="RUC" disabled />
        <Input label="Cliente" disabled />
        <DatePicker label="Fecha desde" className="w-full!" />
        <DatePicker label="Fecha hasta" className="w-full!" />
        <Button>Consultar</Button>
        <Link
          to={Routes.Clients}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <User />
          Cliente
        </Link>
      </div>

      <TabFilter.Container className="mt-4">
        {creditFilters.map((filter, index) => (
          <TabFilter
            key={index}
            active={currentFilter.id === filter.id}
            onClick={() => setCurrentFilter(filter)}
          >
            {filter.title}
          </TabFilter>
        ))}
      </TabFilter.Container>

      <DataTable table={table} className="flex-1" />

      <div className="grid grid-cols-3 gap-4">
        <Input label="Consumo del cliente" readOnly value="0.00" />
        <Input label="Pagos a cuenta" readOnly value="0.00" />
        <Input label="Saldo deudor" readOnly value="0.00" />
      </div>
    </>
  )
}
