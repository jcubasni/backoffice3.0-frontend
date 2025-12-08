import type { ColumnDef } from "@tanstack/react-table"
import { DollarSign, Edit } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { formatCurrency } from "@/shared/lib/number"
import { useModalStore } from "@/shared/store/modal.store"
import { CardResponse } from "../types/plate.type"

export const plateColumns: ColumnDef<CardResponse>[] = [
  {
    accessorKey: "vehicle.plate",
    header: "Placa",
  },
  {
    accessorKey: "balance",
    header: "Saldo",
    accessorFn: (row) => formatCurrency(row.balance),
  },
  {
    accessorKey: "cardNumber",
    header: "N° Tarjeta",
  },
  {
    accessorKey: "product.name",
    header: "Producto",
  },
  {
    accessorKey: "bloquear",
    header: "Estado",
    cell: ({ row }) => {
      const state = row.original.status === 1
      return <Switch checked={state} />
    },
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const plate = row.original
      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            onClick={() => {
              console.log("Editar placa:", plate)
            }}
            icon={Edit}
          />
          <TooltipButton
            tooltip="Gestionar saldo"
            onClick={() => {
              useModalStore
                .getState()
                .openModal("modal-update-balance", plate.accountCardId)
            }}
            icon={DollarSign}
          >
            <DollarSign className="h-4 w-4" />
          </TooltipButton>
        </TooltipButton.Box>
      )
    },
  },
]
