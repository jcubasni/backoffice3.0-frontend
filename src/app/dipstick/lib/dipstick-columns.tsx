import { ColumnDef } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Input } from "@/shared/components/ui/input"
import { toCapitalize } from "@/shared/lib/words"
import { Dipstick } from "../types/dipstick.type"

export const dipstickColumns: ColumnDef<Dipstick>[] = [
  {
    header: "Tanque",
    accessorFn: (row) => row.tankName,
  },
  {
    header: "Producto",
    accessorFn: (row) => toCapitalize(row.productName),
  },
  {
    header: "Vol. inicial",
    accessorFn: (row) => row.initialStick,
  },
  {
    header: "Ingreso",
    accessorFn: (row) => row.inputs,
  },
  {
    header: "Salida",
    accessorFn: (row) => row.outputs,
  },
  {
    header: "Vol. teorico",
    accessorFn: (row) => row.theoreticalStick,
  },
  // {
  //   header: "Vol. fisico",
  //   accessorFn: (row) => row.finalStick,
  // },
  {
    accessorKey: "finalStick",
    header: "Vol. fisico",
    cell: ({ row, column, table }) => {
      const externalValue = row.getValue<number>("finalStick") ?? 0
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
        />
      )
    },
  },
  {
    header: "Diferencia",
    accessorFn: (row) => row.difference,
  },
]
