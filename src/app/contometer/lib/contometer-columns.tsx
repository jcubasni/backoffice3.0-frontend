import { ColumnDef } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Input } from "@/shared/components/ui/input"
import { formatCurrency } from "@/shared/lib/number"
import { toCapitalize } from "@/shared/lib/words"
import { Contometer } from "../types/contometer.type"

export const contometerColumns: ColumnDef<Contometer>[] = [
  {
    header: "Lado",
    accessorFn: (row) => toCapitalize(row.sideName),
  },
  {
    header: "Manguera",
    accessorFn: (row) => toCapitalize(row.hoseName),
  },
  {
    header: "Producto",
    accessorFn: (row) => toCapitalize(row.productForeignName),
  },
  {
    header: "Galonaje",
  },
  {
    header: "CM inicial",
    accessorFn: (row) => formatCurrency(row.initialCm),
  },
  {
    header: "CM teorico",
    accessorFn: (row) => formatCurrency(row.initialCm),
  },
  {
    accessorKey: "finalCm",
    header: "CM final",
    cell: ({ row, column, table }) => {
      const externalValue = row.getValue<number>("finalCm") ?? 0
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
]
