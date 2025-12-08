import { ColumnDef } from "@tanstack/react-table"
import { Edit } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { useModalStore } from "@/shared/store/modal.store"
import { StateAudit } from "@/shared/types/state.type"
import { BankAccount } from "../types/bank-accounts.type"

export const bankAccountsColumns: ColumnDef<BankAccount>[] = [
  {
    header: "Nº Cuenta Bancaria",
    accessorKey: "accountNumber",
  },
  {
    header: "Banco",
    cell: ({ row }) => <span>{row.original.bank?.name ?? "-"}</span>,
  },
  {
    header: "Moneda",
    cell: ({ row }) => (
      <span>{row.original.currency?.simpleDescription ?? "-"}</span>
    ),
  },
  {
    header: "Estado",
    accessorKey: "stateAudit",
    cell: ({ row, column, table }) => {
      const document = row.original
      const isActive = document.stateAudit === StateAudit.ACTIVE
      const isDeleted = document.stateAudit === StateAudit.DELETED

      const handleChange = (checked: boolean) => {
        const newState = checked ? StateAudit.ACTIVE : StateAudit.INACTIVE
        table.options.meta?.updateData?.(row.index, column.id, newState)
      }

      return (
        <Switch
          checked={isActive}
          onCheckedChange={handleChange}
          disabled={isDeleted}
        />
      )
    },
  },
  {
    id: "actions",
    size: 0,
    cell: ({ row }) => {
      const item = row.original
      const openModal = useModalStore.getState().openModal
      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            onClick={() => openModal("modal-edit-bank-account", item)}
            icon={Edit}
          />
        </TooltipButton.Box>
      )
    },
  },
]
