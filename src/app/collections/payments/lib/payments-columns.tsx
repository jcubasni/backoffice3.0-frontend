import { ColumnDef } from "@tanstack/react-table"
import { Share } from "lucide-react"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { useModalStore } from "@/shared/store/modal.store"
import { PaymentResponse } from "../types/payment.type"

export const paymentsColumns: ColumnDef<PaymentResponse>[] = [
  // {
  //   id: "select",
  //   header: () => {
  //     return <Checkbox classContainer="justify-center" />
  //   },
  // },
  {
    header: "Nro. pago",
    accessorKey: "operationNumber",
  },
  {
    header: "Doc. referencia",
    accessorKey: "reference",
  },
  {
    header: "RUC",
    accessorKey: "client.documentNumber",
  },
  {
    header: "Cliente",
    accessorKey: "client.firstName",
  },
  {
    header: "Fecha pago",
    accessorKey: "paymentDate",
  },
  {
    header: "Total",
    accessorKey: "amount",
  },
  {
    header: "Usado",
    accessorFn: (row) => row.amount - row.remainingAmount,
  },
  {
    header: "Restante",
    accessorKey: "remainingAmount",
  },
  // {
  //   header: "Estado",
  // },
  {
    id: "actions",
    size: 60,
    cell: ({ row }) => {
      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Vincular"
            icon={Share}
            onClick={() => {
              useModalStore
                .getState()
                .openModal("modal-receivable", row.original)
            }}
          />
        </TooltipButton.Box>
      )
    },
  },
]
