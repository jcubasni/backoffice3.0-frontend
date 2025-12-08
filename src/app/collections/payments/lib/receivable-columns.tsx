import { ColumnDef } from "@tanstack/react-table"
import Big from "big.js"
import { Checkbox } from "@/components/ui/checkbox"
import { DocumentResponse } from "../../documents/types/document.type"

export const receivableColumns = (remainingAmount: number): ColumnDef<DocumentResponse>[] => [
  {
    id: "select",
    size: 30,
    cell: ({ row, table }) => {
      // Obtener todas las filas y ordenarlas por fecha de emisión y vencimiento
      const allRows = table.getRowModel().rows
      const sortedRows = [...allRows].sort((a, b) => {
        const dateA = new Date(a.original.periodStart).getTime()
        const dateB = new Date(b.original.periodStart).getTime()

        // Si tienen la misma fecha de emisión, comparar por fecha de vencimiento
        if (dateA === dateB) {
          const dueA = new Date(a.original.periodEnd).getTime()
          const dueB = new Date(b.original.periodEnd).getTime()
          return dueA - dueB
        }

        return dateA - dateB
      })

      // Encontrar el índice de la fila actual en el array ordenado
      const currentIndex = sortedRows.findIndex(r => r.id === row.id)

      // Verificar si todas las filas anteriores están seleccionadas
      let allPreviousSelected = true
      let accumulatedAmount = new Big(0)

      for (let i = 0; i < currentIndex; i++) {
        const previousRow = sortedRows[i]

        if (previousRow.getIsSelected()) {
          const rowOutstanding = new Big(previousRow.original.amount).minus(previousRow.original.paidAmount)
          // Acumular el monto asignado (puede ser parcial si no hay suficiente saldo)
          const amountToAssign = accumulatedAmount.plus(rowOutstanding).lte(remainingAmount)
            ? rowOutstanding
            : new Big(remainingAmount).minus(accumulatedAmount)
          accumulatedAmount = accumulatedAmount.plus(amountToAssign)
        } else {
          allPreviousSelected = false
          break
        }
      }

      // Verificar si queda saldo disponible para este documento
      const availableAmount = new Big(remainingAmount).minus(accumulatedAmount)
      const hasAvailableBalance = availableAmount.gt(0)

      // Deshabilitar si:
      // 1. No todas las filas anteriores están seleccionadas, O
      // 2. No hay saldo disponible
      // Pero permitir si ya está seleccionada (para poder deseleccionar)
      const isDisabled = row.getIsSelected() ? false : (!allPreviousSelected || !hasAvailableBalance)

      const handleSelectionChange = (value: boolean) => {
        // Si se está deseleccionando, deseleccionar también todas las filas posteriores
        if (!value) {
          // Deseleccionar la fila actual
          row.toggleSelected(false)

          // Deseleccionar todas las filas posteriores en el orden
          for (let i = currentIndex + 1; i < sortedRows.length; i++) {
            const nextRow = sortedRows[i]
            if (nextRow.getIsSelected()) {
              nextRow.toggleSelected(false)
            }
          }
        } else {
          // Si se está seleccionando, solo seleccionar esta fila
          row.toggleSelected(true)
        }
      }

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={handleSelectionChange}
          aria-label="Seleccionar fila"
          disabled={isDisabled}
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "F. Emisión",
    accessorKey: "periodStart",
  },
  {
    header: "F. Vencimiento",
    accessorKey: "periodEnd",
  },
  {
    header: "Nº de documento",
    accessorKey: "documentNumber"
  },
  {
    header: "Monto",
    accessorKey: "amount",
  },
  {
    header: "Por cobrar",
    accessorFn: (row) => {
      const outstanding = new Big(row.amount).minus(row.paidAmount)
      return Number(outstanding.toFixed(2))
    },
  },
]
