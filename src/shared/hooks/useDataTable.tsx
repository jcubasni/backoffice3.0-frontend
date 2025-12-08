import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  RowData,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import isEqual from "lodash/isEqual"
import { useEffect, useRef, useState } from "react"

interface UseDataTableOptions<TData> {
  data?: TData[]
  columns: ColumnDef<TData>[]
  showRows?: number
  isLoading?: boolean
  hiddenColumns?: string[]
  enableRowSelection?: boolean
  enableMultiRowSelection?: boolean
  enableColumnVisibility?: boolean
  enableSorting?: boolean
  enableFilters?: boolean
  getRowCanExpand?: (row: Row<TData>) => boolean
  enableRowClickToggle?: boolean
  onDoubleClickRow?: (row: Row<TData>) => void
}

export function useDataTable<TData extends RowData & Record<string, any>>({
  data: initialData = [],
  columns,
  showRows = 10,
  isLoading = false,
  hiddenColumns = [],
  enableRowSelection = false,
  enableMultiRowSelection = false,
  enableColumnVisibility = false,
  enableSorting = false,
  enableFilters = false,
  getRowCanExpand,
  enableRowClickToggle = true,
  onDoubleClickRow,
}: UseDataTableOptions<TData>) {
  const [tableData, setTableData] = useState<TData[]>(initialData)
  const previousInitialDataRef = useRef<TData[]>(initialData)

  useEffect(() => {
    if (isLoading) return

    const hasChanged = !isEqual(initialData, previousInitialDataRef.current)
    if (hasChanged) {
      setTableData(initialData)
      setRowSelection({})
    }

    previousInitialDataRef.current = initialData
  }, [initialData, isLoading])

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: showRows,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const visibility: VisibilityState = {}
      if (hiddenColumns?.length) {
        hiddenColumns.forEach((col) => {
          visibility[col] = false
        })
      }
      return visibility
    },
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      pagination,
      sorting: enableSorting ? sorting : [],
      columnVisibility: enableColumnVisibility ? columnVisibility : {},
      rowSelection: enableRowSelection ? rowSelection : {},
      columnFilters: enableFilters ? columnFilters : [],
    },
    getRowCanExpand,
    getExpandedRowModel: getExpandedRowModel(),
    enableRowSelection,
    enableMultiRowSelection,
    autoResetPageIndex: false,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: enableFilters ? setColumnFilters : undefined,
    onColumnVisibilityChange: enableColumnVisibility
      ? setColumnVisibility
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        setTableData((old) =>
          old.map((row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row,
          ),
        )
      },
      enableRowClickToggle: enableRowSelection
        ? enableRowClickToggle
        : undefined,
      onDoubleClickRow: enableRowSelection ? onDoubleClickRow : undefined,
    },
  })

  return {
    ...table,
    isLoading,
    enableRowClickToggle,
    onDoubleClickRow,
  }
}
