import type { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { generatepagination } from "@/shared/lib/pagination.util"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  showSelectPageSize?: boolean
}

export function Pagination<TData>({
  table,
  showSelectPageSize = true,
}: DataTablePaginationProps<TData>) {
  const pageSize = useRef(table.getState().pagination.pageSize)
  if (table.getCoreRowModel().rows.length < pageSize.current) return
  return (
    <div
      className={cn(
        "mt-2 flex select-none flex-col justify-between gap-4 sm:flex-row",
        !showSelectPageSize && "justify-end",
        !showSelectPageSize && table.getPageCount() < 2 && "hidden",
      )}
    >
      {showSelectPageSize && (
        <div className="flex items-center justify-end gap-2">
          <p className="font-medium text-sm">Filas por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-7! w-[70px] border-principal">
              <SelectValue
                className="h-7!"
                placeholder={table.getState().pagination.pageSize}
              />
            </SelectTrigger>
            <SelectContent side="top">
              {generatepagination(pageSize.current).map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div
        className={cn(
          "flex items-center justify-end gap-2",
          table.getPageCount() < 2 && "hidden",
        )}
      >
        <div className="flex w-[100px] items-center justify-center font-medium text-sm">
          {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size={"icon"}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size={"icon"}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size={"icon"}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size={"icon"}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
