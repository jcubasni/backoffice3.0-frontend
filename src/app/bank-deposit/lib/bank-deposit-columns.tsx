import { Deposit } from "@bank-deposit/types/bank-deposit.type"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, Eye, ReceiptText, Trash } from "lucide-react"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { formatDate } from "@/shared/lib/date"
import { formatCurrency } from "@/shared/lib/number"
import { Routes } from "@/shared/lib/routes"
import { useModalStore } from "@/shared/store/modal.store"

export const bankDepositColumns: ColumnDef<Deposit>[] = [
  {
    header: "N° depósito",
    cell: ({ row }) => {
      const code = row.original.depositNumber
      return <span className="text-gray-400">#{code}</span>
    },
  },
  {
    header: "N° cuenta",
    accessorFn: (row) => row.accountNumber,
  },
  {
    header: "Fecha depósito",
    accessorFn: (row) => formatDate(row.depositDate),
  },
  {
    header: "Monto depósito",
    accessorFn: (row) => formatCurrency(row.depositAmount),
  },
  {
    id: "actions",
    size: 0,
    cell: ({ row }) => {
      const openModal = useModalStore((state) => state.openModal)
      const hasDetail = row.original.hasDetail
      return (
        <TooltipButton.Box>
          <TooltipButton
            icon={ReceiptText}
            tooltip="Agregar Parte Diario"
            disabled={hasDetail}
            to={Routes.SelectBankDeposit}
            params={{ bankDeposit: row.original.id }}
          />
          <TooltipButton
            icon={Eye}
            tooltip="Ver detalle"
            disabled={!hasDetail}
            to={Routes.ListBankDeposit}
            params={{ bankDeposit: row.original.id }}
          />
          <TooltipButton
            icon={Edit}
            tooltip="Editar"
            onClick={() => openModal("modal-edit-bank-deposit", row.original)}
          />
          <TooltipButton
            icon={Trash}
            tooltip="Eliminar"
            onClick={() =>
              openModal("modal-delete-bank-deposit", row.original.id)
            }
          />
        </TooltipButton.Box>
      )
    },
  },
]
