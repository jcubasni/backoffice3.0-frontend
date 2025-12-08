import { ColumnDef } from "@tanstack/react-table"
import { Edit } from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "@/shared/components/ui/input"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { formatCurrency } from "@/shared/lib/number"
import { toCapitalize } from "@/shared/lib/words"
import { useModalStore } from "@/shared/store/modal.store"
import { DetailMovementBox } from "../types/detail-box.type"

export const detailBoxColumns = (
  isEditable: boolean,
): ColumnDef<DetailMovementBox>[] => [
  {
    header: "Tipo de movimiento",
    accessorFn: (row) => toCapitalize(row.movementType),
  },
  {
    header: "Depositado",
    accessorFn: (row) => formatCurrency(row.totalAmount),
  },
  {
    accessorKey: "foundAmount",
    header: "Encontrado",
    cell: ({ row, column, table }) => {
      const externalValue = row.getValue<number>("foundAmount") ?? 0
      const [value, setValue] = useState(externalValue)

      useEffect(() => {
        setValue(externalValue)
      }, [externalValue])

      return (
        <Input
          type="number"
          size={"sm"}
          value={value}
          onChange={(e) => {
            setValue(Number(e.target.value))
            table.options.meta?.updateData?.(
              row.index,
              column.id,
              Number(e.target.value),
            )
          }}
          min={0}
          className="mx-auto w-4/6 text-center"
          readOnly={!isEditable}
        />
      )
    },
  },
  {
    id: "diference",
    header: "Diferencia",
    cell: ({ row }) => {
      const found = row.original.foundAmount ?? 0
      const total = row.original.totalAmount
      return formatCurrency(found - total)
    },
  },
  {
    id: "observations",
    header: "Observaciones",
    cell: ({ row, column, table }) => {
      const [tempValue, setTempValue] = useState<string>(
        row.original.observations ?? "",
      )

      useEffect(() => {
        table.options.meta?.updateData?.(row.index, column.id, tempValue)
      }, [tempValue])
      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            onClick={() =>
              useModalStore.getState().openModal("modal-observations-box", {
                data: row.original.observations,
                changeData: (data: string) => {
                  setTempValue(data)
                },
              })
            }
            icon={Edit}
            disabled={!isEditable}
          />
        </TooltipButton.Box>
      )
    },
  },
]
