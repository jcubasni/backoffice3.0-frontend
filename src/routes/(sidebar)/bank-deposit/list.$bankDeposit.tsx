import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { ChevronLeft, Save } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"
import ModalDeleteDailyReport from "@/app/bank-deposit/components/modals/modal-delete-daily-report"
import { useGetSelectedReports } from "@/app/bank-deposit/hooks/useDailyReportService"
import { listDailyReportColumns } from "@/app/bank-deposit/lib/list-daily-report-columns"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { ModalLoader } from "@/shared/components/ui/modal-loader"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { formatCurrency } from "@/shared/lib/number"
import { Routes } from "@/shared/lib/routes"

export const Route = createFileRoute(
  "/(sidebar)/bank-deposit/list/$bankDeposit",
)({
  component: RouteComponent,
  staticData: {
    headerTitle: "Lista de partes diarios",
  },
})

function RouteComponent() {
  const { bankDeposit } = Route.useParams()

  const navigate = useNavigate()
  const { data, isLoading, isFetching } = useGetSelectedReports(bankDeposit)
  const table = useDataTable({
    data: data?.assignedReports,
    columns: listDailyReportColumns,
    isLoading: isLoading || isFetching,
  })
  useEffect(() => {
    if (data?.assignedReports.length === 0) {
      toast.error("No hay reportes asignados a este depósito")
      navigate({ to: Routes.BankDeposit })
    }
  }, [data, navigate])
  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <h2 className="font-semibold text-lg">
            Monton Depositado : {formatCurrency(data?.depositAmount ?? 0)}
          </h2>
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "header" }),
            )}
            to={Routes.BankDeposit}
          >
            <ChevronLeft />
            Regresar
          </Link>
          <Button size="header">
            <Save />
            Grabar
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
      <ModalLoader modalId="modal-delete-daily-report">
        <ModalDeleteDailyReport />
      </ModalLoader>
    </>
  )
}
