import { ColumnDef } from "@tanstack/react-table"
import { DetailBoxesStatus } from "@/app/detail-boxes/types/detail-boxes.type"
import { Badge } from "@/components/ui/badge"
import { DAY_TIME } from "@/lib/utils"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { formatDate, formatTime } from "@/shared/lib/date"
import { toCapitalize } from "@/shared/lib/words"
import { Box } from "../../types/boxes.type"
import { formatBoxStatus } from "./boxes-filters"

export const boxesColumns: ColumnDef<Box>[] = [
  {
    id: "actions",
    size: 60,
    cell: ({ row, table }) => {
      const all = table.getRowModel().rows
      // ordenar por fecha de apertura ascendente
      const sorted = [...all].sort(
        (a, b) =>
          new Date(a.original.opennigDate).getTime() -
          new Date(b.original.opennigDate).getTime(),
      )
      // fecha mínima (sin horas)
      const oldestDate = new Date(sorted[0].original.opennigDate)
      oldestDate.setHours(0, 0, 0, 0)

      // fecha de la fila actual (sin horas)
      const thisDate = new Date(row.original.opennigDate)
      thisDate.setHours(0, 0, 0, 0)

      // diferencia en días
      const diffDays = (thisDate.getTime() - oldestDate.getTime()) / DAY_TIME

      // solo permitir seleccionar si es el día más antiguo (diff=0)
      // o el día siguiente (diff=1)
      const canSelect = diffDays === 0 || diffDays === 1
      const isSel = row.getIsSelected()

      const handleChange = () => {
        if (isSel) row.toggleSelected(false)
        else if (canSelect) row.toggleSelected(true)
      }

      return (
        <Checkbox
          classContainer="justify-center"
          className="mx-auto"
          checked={isSel}
          disabled={!canSelect && !isSel}
          onCheckedChange={handleChange}
        />
      )
    },
  },
  {
    header: "N° de caja",
    cell: ({ row }) => {
      const code = row.original.cashRegisterCode
      return <span className="text-gray-400">#{code}</span>
    },
  },
  {
    header: "Fecha de inicio",
    accessorFn: (row) => formatDate(row.opennigDate),
  },
  {
    header: "Hora de inicio",
    accessorFn: (row) => formatTime(row.opennigDate),
  },
  {
    header: "Fecha de fin",
    accessorFn: (row) => (row.closedDate ? formatDate(row.closedDate) : ""),
  },
  {
    header: "Hora de fin",
    accessorFn: (row) => (row.closedDate ? formatTime(row.closedDate) : ""),
  },
  {
    header: "Responsable",
    accessorFn: (row) => toCapitalize(row.user),
  },
  {
    header: "Estado",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.state
      const variants = {
        [DetailBoxesStatus.OPEN]: "blue",
        [DetailBoxesStatus.LIQUIDATED]: "red",
        [DetailBoxesStatus.PRELIQUIDATED]: "purple",
        [DetailBoxesStatus.PRECLOSED]: "amber",
        [DetailBoxesStatus.CLOSED]: "green",
      } as const
      return (
        <Badge variant={variants[status] || "blue"}>
          {formatBoxStatus(status)}
        </Badge>
      )
    },
  },
]
