import { ColumnDef } from "@tanstack/react-table"
import { Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { formatDateTime } from "@/shared/lib/date"
import { toCapitalize } from "@/shared/lib/words"
import { useModalStore } from "@/shared/store/modal.store"
import { BoxStatus } from "../../types/boxes.type"
import { DailyReportBoxes } from "../../types/daily-report.type"
import { formatBoxStatus } from "./format-status"

export const previewDailyReportColumns: ColumnDef<DailyReportBoxes>[] = [
  {
    id: "code",
    header: "N° de caja",
    cell: ({ row }) => (
      <span className="text-gray-400">#{row.original.cashRegisterCode}</span>
    ),
  },
  {
    id: "opennigDate",
    header: "Fecha de Apertura",
    accessorFn: (row) => formatDateTime(row.opennigDate),
  },
  {
    id: "closedDate",
    header: "Fecha de Cierre",
    accessorFn: (row) => (row.closedDate ? formatDateTime(row.closedDate) : ""),
  },
  {
    id: "responsible",
    header: "Responsable",
    accessorKey: "user",
    accessorFn: (row) => toCapitalize(row.user),
  },
  {
    id: "status",
    header: "Estado",
    size: 0,
    cell: ({ row }) => {
      const status = row.original.state
      const variants = {
        [BoxStatus.OPEN]: "blue",
        [BoxStatus.LIQUIDATED]: "red",
        [BoxStatus.PRELIQUIDATED]: "purple",
        [BoxStatus.PRECLOSED]: "amber",
        [BoxStatus.CLOSED]: "green",
      } as const
      return (
        <Badge variant={variants[status] || "blue"}>
          {formatBoxStatus(status)}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    size: 0,
    cell: ({ row }) => {
      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            onClick={() =>
              useModalStore
                .getState()
                .openModal("modal-delete-daily-report-box", row.original.id)
            }
            icon={Trash}
          />
        </TooltipButton.Box>
      )
    },
  },
]
