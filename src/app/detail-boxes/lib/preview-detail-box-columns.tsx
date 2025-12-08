import { ColumnDef } from "@tanstack/react-table"
import { EyeIcon } from "lucide-react"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { formatCurrency } from "@/shared/lib/number"
import { toCapitalize } from "@/shared/lib/words"
import { useModalStore } from "@/shared/store/modal.store"
import { DetailMovementBox } from "../types/detail-box.type"

export const previewDetailBoxColumns: ColumnDef<DetailMovementBox>[] = [
  {
    header: "Tipo de movimiento",
    accessorKey: "movementType",
    accessorFn: (row) => toCapitalize(row.movementType),
  },
  {
    header: "Monto total",
    accessorFn: (row) => formatCurrency(row.totalAmount),
  },
  {
    header: "Monto encontrado",
    accessorFn: (row) => formatCurrency(row.foundAmount ?? 0),
  },
  {
    header: "Diferencia",
    cell: ({ row }) => {
      return <span>{formatCurrency(row.original.difference ?? 0)}</span>
    },
  },
  {
    header: "Observaciones",
    cell: ({ row }) => {
      const observations = row.original.observations
      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Ver observaciones"
            onClick={() =>
              useModalStore.getState().openModal("modal-observations-box", {
                observations,
              })
            }
            icon={EyeIcon}
            disabled={!observations}
          />
        </TooltipButton.Box>
      )
    },
  },
]
