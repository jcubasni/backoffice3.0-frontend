import { AvailableReports } from "@bank-deposit/types/daily-report.type"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { formatCurrency } from "@/shared/lib/number"

export const selectDailyReportColumns = (
  monto: number,
): ColumnDef<AvailableReports>[] => [
  {
    id: "select",
    size: 60,
    cell: ({ row, table }) => {
      const allRows = table.getRowModel().rows
      const selection = table.getState().rowSelection
      const rowId = row.id

      const sorted = [...allRows].sort(
        (a, b) =>
          new Date(a.original.period).getTime() -
          new Date(b.original.period).getTime(),
      )

      const selectedIds = Object.keys(selection)
      const selectedRows = sorted.filter((r) => selectedIds.includes(r.id))
      const currentIndex = sorted.findIndex((r) => r.id === rowId)

      const isSelected = row.getIsSelected()

      const oldestRow = sorted[0]

      // Calcular cuánto monto queda por asignar usando balance en lugar de totalDepositAmount
      const remainingAmount =
        monto - selectedRows.reduce((acc, r) => acc + r.original.balance, 0)

      const canSelect =
        isSelected ||
        (selectedIds.length === 0
          ? rowId === oldestRow.id
          : currentIndex <= selectedIds.length && remainingAmount > 0)

      const handleChange = () => {
        const isCurrentlySelected = row.getIsSelected()

        if (isCurrentlySelected) {
          // Buscar fecha de la fila actual
          const currentDate = new Date(row.original.period).getTime()

          // Obtener las filas más recientes que la actual y seleccionadas
          const newerSelectedRows = selectedRows.filter(
            (r) => new Date(r.original.period).getTime() > currentDate,
          )

          // Deseleccionar esta y todas las más recientes
          const newSelection = { ...selection }
          delete newSelection[rowId]
          newerSelectedRows.forEach((r) => {
            delete newSelection[r.id]
          })

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
  },
  {
    header: "N° parte diario",
    accessorKey: "period",
  },
  {
    header: "Monto",
    accessorFn: (row) => formatCurrency(row.totalAmountClosed),
  },
  {
    header: "Saldo",
    // Usar balance en lugar de totalDepositAmount
    accessorFn: (row) => formatCurrency(row.balance),
  },
  {
    header: "Monto ingresado",
    cell: ({ row, table }) => {
      const allRows = table.getRowModel().rows
      const selection = table.getState().rowSelection

      const sorted = [...allRows].sort(
        (a, b) =>
          new Date(a.original.period).getTime() -
          new Date(b.original.period).getTime(),
      )

      const selectedIds = Object.keys(selection)
      const selectedRows = sorted.filter((r) => selectedIds.includes(r.id))

      let remaining = monto
      for (const r of selectedRows) {
        // Usar balance en lugar de totalDepositAmount
        const saldo = r.original.balance
        const ingresado = Math.min(remaining, saldo)
        if (r.id === row.id) {
          return formatCurrency(ingresado)
        }
        remaining -= ingresado
        if (remaining <= 0) break
      }

      return formatCurrency(0)
    },
  },
]
