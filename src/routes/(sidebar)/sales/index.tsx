import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { addDays } from "date-fns"
import { Plus } from "lucide-react"
import { z } from "zod"
import { useGetSales } from "@/app/sales/hooks/sale/useSaleService"
import { salesColumns } from "@/app/sales/lib/voucher/sales-columns"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { formatDate, parseLocalDate } from "@/shared/lib/date"
import { Dates } from "@/shared/lib/date-constans"
import { Routes } from "@/shared/lib/routes"
import { useTitleHeaderStore } from "@/shared/store/title-header.store"

const salesSearchSchema = z.object({
  startDate: z.string().default(formatDate(Dates.SaleStart)),
  endDate: z.string().optional().default(formatDate(Dates.SaleEnd)),
})

export const Route = createFileRoute("/(sidebar)/sales/")({
  component: RouteComponent,
  validateSearch: salesSearchSchema,
  beforeLoad: () => {
    useTitleHeaderStore.getState().setTitle("Ventas")
  },
})

function RouteComponent() {
  const { startDate, endDate } = Route.useSearch()
  const navigate = useNavigate()

  const sales = useGetSales({
    startDate,
    endDate,
  })
  const table = useDataTable({
    data: sales.data,
    columns: salesColumns,
    isLoading: sales.isLoading || sales.isFetching,
  })
  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <DatePicker
            label="Fecha de inicio"
            onSelect={(date) => {
              if (date) {
                navigate({
                  to: Routes.Sales,
                  search: {
                    startDate: formatDate(date),
                    endDate,
                  },
                })
              }
            }}
            defaultValue={startDate}
            max={new Date()}
          />
          <DatePicker
            label="Fecha de fin"
            onSelect={(date) => {
              navigate({
                to: Routes.Sales,
                search: {
                  startDate,
                  endDate: formatDate(date),
                },
              })
            }}
            defaultValue={endDate}
            min={parseLocalDate(startDate)}
            max={addDays(new Date(), 1)}
          />
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Link
            to={Routes.NewSale}
            className={cn(
              buttonVariants({ variant: "default", size: "header" }),
            )}
          >
            <Plus />
            Nueva Venta
          </Link>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
    </>
  )
}
