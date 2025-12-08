import { createFileRoute } from "@tanstack/react-router"
import { FilterPayment } from "@/app/collections/payments/components/filter-payment"
import { ModalsPayment } from "@/app/collections/payments/components/modals/modals-payment"
import { useGetPayments } from "@/app/collections/payments/hooks/usePaymentServive"
import { paymentsColumns } from "@/app/collections/payments/lib/payments-columns"
import { paymentsSearchParams } from "@/app/collections/payments/schemas/payment.schema"
import { DataTable } from "@/shared/components/ui/data-table/data-table"
import { useDataTable } from "@/shared/hooks/useDataTable"

export const Route = createFileRoute("/(sidebar)/collections/payments")({
  component: RouteComponent,
  validateSearch: paymentsSearchParams,
  staticData: {
    headerTitle: "Por pagos",
  },
})

function RouteComponent() {
  const params = Route.useSearch()
  const payments = useGetPayments({
    startDate: params.startDate,
    endDate: params.endDate,
  })
  const table = useDataTable({
    data: payments.data,
    columns: paymentsColumns,
    isLoading: false,
  })

  return (
    <>
      <FilterPayment params={params} />
      <DataTable table={table} className="mt-4 flex-1" />
      <ModalsPayment />
    </>
  )
}
