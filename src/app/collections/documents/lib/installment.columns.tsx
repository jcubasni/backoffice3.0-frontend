import { ColumnDef } from "@tanstack/react-table"
import { InstallmentResponse } from "@/app/billing-notes/types/notes.type"
import { Checkbox } from "@/shared/components/ui/checkbox"

export const installmentColumns: ColumnDef<InstallmentResponse>[] = [
  {
    id: "select",
    size: 60,
    cell: ({ row, table }) => {
      if (row.original.paid) {
        return null
      }

      const allRows = table.getRowModel().rows
      const selection = table.getState().rowSelection
      const rowId = row.id

      const sorted = [...allRows]
        .filter((r) => !r.original.paid)
        .sort(
          (a, b) => a.original.installmentNumber - b.original.installmentNumber,
        )

      const selectedIds = Object.keys(selection)
      const selectedRows = sorted.filter((r) => selectedIds.includes(r.id))
      const currentIndex = sorted.findIndex((r) => r.id === rowId)

      const isSelected = row.getIsSelected()

      const firstUnpaidRow = sorted[0]

      const canSelect =
        isSelected ||
        (selectedIds.length === 0
          ? rowId === firstUnpaidRow?.id
          : currentIndex === selectedIds.length)

      const handleChange = () => {
        const isCurrentlySelected = row.getIsSelected()

        if (isCurrentlySelected) {
          // Deselect this and all later installments
          const currentInstallment = row.original.installmentNumber

          const laterSelectedRows = selectedRows.filter(
            (r) => r.original.installmentNumber > currentInstallment,
          )

          const newSelection = { ...selection }
          delete newSelection[rowId]
          for (const r of laterSelectedRows) {
            delete newSelection[r.id]
          }

          table.setRowSelection(newSelection)
        } else if (canSelect) {
          row.toggleSelected(true)
        }
      }

      return (
        <Checkbox
          checked={isSelected}
          disabled={!canSelect && !isSelected}
          onCheckedChange={handleChange}
          className="mx-auto disabled:border-gray-500/70 disabled:bg-gray-300/70"
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Nº cuota",
    accessorKey: "installmentNumber",
  },
  {
    header: "Fecha de vencimiento",
    accessorKey: "dueDate",
  },
  {
    header: "Monto",
    accessorKey: "amount",
  },
  {
    header: "Cobrado",
    accessorKey: "paidAmount",
  },
  {
    header: "Por cobrar",
    accessorFn: (row) => row.amount - row.paidAmount,
  },
]
