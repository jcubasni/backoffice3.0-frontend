import { Table } from "@tanstack/react-table"
import { DropdownOption } from "@/shared/components/ui/dropdown"

export function getTableColumnOptions<T>(table: Table<T>): DropdownOption[] {
  return table
    .getAllColumns()
    .filter((column) => column.getCanHide())
    .map((column) => ({
      id: column.id,
      label: column.columnDef.header as string,
      type: "checkbox" as const,
      checked: column.getIsVisible(),
      onCheckedChange: (value: boolean) => column.toggleVisibility(value),
    }))
}
