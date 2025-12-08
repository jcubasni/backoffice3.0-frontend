import { createFileRoute } from "@tanstack/react-router"
import { subWeeks } from "date-fns"
import { BadgePlus } from "lucide-react"
import { useState } from "react"
import { ModalsBankDeposit } from "@/app/bank-deposit/components/modals/modals-bank-deposit"
import { useGetDeposits } from "@/app/bank-deposit/hooks/useBankDepositService"
import { bankDepositColumns } from "@/app/bank-deposit/lib/bank-deposit-columns"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { formatDate } from "@/shared/lib/date"
import { useModalStore } from "@/shared/store/modal.store"

export const Route = createFileRoute("/(sidebar)/bank-deposit/")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Depósitos Bancarios",
  },
})

function RouteComponent() {
  const [startDate, setStartDate] = useState<Date>(subWeeks(new Date(), 3))
  const [endDate, setEndDate] = useState<Date>(new Date())

  const boxDeposits = useGetDeposits({
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  })
  const isLoading = boxDeposits.isLoading || boxDeposits.isFetching

  const table = useDataTable({
    data: boxDeposits.data ?? [],
    columns: bankDepositColumns,
    isLoading: isLoading,
  })
  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <DatePicker
            label="Fecha inicio"
            onSelect={setStartDate}
            defaultValue={formatDate(startDate)}
          />
          <DatePicker
            label="Fecha fin"
            onSelect={setEndDate}
            min={startDate}
            defaultValue={formatDate(endDate)}
          />
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Button
            size="header"
            onClick={() =>
              useModalStore.getState().openModal("modal-add-bank-deposit")
            }
          >
            <BadgePlus />
            Nuevo
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
      <ModalsBankDeposit />
    </>
  )
}
