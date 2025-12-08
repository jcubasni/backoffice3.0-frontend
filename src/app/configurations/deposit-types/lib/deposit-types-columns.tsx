import { ColumnDef } from "@tanstack/react-table"
import { Switch } from "@/components/ui/switch"
import { StateAudit } from "@/shared/types/state.type"
import { DepositTypeResponse } from "../types/deposit-types.type"

export const depositTypesColumns: ColumnDef<DepositTypeResponse>[] = [
  {
    header: "Código",
    accessorKey: "codeDepositType",
  },
  {
    header: "Descripción",
    accessorKey: "description",
  },
  {
    header: "Tipo de Movimiento",
    accessorKey: "movement_type",
  },
  {
    header: "Estado",
    accessorKey: "stateAudit",
    cell: ({ row, column, table }) => {
      const depositType = row.original
      const isActive = depositType.stateAudit === StateAudit.ACTIVE
      const isDeleted = depositType.stateAudit === StateAudit.DELETED

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
