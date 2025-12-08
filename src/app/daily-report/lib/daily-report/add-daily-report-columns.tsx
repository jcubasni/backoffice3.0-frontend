import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDateTime } from "@/shared/lib/date"
import { toCapitalize } from "@/shared/lib/words"
import { Box, BoxStatus } from "../../types/boxes.type"
import { formatBoxStatus } from "./format-status"

export const addBoxesToReportColumns: ColumnDef<Box>[] = [
  {
    id: "actions",
    size: 0,
    cell: ({ row }) => (
      <Checkbox
        className="mx-auto"
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
      />
    ),
  },
  {
    id: "cashRegisterCode",
    header: "N° de caja",
    size: 0,
    accessorKey: "cashRegisterCode",
  },
  {
    id: "opennigDate",
    header: "Fecha de Apertura",
    size: 0,
    accessorFn: (row) => formatDateTime(row.opennigDate),
  },
  {
    id: "closedDate",
    header: "Fecha de Cierre",
    size: 0,
    accessorFn: (row) => (row.closedDate ? formatDateTime(row.closedDate) : ""),
  },
  {
    id: "user",
    header: "Responsable",
    size: 0,
    accessorFn: (row) => toCapitalize(row.user),
  },
  {
    id: "state",
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
]
