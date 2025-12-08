import { Row, Table } from "@tanstack/react-table"
import { AnimatePresence, motion } from "framer-motion"
import { Fragment, JSX } from "react"
import { PulseLoader } from "react-spinners"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Colors } from "@/shared/types/constans"

interface DataTableBodyProps<TData> {
  table: Table<TData>
  isLoading?: boolean
  renderSubComponent?: (props: { row: Row<TData> }) => JSX.Element
  placeholder?: string
}

export function DataTableBody<TData>({
  table,
  isLoading,
  renderSubComponent,
  placeholder = "No se encontraron resultados",
}: DataTableBodyProps<TData>) {
  const enableRowClickToggle = table.options.meta?.enableRowClickToggle ?? true
  const onDoubleClickRow = table.options.meta?.onDoubleClickRow
  return (
    <TableBody>
      {table.getRowModel().rows?.length && !isLoading ? (
        table.getRowModel().rows.map((row) => (
          <Fragment key={row.id}>
            <TableRow
              data-state={row.getIsSelected() && "selected"}
              className="bg-background hover:cursor-pointer hover:bg-accent transition-all duration-300 ease-in-out"
              onClick={(e) => {
                if (!enableRowClickToggle) return

                const target = e.target as HTMLElement
                if (
                  target.closest(
                    "button, a, input, select, textarea, label, span",
                  )
                )
                  return

                row.toggleSelected()
              }}
              onDoubleClick={(e) => {
                if (!onDoubleClickRow) return

                const target = e.target as HTMLElement
                if (
                  target.closest(
                    "button, a, input, select, textarea, label, span",
                  )
                )
                  return

                onDoubleClickRow(row)
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="border-border text-gray-700 text-sm dark:text-gray-200"
                >
                  {cell.column.columnDef.cell instanceof Function
                    ? cell.column.columnDef.cell(cell.getContext())
                    : cell.column.columnDef.cell}
                </TableCell>
              ))}
            </TableRow>

            <AnimatePresence initial={false}>
              {row.getIsExpanded() && renderSubComponent && (
                <motion.tr layout>
                  <td
                    colSpan={
                      row.getVisibleCells().length +
                      (row.getCanExpand() ? 1 : 0)
                    }
                    className="border-b p-0"
                  >
                    <motion.div
                      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      {renderSubComponent({ row })}
                    </motion.div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </Fragment>
        ))
      ) : (
        <TableRow className="hover:bg-none">
          <TableCell
            colSpan={table.getAllColumns().length}
            className="h-20 text-center text-gray-500"
          >
            <div>
              {isLoading ? (
                <PulseLoader size={8} color={Colors.extra} />
              ) : (
                placeholder
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}
