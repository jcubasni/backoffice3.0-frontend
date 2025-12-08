import { Table } from "@tanstack/react-table"
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataTableHeaderProps<TData> {
  table: Table<TData>
}

export function DataTableHeader<TData>({ table }: DataTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow className="bg-muted font-bold" key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              className="font-semibold"
              style={{ width: `${header.getSize()}px` }}
            >
              {header.isPlaceholder
                ? null
                : header.column.columnDef.header instanceof Function
                  ? header.column.columnDef.header(header.getContext())
                  : header.column.columnDef.header}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  )
}
