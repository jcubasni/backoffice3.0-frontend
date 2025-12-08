import { ColumnDef } from "@tanstack/react-table"
import { Currency } from "../types/currencies.type"

export const columnsCurrencies: ColumnDef<Currency>[] = [
  {
    header: "Código",
    accessorKey: "currencyCode",
    enableHiding: false,
  },
  {
    header: "Tipo",
    accessorKey: "currencyType",
    enableHiding: false,
  },
  {
    header: "Descripción corta",
    accessorKey: "simpleDescription",
  },
  {
    header: "Descripción completa",
    accessorKey: "completeDescription",
  },
]
