// types/react-table.d.ts o en el mismo archivo si no usas muchos tipos compartidos:
import { RowData } from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void
    enableRowClickToggle?: boolean
    onDoubleClickRow?: (row: Row<TData>) => void
  }
}
