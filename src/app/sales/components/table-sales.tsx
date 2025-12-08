import { Link, useNavigate } from "@tanstack/react-router"
import { addDays } from "date-fns"
import { Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { formatDate, parseLocalDate } from "@/shared/lib/date"
import { Routes } from "@/shared/lib/routes"
import { useGetSales } from "../hooks/sale/useSaleService"
import { salesColumns } from "../lib/voucher/sales-columns"

interface TableSalesProps {
  startDate: string
  endDate?: string
}

export const TableSales = ({ startDate, endDate }: TableSalesProps) => {
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
      <Card>
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
                buttonVariants({ variant: "outline", size: "header" }),
              )}
            >
              <Plus />
              Nueva Venta
            </Link>
          </HeaderContent.Right>
        </HeaderContent>
      </Card>
      <Card className="flex-1">
        <DataTable table={table} />
      </Card>
    </>
  )
}
