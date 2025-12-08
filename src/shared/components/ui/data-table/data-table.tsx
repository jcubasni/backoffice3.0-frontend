import { Row, Table } from "@tanstack/react-table"
import { JSX } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Table as TableCustom } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { DataTableBody } from "./data-table-body"
import { DataTableHeader } from "./data-table-header"
import { Pagination } from "./pagination"

interface DataTableProps<TData> {
  table: Table<TData> & { isLoading?: boolean }
  renderSubComponent?: (props: { row: Row<TData> }) => JSX.Element
  className?: string
  showSelectPageSize?: boolean
  placeholder?: string
}

export function DataTable<TData>({
  table,
  renderSubComponent,
  className,
  showSelectPageSize,
  placeholder,
}: DataTableProps<TData>) {
  return (
    <div
      className={cn("flex w-full flex-col justify-between gap-2", className)}
    >
      <ScrollArea className="rounded-md border border-border">
        <TableCustom>
          <DataTableHeader table={table} />
          <DataTableBody
            key={table.getRowModel().rows.length}
            table={table}
            isLoading={table.isLoading ?? false}
            renderSubComponent={renderSubComponent}
            placeholder={placeholder}
          />
        </TableCustom>
        <ScrollBar orientation="horizontal" className="absolute! -bottom-3!" />
      </ScrollArea>
      <Pagination table={table} showSelectPageSize={showSelectPageSize} />
    </div>
  )
}
