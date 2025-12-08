import { ColumnDef } from "@tanstack/react-table"
import { Switch } from "@/components/ui/switch"
import { Bank } from "../types/banks.type"

export const banksColumns: ColumnDef<Bank>[] = [
  {
    header: "Código",
    accessorKey: "code",
  },
  {
    header: "Nombre del Banco",
    accessorKey: "name",
  },

  {
    header: "Estado",
    accessorKey: "isActive",
    cell: ({ row, column, table }) => {
      const bank = row.original

      const handleChange = (checked: boolean) => {
        table.options.meta?.updateData?.(row.index, column.id, checked)
      }

      return (
        <div className="flex justify-center">
          <Switch checked={!!bank.isActive} onCheckedChange={handleChange} />
        </div>
      )
    },
  },
]
