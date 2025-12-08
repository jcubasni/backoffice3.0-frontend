import { ColumnDef } from "@tanstack/react-table"
import { Switch } from "@/components/ui/switch"
import { StateAudit } from "@/shared/types/state.type"
import { DocumentResponse } from "../types/documents.type"

export const documentsColumns: ColumnDef<DocumentResponse>[] = [
  {
    header: "Código SUNAT",
    accessorKey: "documentCode",
  },
  {
    header: "Descripción",
    accessorKey: "description",
    cell: ({ row }) => {
      return (
        <p className="max-w-90 text-wrap text-center">
          {row.original.description}
        </p>
      )
    },
  },
  {
    header: "Prefijo de serie",
    accessorKey: "name",
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
]
